import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyKeywordRegion, DEFAULT_SERVICE_AREA, parseAreaList, type ServiceArea } from "@/lib/keyword-region";
import { computePriority } from "@/lib/keyword-priority";

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
// Settings shows up immediately instead of waiting for the next daily sync.
// Moving out of the area forces Low priority; moving back in restores a
// priority computed from the keyword's real numbers.
export async function reclassifyKeywords(supabase: SupabaseClient, area: ServiceArea): Promise<number> {
  const { data, error } = await supabase
    .from("target_keywords")
    .select("id, keyword, region, last_impressions, last_position");
  if (error) throw new Error(error.message);

  let changed = 0;
  for (const k of data ?? []) {
    const region = classifyKeywordRegion(k.keyword, area);
    if (region === k.region) continue;

    const update: Record<string, unknown> = { region };
    if (region === "out_of_area") {
      update.priority = "low";
    } else if (k.region === "out_of_area") {
      update.priority =
        k.last_impressions != null && k.last_position != null
          ? computePriority(k.last_impressions, Number(k.last_position))
          : "medium";
    }
    await supabase.from("target_keywords").update(update).eq("id", k.id);
    changed++;
  }
  return changed;
}
