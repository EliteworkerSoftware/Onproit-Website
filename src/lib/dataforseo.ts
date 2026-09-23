import "server-only";

// Google Ads search-volume lookups via DataForSEO. Billed per request (not per
// keyword — 1 or 1,000 keywords cost the same), so callers batch everything
// into a single request and check the monthly budget before calling.

const ENDPOINT = "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live";

// Worst-case cost of one request, used to decide whether there's room left in
// the budget before making it. The real cost from the response is what gets
// recorded afterward.
export const ESTIMATED_COST_PER_REQUEST_USD = 0.1;

// Google Ads rejects keywords over 80 chars, over 10 words, or with most
// punctuation — one bad keyword fails the whole request, so filter first.
const VALID_KEYWORD = /^[a-z0-9 '&.-]{1,80}$/;

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

export interface KeywordVolume {
  keyword: string;
  searchVolume: number | null;
}

export async function fetchSearchVolumes(keywords: string[]): Promise<{ volumes: KeywordVolume[]; costUsd: number }> {
  const auth = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString("base64");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    // US-wide volume — local-intent keywords already name the town, so
    // national volume for "managed it services marlton nj" is local demand.
    body: JSON.stringify([{ keywords: keywords.slice(0, 1000), location_code: 2840, language_code: "en" }]),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) throw new Error(`DataForSEO request failed (${res.status})`);

  const costUsd = typeof data.cost === "number" ? data.cost : ESTIMATED_COST_PER_REQUEST_USD;
  const task = data.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    throw Object.assign(new Error(`DataForSEO task error: ${task?.status_message ?? "no task"}`), { costUsd });
  }

  const volumes: KeywordVolume[] = (task.result ?? []).map((r: { keyword: string; search_volume: number | null }) => ({
    keyword: r.keyword,
    searchVolume: r.search_volume ?? null,
  }));

  return { volumes, costUsd };
}
