import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// DataForSEO (Google Ads keyword data). Two paid calls, each billed per
// request — 1 keyword or 1,000 cost the same — so callers batch:
//   • volume: monthly searches for keywords we already track (daily sync)
//   • ideas:  related searches + their volumes from seed phrases (Monday
//             research by the content agent)
// Every request goes through spend(): budget check first, then the call,
// then the real cost recorded in dataforseo_usage (the monthly cap) and a
// row in dataforseo_calls (the activity log shown in the admin).

const API = "https://api.dataforseo.com/v3";

// Worst-case cost of one request, used to decide whether there's room left
// in the budget before making it. The real cost is what gets recorded.
export const ESTIMATED_COST_PER_REQUEST_USD = 0.1;

// Google Ads rejects keywords over 80 chars, over 10 words, or with most
// punctuation — one bad keyword fails the whole request, so filter first.
const VALID_KEYWORD = /^[a-z0-9 '&.-]{1,80}$/;

// Volumes are measured in the Philadelphia TV market (Nielsen DMA), which
// covers South Jersey, Philadelphia and its suburbs, and Wilmington — the
// searches Google answers with local results for ONPRO IT. Resolved from
// DataForSEO's own location list (free) rather than hard-coding a code.
const MARKET_SEARCH = "Philadelphia PA";
const US = { code: 2840, name: "United States" };
const MARKET_SETTING_KEY = "dataforseo_market";

export function isDataForSeoConfigured(): boolean {
  return Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);
}

export function getMonthlyBudgetUsd(): number {
  const n = Number(process.env.DATAFORSEO_MONTHLY_BUDGET_USD);
  return Number.isFinite(n) && n >= 0 ? n : 3;
}

export function isValidVolumeKeyword(keyword: string): boolean {
  return VALID_KEYWORD.test(keyword) && keyword.split(" ").length <= 10;
}

function authHeader() {
  return `Basic ${Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString("base64")}`;
}

async function post(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    // Keep DataForSEO's own explanation (e.g. account not verified, no
    // balance) — a bare status code isn't actionable.
    const reason = data?.status_message ?? data?.tasks?.[0]?.status_message ?? "";
    throw new Error(`DataForSEO request failed (${res.status})${reason ? `: ${reason}` : ""}`);
  }
  const costUsd = typeof data.cost === "number" ? data.cost : ESTIMATED_COST_PER_REQUEST_USD;
  const task = data.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    throw Object.assign(new Error(`DataForSEO task error: ${task?.status_message ?? "no task"}`), { costUsd });
  }
  return { result: (task.result ?? []) as Record<string, unknown>[], costUsd };
}

export interface Market {
  code: number;
  name: string;
}

// The Philadelphia metro location, looked up once and saved in app_settings.
// Falls back to US-wide if it can't be found (and the log shows which).
export async function getMarket(supabase: SupabaseClient): Promise<Market> {
  const { data } = await supabase.from("app_settings").select("value").eq("key", MARKET_SETTING_KEY).maybeSingle();
  if (data?.value) {
    try {
      return JSON.parse(data.value) as Market;
    } catch {
      // fall through and look it up again
    }
  }

  try {
    const res = await fetch(`${API}/keywords_data/google_ads/locations/us`, { headers: { Authorization: authHeader() } });
    const json = await res.json();
    const locations = (json?.tasks?.[0]?.result ?? []) as { location_code: number; location_name: string; location_type: string }[];
    const match =
      locations.find((l) => l.location_type === "DMA Region" && l.location_name.startsWith(MARKET_SEARCH)) ??
      locations.find((l) => l.location_type === "DMA Region" && l.location_name.includes("Philadelphia"));
    if (!match) return US;
    const market = { code: match.location_code, name: `${match.location_name.split(",")[0]} metro (DMA)` };
    await supabase.from("app_settings").upsert(
      {
        key: MARKET_SETTING_KEY,
        value: JSON.stringify(market),
        updated_at: new Date().toISOString(),
        category: "seo",
        description: "DataForSEO location search volumes are measured in (onproit.com)",
      },
      { onConflict: "key" }
    );
    return market;
  } catch {
    return US;
  }
}

export interface Budget {
  month: string;
  spent: number;
  calls: number;
  budget: number;
}

export async function getBudget(supabase: SupabaseClient): Promise<Budget> {
  const month = new Date().toISOString().slice(0, 7);
  const { data } = await supabase.from("dataforseo_usage").select("spend_usd, calls").eq("month", month).maybeSingle();
  return { month, spent: Number(data?.spend_usd ?? 0), calls: Number(data?.calls ?? 0), budget: getMonthlyBudgetUsd() };
}

interface CallLog {
  kind: "volume" | "ideas";
  trigger: string;
  market: string;
  keywordsSent: number;
  sample: string[];
}

// Runs one paid request with the budget check, spend tracking and activity
// log around it. Returns null (and logs why) when the budget won't allow it.
async function spend<T>(
  supabase: SupabaseClient,
  log: CallLog,
  run: () => Promise<{ value: T; costUsd: number; results: number; detail: string }>
): Promise<T | null> {
  const budget = await getBudget(supabase);
  const record = (row: Record<string, unknown>) =>
    supabase.from("dataforseo_calls").insert({
      kind: log.kind,
      trigger: log.trigger,
      market: log.market,
      keywords_sent: log.keywordsSent,
      sample: log.sample.slice(0, 20),
      ...row,
    });

  if (budget.spent + ESTIMATED_COST_PER_REQUEST_USD > budget.budget) {
    await record({ ok: false, cost_usd: 0, results: 0, detail: `Skipped — $${budget.spent.toFixed(2)} of the $${budget.budget} monthly budget already used` });
    return null;
  }

  const addSpend = (cost: number) =>
    supabase.from("dataforseo_usage").upsert({
      month: budget.month,
      spend_usd: budget.spent + cost,
      calls: budget.calls + 1,
      updated_at: new Date().toISOString(),
    });

  try {
    const { value, costUsd, results, detail } = await run();
    await addSpend(costUsd);
    await record({ ok: true, cost_usd: costUsd, results, detail });
    return value;
  } catch (err) {
    // A failed task can still be billed — record whatever it reported.
    const cost = (err as { costUsd?: number }).costUsd ?? 0;
    if (cost) await addSpend(cost);
    await record({ ok: false, cost_usd: cost, results: 0, detail: err instanceof Error ? err.message : String(err) });
    throw err;
  }
}

export interface KeywordVolume {
  keyword: string;
  searchVolume: number | null;
}

// Monthly searches in the market for keywords we already track.
export async function lookupVolumes(
  supabase: SupabaseClient,
  keywords: string[],
  trigger: string
): Promise<KeywordVolume[] | null> {
  const market = await getMarket(supabase);
  const batch = keywords.slice(0, 1000);
  return spend(supabase, { kind: "volume", trigger, market: market.name, keywordsSent: batch.length, sample: batch }, async () => {
    const { result, costUsd } = await post("/keywords_data/google_ads/search_volume/live", [
      { keywords: batch, location_code: market.code, language_code: "en" },
    ]);
    const volumes = result.map((r) => ({ keyword: String(r.keyword), searchVolume: (r.search_volume as number | null) ?? null }));
    const withVolume = volumes.filter((v) => v.searchVolume != null).length;
    return {
      value: volumes,
      costUsd,
      results: volumes.length,
      detail: `Checked ${batch.length} keywords; ${withVolume} have a reportable monthly volume`,
    };
  });
}

export interface KeywordIdea {
  keyword: string;
  searchVolume: number;
  competition: string | null;
}

// Related searches (with volumes) for up to 20 seed phrases.
export async function lookupIdeas(
  supabase: SupabaseClient,
  seeds: string[],
  trigger: string
): Promise<KeywordIdea[] | null> {
  const market = await getMarket(supabase);
  const batch = seeds.filter(isValidVolumeKeyword).slice(0, 20);
  return spend(supabase, { kind: "ideas", trigger, market: market.name, keywordsSent: batch.length, sample: batch }, async () => {
    const { result, costUsd } = await post("/keywords_data/google_ads/keywords_for_keywords/live", [
      { keywords: batch, location_code: market.code, language_code: "en", sort_by: "search_volume" },
    ]);
    const ideas = result
      .filter((r) => typeof r.search_volume === "number" && (r.search_volume as number) > 0)
      .map((r) => ({
        keyword: String(r.keyword),
        searchVolume: r.search_volume as number,
        competition: (r.competition as string | null) ?? null,
      }));
    return {
      value: ideas,
      costUsd,
      results: ideas.length,
      detail: `${batch.length} seed phrases → ${ideas.length} related searches with volume`,
    };
  });
}
