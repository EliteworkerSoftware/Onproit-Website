import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { isSearchConsoleConfigured, querySearchAnalytics } from "@/lib/search-console";

// Minimum impressions in the trailing 30 days for a query to be worth
// tracking at all — filters out one-off noise (a single odd search) rather
// than cluttering the list with hundreds of near-zero-signal queries.
const MIN_IMPRESSIONS = 3;

function isoDayNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function computePriority(impressions: number, position: number): "high" | "medium" | "low" {
  if (impressions >= 50 && position <= 30) return "high";
  if (impressions >= 15) return "medium";
  return "low";
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends this header automatically when CRON_SECRET is set as
  // an env var on the project — rejects anyone else from triggering syncs.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseAdminConfigured() || !isSearchConsoleConfigured()) {
    return NextResponse.json({ ok: true, synced: 0, skipped: "not configured" });
  }

  const supabase = getSupabaseAdmin();

  const rows = await querySearchAnalytics({
    startDate: isoDayNDaysAgo(30),
    endDate: isoDayNDaysAgo(3),
    dimensions: ["query"],
    rowLimit: 5000,
  });

  const qualifying = rows.filter((r) => r.impressions >= MIN_IMPRESSIONS);

  // Existing rows keep their status (queued/done) and priority isn't
  // downgraded below what a human already set by queuing it — the sync
  // only ever refreshes the live stats and inserts genuinely new keywords.
  const { data: existing } = await supabase.from("target_keywords").select("keyword, status");
  const existingByKeyword = new Map((existing ?? []).map((r) => [r.keyword, r.status]));

  let inserted = 0;
  let updated = 0;

  for (const r of qualifying) {
    const keyword = r.keys[0];
    const priority = computePriority(r.impressions, r.position);
    const notes = `Auto: ${r.impressions} impressions, position #${r.position.toFixed(1)}, ${r.clicks} clicks (Search Console, last 30 days)`;
    const stats = {
      last_impressions: r.impressions,
      last_clicks: r.clicks,
      last_position: r.position,
      last_synced_at: new Date().toISOString(),
    };

    if (existingByKeyword.has(keyword)) {
      await supabase.from("target_keywords").update({ ...stats, notes }).eq("keyword", keyword);
      updated++;
    } else {
      await supabase.from("target_keywords").insert({
        keyword,
        priority,
        notes,
        source: "search_console",
        status: "discovered",
        ...stats,
      });
      inserted++;
    }
  }

  return NextResponse.json({ ok: true, scanned: rows.length, qualifying: qualifying.length, inserted, updated });
}
