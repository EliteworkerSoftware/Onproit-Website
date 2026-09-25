import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyKeywordRegion, DEFAULT_SERVICE_AREA, parseAreaList, type ServiceArea } from "@/lib/keyword-region";
import { recomputePriorities } from "@/lib/keyword-volume";

// The service area lives in app_settings (editable in Admin → Settings) so it
// can change without a deploy. Falls back to the defaults in keyword-region.ts
// until it's been saved once, or if the read fails.
const IN_KEY = "service_area_in";
const OUT_KEY = "service_area_out";

export async function getServiceArea(supabase: SupabaseClient): Promise<ServiceArea> {
  const { data, error } = await supabase.from("app_settings").select("key, value").in("key", [IN_KEY, OUT_KEY]);
  if (error || !data) return DEFAULT_SERVICE_AREA;
  const byKey = Object.fromEntries(data.map((r) => [r.key, r.value as string]));
  return {
    inArea: byKey[IN_KEY] != null ? parseAreaList(byKey[IN_KEY]) : DEFAULT_SERVICE_AREA.inArea,
    outOfArea: byKey[OUT_KEY] != null ? parseAreaList(byKey[OUT_KEY]) : DEFAULT_SERVICE_AREA.outOfArea,
  };
}

export async function saveServiceArea(supabase: SupabaseClient, area: ServiceArea) {
  const now = new Date().toISOString();
  const { error } = await supabase.from("app_settings").upsert(
    [
      {
        key: IN_KEY,
        value: area.inArea.join("\n"),
        updated_at: now,
        category: "seo",
        description: "Towns/areas ONPRO IT serves — keywords naming these are in-area (onproit.com analytics)",
      },
      {
        key: OUT_KEY,
        value: area.outOfArea.join("\n"),
        updated_at: now,
        category: "seo",
        description: "Towns/areas ONPRO IT does not serve — keywords naming these are forced to Low priority",
      },
    ],
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}

// Re-tags every tracked keyword against a new service area, so a change in
// Settings shows up immediately instead of waiting for the next daily sync,
// then recomputes priorities (the opportunity score depends on the area).
export async function reclassifyKeywords(supabase: SupabaseClient, area: ServiceArea): Promise<number> {
  const { data, error } = await supabase.from("target_keywords").select("keyword, region");
  if (error) throw new Error(error.message);

  const changed = (data ?? [])
    .map((k) => ({ keyword: k.keyword, region: classifyKeywordRegion(k.keyword, area), was: k.region }))
    .filter((k) => k.region !== k.was)
    .map(({ keyword, region }) => ({ keyword, region }));
  if (changed.length > 0) await supabase.from("target_keywords").upsert(changed, { onConflict: "keyword" });

  await recomputePriorities(supabase);
  return changed.length;
}
