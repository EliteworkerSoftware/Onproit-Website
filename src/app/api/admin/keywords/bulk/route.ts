import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getServiceArea } from "@/lib/service-area";
import { classifyKeywordRegion } from "@/lib/keyword-region";
import { scoreKeyword } from "@/lib/keyword-score";

const MAX_PER_CALL = 100;

// Adds the keywords picked from a "Find new keywords" search. They already
// have their DataForSEO volume, so they're scored right away; marked seen
// because the admin just chose them. Keywords already tracked are skipped.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { keywords } = await req.json().catch(() => ({}));
  if (!Array.isArray(keywords) || keywords.length === 0 || keywords.length > MAX_PER_CALL) {
    return NextResponse.json({ error: `Pick 1-${MAX_PER_CALL} keywords` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const area = await getServiceArea(supabase);
  const now = new Date().toISOString();

  const rows = keywords
    .filter((k) => typeof k?.keyword === "string" && k.keyword.trim() && k.keyword.length <= 80)
    .map((k) => {
      const keyword = String(k.keyword).trim().toLowerCase();
      const volume = typeof k.searchVolume === "number" ? k.searchVolume : null;
      const region = classifyKeywordRegion(keyword, area);
      return {
        keyword,
        region,
        source: "dataforseo",
        status: "discovered",
        priority: scoreKeyword({ searchVolume: volume, impressions: null, position: null, region }).priority,
        search_volume: volume,
        volume_checked_at: now,
        seen_at: now,
        notes: volume != null ? `DataForSEO research: ~${volume.toLocaleString()} searches/mo in the Philadelphia market` : null,
      };
    });

  const { data, error } = await supabase
    .from("target_keywords")
    .upsert(rows, { onConflict: "keyword", ignoreDuplicates: true })
    .select("keyword");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, added: (data ?? []).length });
}
