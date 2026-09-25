import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { isSearchConsoleConfigured, querySearchAnalytics } from "@/lib/search-console";
import { classifyKeywordRegion } from "@/lib/keyword-region";
import { computePriority } from "@/lib/keyword-priority";
import { getServiceArea } from "@/lib/service-area";
import { enrichSearchVolumes } from "@/lib/keyword-volume";

// Minimum impressions in the trailing 30 days for a query to be worth
// tracking at all — filters out one-off noise (a single odd search) rather
// than cluttering the list with hundreds of near-zero-signal queries.
const MIN_IMPRESSIONS = 3;

// Rows written per database call. One write per keyword (~800 calls) ran
// past the function's time limit; batches keep the whole sync to a handful.
const WRITE_BATCH = 500;

// Headroom for the Search Console query, the batched writes, and the
// DataForSEO lookup that follows.
export const maxDuration = 60;

function chunks<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

function isoDayNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
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
  const area = await getServiceArea(supabase);

  // Existing rows keep their status (queued/done) and priority isn't
  // downgraded below what a human already set by queuing it — the sync
  // only ever refreshes the live stats and inserts genuinely new keywords.
  const { data: existing } = await supabase.from("target_keywords").select("keyword, status");
  const existingByKeyword = new Map((existing ?? []).map((r) => [r.keyword, r.status]));

  const now = new Date().toISOString();
  const inserts: Record<string, unknown>[] = [];
  // Upserts on `keyword` touch only the columns listed, so a human's status
  // and priority survive — out-of-area rows are a separate batch because
  // they also force priority to Low.
  const updates: Record<string, unknown>[] = [];
  const outOfAreaUpdates: Record<string, unknown>[] = [];

  for (const r of qualifying) {
    const keyword = r.keys[0];
    const region = classifyKeywordRegion(keyword, area);
    // Out-of-area terms (North/Central Jersey towns) are never worth
    // pursuing regardless of real demand — force Low so they never surface
    // as a recommendation, but keep the row so the demand is still visible.
    const priority = region === "out_of_area" ? "low" : computePriority(r.impressions, r.position);
    const notes =
      region === "out_of_area"
        ? `Auto: ${r.impressions} impressions, position #${r.position.toFixed(1)}, ${r.clicks} clicks — outside the real service area, not a target regardless of demand.`
        : `Auto: ${r.impressions} impressions, position #${r.position.toFixed(1)}, ${r.clicks} clicks (Search Console, last 30 days)`;
    const stats = {
      last_impressions: r.impressions,
      last_clicks: r.clicks,
      last_position: r.position,
      last_synced_at: now,
      region,
    };

    if (existingByKeyword.has(keyword)) {
      // Out-of-area is a hard override even on a keyword a human already
      // touched; anything else respects whatever priority is already set.
      if (region === "out_of_area") outOfAreaUpdates.push({ keyword, ...stats, notes, priority: "low" });
      else updates.push({ keyword, ...stats, notes });
    } else {
      inserts.push({ keyword, priority, notes, source: "search_console", status: "discovered", ...stats });
    }
  }

  for (const batch of chunks(inserts, WRITE_BATCH)) {
    await supabase.from("target_keywords").insert(batch);
  }
  for (const batch of [...chunks(updates, WRITE_BATCH), ...chunks(outOfAreaUpdates, WRITE_BATCH)]) {
    await supabase.from("target_keywords").upsert(batch, { onConflict: "keyword" });
  }
  const inserted = inserts.length;
  const updated = updates.length + outOfAreaUpdates.length;

  // Runs after the sync so keywords it just inserted get their volume in the
  // same pass. Budget-capped inside; a failure here doesn't fail the sync.
  const volume = await enrichSearchVolumes(supabase).catch((err) => ({ error: String(err) }));

  return NextResponse.json({ ok: true, scanned: rows.length, qualifying: qualifying.length, inserted, updated, volume });
}
