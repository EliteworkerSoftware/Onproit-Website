import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isDataForSeoConfigured, isValidVolumeKeyword, lookupIdeas } from "@/lib/dataforseo";
import { getServiceArea } from "@/lib/service-area";
import { classifyKeywordRegion } from "@/lib/keyword-region";
import { scoreKeyword } from "@/lib/keyword-score";

// Manual searches allowed per day — enough to explore, not enough for a
// stray double-click habit to eat the month's budget.
const MAX_MANUAL_PER_DAY = 5;
const MAX_RESULTS = 100;

// "Find new keywords" in Admin → Analytics: up to 20 starting phrases go to
// DataForSEO, which returns related real searches with their monthly volume
// in the Philadelphia market. Returns the ones not already tracked and not
// outside the service area; nothing is added until the admin picks them.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isDataForSeoConfigured()) return NextResponse.json({ error: "DataForSEO isn't connected" }, { status: 503 });

  const { seeds } = await req.json().catch(() => ({}));
  const cleaned: string[] = Array.isArray(seeds)
    ? [...new Set(seeds.filter((s): s is string => typeof s === "string").map((s) => s.trim().toLowerCase()))]
    : [];
  const valid = cleaned.filter(isValidVolumeKeyword).slice(0, 20);
  if (valid.length === 0) {
    return NextResponse.json({ error: "Pick a service and at least one town, or type a starting phrase" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const startOfDay = new Date(new Date().toISOString().slice(0, 10)).toISOString();
  const { count } = await supabase
    .from("dataforseo_calls")
    .select("id", { count: "exact", head: true })
    .eq("kind", "ideas")
    .like("trigger", "Manual%")
    .gte("created_at", startOfDay);
  if ((count ?? 0) >= MAX_MANUAL_PER_DAY) {
    return NextResponse.json({ error: `That's ${MAX_MANUAL_PER_DAY} searches today — try again tomorrow` }, { status: 429 });
  }

  let ideas;
  try {
    ideas = await lookupIdeas(supabase, valid, `Manual research by ${admin.full_name || admin.email}`);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Research failed" }, { status: 502 });
  }
  if (!ideas) return NextResponse.json({ error: "This month's DataForSEO budget is used up" }, { status: 429 });

  const [area, { data: tracked }] = await Promise.all([getServiceArea(supabase), supabase.from("target_keywords").select("keyword")]);
  const already = new Set((tracked ?? []).map((t) => t.keyword));

  const results = ideas
    .filter((i) => !already.has(i.keyword))
    .map((i) => {
      const region = classifyKeywordRegion(i.keyword, area);
      return {
        keyword: i.keyword,
        searchVolume: i.searchVolume,
        competition: i.competition,
        region,
        // Estimated: no Search Console ranking yet, so closeness is neutral.
        opportunity: scoreKeyword({ searchVolume: i.searchVolume, impressions: null, position: null, region }).score,
      };
    })
    .filter((i) => i.region !== "out_of_area")
    .sort((a, b) => b.opportunity - a.opportunity || b.searchVolume - a.searchVolume)
    .slice(0, MAX_RESULTS);

  return NextResponse.json({ seeds: valid, found: ideas.length, results });
}
