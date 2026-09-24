import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { classifyKeywordRegion } from "@/lib/keyword-region";
import { getServiceArea } from "@/lib/service-area";

// Most keywords one call can add — keeps a runaway or leaked-secret caller
// from flooding the dashboard.
const MAX_PER_CALL = 10;
const MAX_KEYWORD_LENGTH = 80;
const MAX_NOTE_LENGTH = 300;

// Lets the content-writing automation propose keywords the site doesn't rank
// for yet. Insert-only, always as "discovered" and unseen — they show up
// with the green "New" badge and nothing happens to them until a human
// queues one. Existing keywords are never touched (duplicates are ignored).
export async function POST(req: NextRequest) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { keywords } = await req.json().catch(() => ({}));
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return NextResponse.json({ error: "keywords is required" }, { status: 400 });
  }
  if (keywords.length > MAX_PER_CALL) {
    return NextResponse.json({ error: `At most ${MAX_PER_CALL} keywords per call` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const area = await getServiceArea(supabase);
  const rows = [];
  for (const entry of keywords) {
    const keyword = typeof entry?.keyword === "string" ? entry.keyword.trim().toLowerCase() : "";
    if (!keyword || keyword.length > MAX_KEYWORD_LENGTH) {
      return NextResponse.json({ error: "Each entry needs a keyword of 1-80 characters" }, { status: 400 });
    }
    const reason = typeof entry?.reason === "string" ? entry.reason.trim().slice(0, MAX_NOTE_LENGTH) : "";
    const region = classifyKeywordRegion(keyword, area);
    rows.push({
      keyword,
      region,
      priority: region === "out_of_area" ? "low" : "medium",
      notes: `Suggested by content agent${reason ? `: ${reason}` : ""}`,
      source: "agent",
      status: "discovered",
    });
  }

  const { data, error } = await supabase
    .from("target_keywords")
    .upsert(rows, { onConflict: "keyword", ignoreDuplicates: true })
    .select("keyword");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, added: (data ?? []).map((r) => r.keyword) });
}
