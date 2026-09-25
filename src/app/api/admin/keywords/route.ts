import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { scoreKeyword } from "@/lib/keyword-score";

const STATUS_RANK: Record<string, number> = { queued: 0, discovered: 1, done: 2 };

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("target_keywords")
    .select(
      "id, keyword, target_url, priority, notes, source, status, region, last_impressions, last_clicks, last_position, last_synced_at, content_url, queued_at, content_published_at, created_at, seen_at, search_volume"
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Each keyword carries its opportunity score and the three parts behind
  // it, so the dashboard can show exactly why it's High, Medium or Low.
  const scored = data.map((k) => ({
    ...k,
    score: scoreKeyword({
      searchVolume: k.search_volume,
      impressions: k.last_impressions,
      position: k.last_position == null ? null : Number(k.last_position),
      region: k.region,
    }),
  }));

  // Queued keywords first (they need action); within discovered, ones nobody
  // has seen yet float to the top so "New" is what you see first; then by
  // opportunity score — not insertion order.
  const keywords = scored.sort((a, b) => {
    const statusDiff = (STATUS_RANK[a.status] ?? 1) - (STATUS_RANK[b.status] ?? 1);
    if (statusDiff !== 0) return statusDiff;
    const seenDiff = Number(!!a.seen_at) - Number(!!b.seen_at);
    if (seenDiff !== 0) return seenDiff;
    return b.score.score - a.score.score;
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
    // You typed it in yourself, so it's already been seen.
    seen_at: new Date().toISOString(),
  });

  if (error) {
    const message = error.code === "23505" ? "That keyword is already being tracked" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
