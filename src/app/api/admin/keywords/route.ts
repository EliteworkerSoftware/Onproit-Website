import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isSearchConsoleConfigured, querySearchAnalytics } from "@/lib/search-console";

function isoDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data: rawKeywords, error } = await supabase
    .from("target_keywords")
    .select("id, keyword, target_url, priority, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // High/medium/low is a manual editorial judgment (backed by the required
  // "notes" reason, not a Google-derived score), so sort by it explicitly
  // rather than relying on insertion order.
  const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const keywords = [...rawKeywords].sort(
    (a, b) => (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1)
  );

  // Cross-reference each tracked keyword against its live Search Console
  // position in one batched query (multiple filter groups are OR'd together
  // by the API), rather than one request per keyword.
  let liveData: Record<string, { impressions: number; clicks: number; position: number }> = {};
  if (keywords.length > 0 && isSearchConsoleConfigured()) {
    try {
      const rows = await querySearchAnalytics({
        startDate: isoDateNDaysAgo(30),
        endDate: isoDateNDaysAgo(3),
        dimensions: ["query"],
        rowLimit: keywords.length,
        dimensionFilterGroups: keywords.map((k) => ({
          filters: [{ dimension: "query", operator: "equals", expression: k.keyword }],
        })),
      });
      liveData = Object.fromEntries(
        rows.map((r) => [r.keys[0], { impressions: r.impressions, clicks: r.clicks, position: r.position }])
      );
    } catch (err) {
      console.error("Keyword live-lookup error:", err);
    }
  }

  const enriched = keywords.map((k) => ({ ...k, live: liveData[k.keyword] ?? null }));
  return NextResponse.json({ keywords: enriched });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { keyword, target_url, priority, notes } = await req.json().catch(() => ({}));
  if (typeof keyword !== "string" || !keyword.trim()) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }
  if (typeof notes !== "string" || !notes.trim()) {
    return NextResponse.json(
      { error: "Give a reason for this priority — e.g. real Search Console demand, or a specific competitive gap" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("target_keywords").insert({
    keyword: keyword.trim().toLowerCase(),
    target_url: typeof target_url === "string" && target_url.trim() ? target_url.trim() : null,
    priority: typeof priority === "string" && priority ? priority : "medium",
    notes: notes.trim(),
  });

  if (error) {
    const message = error.code === "23505" ? "That keyword is already being tracked" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
