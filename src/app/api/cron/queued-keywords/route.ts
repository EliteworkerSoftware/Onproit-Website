import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

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
    .select("id, keyword, target_url, notes, region, last_impressions, last_clicks, last_position, queued_at")
    .eq("status", "queued")
    .order("queued_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ keywords: data });
}
