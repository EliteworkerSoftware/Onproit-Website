import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { getServiceArea } from "@/lib/service-area";
import { scoreKeyword } from "@/lib/keyword-score";

// Read-only feed for the content-writing automation (see the "content-agent"
// scheduled routine) — deliberately scoped to just the queued rows rather
// than reusing /api/admin/keywords, so a leaked CONTENT_AGENT_SECRET can only
// ever read what's queued, not the full keyword database.
export async function GET(req: NextRequest) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ keywords: [] });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("target_keywords")
    .select("id, keyword, target_url, notes, region, last_impressions, last_clicks, last_position, queued_at, search_volume")
    .eq("status", "queued")
    .order("queued_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // The owner's service area (editable in Admin → Settings), so the agent
  // targets the same places the dashboard does.
  const area = await getServiceArea(supabase);
  // Highest opportunity first, so the agent works on the best keywords when
  // more are queued than one run handles.
  const keywords = (data ?? [])
    .map((k) => ({
      ...k,
      monthly_searches: k.search_volume,
      opportunity_score: scoreKeyword({
        searchVolume: k.search_volume,
        impressions: k.last_impressions,
        position: k.last_position == null ? null : Number(k.last_position),
        region: k.region,
      }).score,
    }))
    .sort((a, b) => b.opportunity_score - a.opportunity_score);
  return NextResponse.json({ keywords, service_area: { in_area: area.inArea, out_of_area: area.outOfArea } });
}
