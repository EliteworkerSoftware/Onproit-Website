import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isDataForSeoConfigured, isValidVolumeKeyword, lookupVolumes } from "@/lib/dataforseo";
import { scoreKeyword } from "@/lib/keyword-score";

// Re-check a keyword's volume at most this often — Google Ads volume is a
// monthly average, so checking more often only spends money.
const RECHECK_AFTER_DAYS = 30;
const WRITE_BATCH = 500;

function chunks<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

// Looks up local search volume for every tracked keyword that doesn't have a
// recent one, in ONE DataForSEO request (budget-checked and logged inside).
export async function enrichSearchVolumes(supabase: SupabaseClient): Promise<Record<string, unknown>> {
  if (!isDataForSeoConfigured()) return { skipped: "not configured" };

  const staleBefore = new Date(Date.now() - RECHECK_AFTER_DAYS * 86_400_000).toISOString();
  const { data: rows, error } = await supabase
    .from("target_keywords")
    .select("keyword, region")
    .in("status", ["discovered", "queued"])
    .or(`volume_checked_at.is.null,volume_checked_at.lt.${staleBefore}`);
  if (error) return { error: error.message };

  const candidates = (rows ?? []).filter((r) => r.region !== "out_of_area" && isValidVolumeKeyword(r.keyword)).slice(0, 1000);
  if (candidates.length === 0) return { skipped: "nothing to check" };

  const volumes = await lookupVolumes(
    supabase,
    candidates.map((r) => r.keyword),
    "Daily keyword sync (7 AM)"
  );
  if (!volumes) return { skipped: "monthly budget reached" };

  const byKeyword = new Map(volumes.map((v) => [v.keyword.toLowerCase(), v.searchVolume]));
  const checkedAt = new Date().toISOString();
  // Every candidate gets stamped, even with no volume returned, so a keyword
  // Google has no data for isn't re-sent (and re-paid for) every day.
  const updates = candidates.map((r) => ({
    keyword: r.keyword,
    search_volume: byKeyword.get(r.keyword.toLowerCase()) ?? null,
    volume_checked_at: checkedAt,
  }));
  for (const batch of chunks(updates, WRITE_BATCH)) {
    await supabase.from("target_keywords").upsert(batch, { onConflict: "keyword" });
  }
  return { checked: candidates.length };
}

// Recomputes every keyword's priority from its opportunity score, so High /
// Medium / Low always reflect the latest volume, ranking and service area.
export async function recomputePriorities(supabase: SupabaseClient): Promise<{ high: number; medium: number; low: number }> {
  const { data } = await supabase
    .from("target_keywords")
    .select("keyword, search_volume, last_impressions, last_position, region, priority");
  const counts = { high: 0, medium: 0, low: 0 };
  const changed: { keyword: string; priority: string }[] = [];
  for (const k of data ?? []) {
    const { priority } = scoreKeyword({
      searchVolume: k.search_volume,
      impressions: k.last_impressions,
      position: k.last_position == null ? null : Number(k.last_position),
      region: k.region,
    });
    counts[priority]++;
    if (priority !== k.priority) changed.push({ keyword: k.keyword, priority });
  }
  for (const batch of chunks(changed, WRITE_BATCH)) {
    await supabase.from("target_keywords").upsert(batch, { onConflict: "keyword" });
  }
  return counts;
}
