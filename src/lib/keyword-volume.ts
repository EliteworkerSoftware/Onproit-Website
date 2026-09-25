import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ESTIMATED_COST_PER_REQUEST_USD,
  fetchSearchVolumes,
  getMonthlyBudgetUsd,
  isDataForSeoConfigured,
  isValidVolumeKeyword,
} from "@/lib/dataforseo";

// Re-check a keyword's volume at most this often — Google Ads volume is a
// monthly average, so checking more often only spends money.
const RECHECK_AFTER_DAYS = 30;

// Agent-suggested keywords have no Search Console history (the site has
// never shown up for them), so real search volume is the only signal for
// how much they're worth chasing.
function priorityFromVolume(volume: number | null): "high" | "medium" | "low" {
  if (volume != null && volume >= 50) return "high";
  if (volume != null && volume >= 10) return "medium";
  return "low";
}

// Looks up search volume for every tracked keyword that doesn't have a
// recent one, in a single DataForSEO request — at most one paid call per
// run, and none at all if it would push this month's spend past the budget.
export async function enrichSearchVolumes(supabase: SupabaseClient): Promise<Record<string, unknown>> {
  if (!isDataForSeoConfigured()) return { skipped: "not configured" };

  const month = new Date().toISOString().slice(0, 7);
  const budget = getMonthlyBudgetUsd();
  const { data: usage } = await supabase
    .from("dataforseo_usage")
    .select("spend_usd, calls")
    .eq("month", month)
    .maybeSingle();
  const spent = Number(usage?.spend_usd ?? 0);
  const calls = Number(usage?.calls ?? 0);

  if (spent + ESTIMATED_COST_PER_REQUEST_USD > budget) {
    return { skipped: "monthly budget reached", spent, budget };
  }

  const staleBefore = new Date(Date.now() - RECHECK_AFTER_DAYS * 86_400_000).toISOString();
  const { data: rows, error } = await supabase
    .from("target_keywords")
    .select("id, keyword, source, region, last_impressions")
    .in("status", ["discovered", "queued"])
    .or(`volume_checked_at.is.null,volume_checked_at.lt.${staleBefore}`);
  if (error) return { error: error.message };

  const candidates = (rows ?? [])
    .filter((r) => r.region !== "out_of_area" && isValidVolumeKeyword(r.keyword))
    .slice(0, 1000);
  if (candidates.length === 0) return { skipped: "nothing to check", spent, budget };

  const recordSpend = (cost: number) =>
    supabase.from("dataforseo_usage").upsert({
      month,
      spend_usd: spent + cost,
      calls: calls + 1,
      updated_at: new Date().toISOString(),
    });

  let volumes;
  let cost;
  try {
    const result = await fetchSearchVolumes(candidates.map((r) => r.keyword));
    volumes = result.volumes;
    cost = result.costUsd;
    await recordSpend(cost);
  } catch (err) {
    // A failed task can still be billed — record whatever it reported.
    const cost = (err as { costUsd?: number }).costUsd;
    if (cost) await recordSpend(cost);
    return { error: err instanceof Error ? err.message : String(err) };
  }

  const byKeyword = new Map(volumes.map((v) => [v.keyword.toLowerCase(), v.searchVolume]));
  const checkedAt = new Date().toISOString();

  // Every candidate gets stamped, even with no volume returned, so a keyword
  // Google has no data for isn't re-sent (and re-paid for) every day.
  // Written in two batched upserts (one write per keyword ran past the
  // function's time limit); agent suggestions without Search Console data
  // also get a priority from their volume, so they're a separate batch.
  const plain: Record<string, unknown>[] = [];
  const withPriority: Record<string, unknown>[] = [];
  for (const r of candidates) {
    const volume = byKeyword.get(r.keyword.toLowerCase()) ?? null;
    const row = { keyword: r.keyword, search_volume: volume, volume_checked_at: checkedAt };
    if (r.source === "agent" && r.last_impressions == null) withPriority.push({ ...row, priority: priorityFromVolume(volume) });
    else plain.push(row);
  }
  for (const rows of [plain, withPriority]) {
    if (rows.length > 0) await supabase.from("target_keywords").upsert(rows, { onConflict: "keyword" });
  }

  return { checked: candidates.length, spent: spent + cost, budget };
}
