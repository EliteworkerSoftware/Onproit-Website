import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
const STATUS_RANK: Record<string, number> = { queued: 0, discovered: 1, done: 2 };

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("target_keywords")
    .select(
      "id, keyword, target_url, priority, notes, source, status, last_impressions, last_clicks, last_position, last_synced_at, created_at"
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Queued keywords first (they need action), then by priority, then by
  // real demand (impressions) — not insertion order.
  const keywords = [...data].sort((a, b) => {
    const statusDiff = (STATUS_RANK[a.status] ?? 1) - (STATUS_RANK[b.status] ?? 1);
    if (statusDiff !== 0) return statusDiff;
    const priorityDiff = (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1);
    if (priorityDiff !== 0) return priorityDiff;
    return (b.last_impressions ?? 0) - (a.last_impressions ?? 0);
  });

  return NextResponse.json({ keywords });
}

// Manual insertion is a secondary path now — the list is meant to populate
// itself from the daily Search Console sync (see /api/cron/sync-keywords).
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { keyword, target_url, priority, notes } = await req.json().catch(() => ({}));
  if (typeof keyword !== "string" || !keyword.trim()) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("target_keywords").insert({
    keyword: keyword.trim().toLowerCase(),
    target_url: typeof target_url === "string" && target_url.trim() ? target_url.trim() : null,
    priority: typeof priority === "string" && priority ? priority : "medium",
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    source: "manual",
    status: "discovered",
  });

  if (error) {
    const message = error.code === "23505" ? "That keyword is already being tracked" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
