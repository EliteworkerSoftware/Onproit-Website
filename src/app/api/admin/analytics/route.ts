import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      totalViews30d: 0,
      totalViews7d: 0,
      viewsByDay: [],
      topPages: [],
      topReferrers: [],
      mobilePct: 0,
    });
  }

  const supabase = getSupabaseAdmin();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("page_views")
    .select("path, referrer, is_mobile, created_at")
    .gte("created_at", since30d)
    .order("created_at", { ascending: false })
    .limit(10000);

  if (error || !data) {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }

  const totalViews30d = data.length;
  const totalViews7d = data.filter((r) => r.created_at >= since7d).length;

  const dayCounts = new Map<string, number>();
  for (const row of data) {
    const day = row.created_at.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }
  const viewsByDay = Array.from(dayCounts.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const pageCounts = new Map<string, number>();
  for (const row of data) {
    pageCounts.set(row.path, (pageCounts.get(row.path) ?? 0) + 1);
  }
  const topPages = Array.from(pageCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const referrerCounts = new Map<string, number>();
  for (const row of data) {
    if (!row.referrer) continue;
    try {
      const host = new URL(row.referrer).hostname.replace(/^www\./, "");
      if (host === "onproit.com") continue;
      referrerCounts.set(host, (referrerCounts.get(host) ?? 0) + 1);
    } catch {
      // ignore malformed referrer values
    }
  }
  const topReferrers = Array.from(referrerCounts.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const mobileCount = data.filter((r) => r.is_mobile).length;
  const mobilePct = totalViews30d > 0 ? Math.round((mobileCount / totalViews30d) * 100) : 0;

  return NextResponse.json({ totalViews30d, totalViews7d, viewsByDay, topPages, topReferrers, mobilePct });
}
