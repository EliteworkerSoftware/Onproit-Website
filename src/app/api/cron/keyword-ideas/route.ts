import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { isDataForSeoConfigured, lookupIdeas } from "@/lib/dataforseo";
import { getServiceArea } from "@/lib/service-area";
import { classifyKeywordRegion } from "@/lib/keyword-region";

// Research requests allowed per day — the Monday run needs one or two.
const MAX_REQUESTS_PER_DAY = 2;
// Returned to the agent: enough to choose from without flooding it.
const MAX_IDEAS = 60;

// Monday keyword research for the content agent: it sends up to 20 seed
// phrases (service + place), DataForSEO returns related real searches with
// their monthly volume in our market, and this hands back the ones worth
// considering — not already tracked, not outside the service area, with
// real demand. Read-only for keywords: the agent still decides what to
// suggest, via /api/cron/suggested-keywords.
export async function POST(req: NextRequest) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured() || !isDataForSeoConfigured()) {
    return NextResponse.json({ error: "Keyword research isn't configured" }, { status: 503 });
  }

  const { seeds } = await req.json().catch(() => ({}));
  if (!Array.isArray(seeds) || seeds.length === 0 || seeds.length > 20 || !seeds.every((s) => typeof s === "string")) {
    return NextResponse.json({ error: "seeds must be 1-20 phrases" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const startOfDay = new Date(new Date().toISOString().slice(0, 10)).toISOString();
  const { count } = await supabase
    .from("dataforseo_calls")
    .select("id", { count: "exact", head: true })
    .eq("kind", "ideas")
    .gte("created_at", startOfDay);
  if ((count ?? 0) >= MAX_REQUESTS_PER_DAY) {
    return NextResponse.json({ error: `Research limit reached (${MAX_REQUESTS_PER_DAY} requests a day)` }, { status: 429 });
  }

  let ideas;
  try {
    ideas = await lookupIdeas(
      supabase,
      seeds.map((s: string) => s.trim().toLowerCase()),
      "Content agent weekly research (Monday)"
    );
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Research failed" }, { status: 502 });
  }
  if (!ideas) return NextResponse.json({ error: "Monthly DataForSEO budget reached" }, { status: 429 });

  const [area, { data: tracked }] = await Promise.all([
    getServiceArea(supabase),
    supabase.from("target_keywords").select("keyword"),
  ]);
  const already = new Set((tracked ?? []).map((t) => t.keyword));

  const results = ideas
    .filter((i) => !already.has(i.keyword))
    .map((i) => ({ ...i, region: classifyKeywordRegion(i.keyword, area) }))
    .filter((i) => i.region !== "out_of_area")
    .slice(0, MAX_IDEAS);

  return NextResponse.json({
    ideas: results.map((i) => ({
      keyword: i.keyword,
      monthly_searches: i.searchVolume,
      competition: i.competition,
      names_a_place_we_serve: i.region === "in_area",
    })),
  });
}
