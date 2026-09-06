import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

const SEARCH_ENGINES = ["google.", "bing.", "yahoo.", "duckduckgo."];
const SOCIAL_SITES = ["facebook.", "instagram.", "linkedin.", "twitter.", "x.com", "tiktok."];

function categorizeReferrer(referrer: string | null): string {
  if (!referrer) return "Direct";
  let host: string;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
  if (host === "onproit.com") return "Direct";
  if (SEARCH_ENGINES.some((s) => host.includes(s))) return "Organic Search";
  if (SOCIAL_SITES.some((s) => host.includes(s))) return "Social";
  return `Referral: ${host}`;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const empty = {
    totalViews30d: 0,
    totalViews7d: 0,
    viewsByDay: [],
    topPages: [],
    trafficSources: [],
    topLocations: [],
    mobilePct: 0,
    callClicks30d: 0,
    callClicks7d: 0,
    leads30d: 0,
    leads7d: 0,
    botViews30d: 0,
    botViews7d: 0,
    topBotAgents: [],
  };

  if (!isSupabaseAdminConfigured()) return NextResponse.json(empty);

  const supabase = getSupabaseAdmin();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [viewsResult, leadsResult] = await Promise.all([
    supabase
      .from("page_views")
      .select("path, referrer, is_mobile, event_type, created_at, city, region, country, is_likely_bot, user_agent")
      .gte("created_at", since30d)
      .order("created_at", { ascending: false })
      .limit(10000),
    supabase.from("contact_messages").select("created_at").gte("created_at", since30d),
  ]);

  if (viewsResult.error || !viewsResult.data) {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }

  const allRows = viewsResult.data;
  const humanRows = allRows.filter((r) => !r.is_likely_bot);
  const botRows = allRows.filter((r) => r.is_likely_bot);

  const pageviewRows = humanRows.filter((r) => !r.event_type);
  const callClickRows = humanRows.filter((r) => r.event_type === "call_click");
  const botPageviewRows = botRows.filter((r) => !r.event_type);
  const leads = leadsResult.data ?? [];

  const totalViews30d = pageviewRows.length;
  const totalViews7d = pageviewRows.filter((r) => r.created_at >= since7d).length;
  const callClicks30d = callClickRows.length;
  const callClicks7d = callClickRows.filter((r) => r.created_at >= since7d).length;
  const leads30d = leads.length;
  const leads7d = leads.filter((r) => r.created_at >= since7d).length;
  const botViews30d = botPageviewRows.length;
  const botViews7d = botPageviewRows.filter((r) => r.created_at >= since7d).length;

  const dayCounts = new Map<string, number>();
  for (const row of pageviewRows) {
    const day = row.created_at.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }
  const viewsByDay = Array.from(dayCounts.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const pageCounts = new Map<string, number>();
  for (const row of pageviewRows) {
    pageCounts.set(row.path, (pageCounts.get(row.path) ?? 0) + 1);
  }
  const topPages = Array.from(pageCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const sourceCounts = new Map<string, number>();
  for (const row of pageviewRows) {
    const source = categorizeReferrer(row.referrer);
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  }
  const trafficSources = Array.from(sourceCounts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const mobileCount = pageviewRows.filter((r) => r.is_mobile).length;
  const mobilePct = totalViews30d > 0 ? Math.round((mobileCount / totalViews30d) * 100) : 0;

  const locationCounts = new Map<string, number>();
  for (const row of pageviewRows) {
    if (!row.city && !row.region && !row.country) continue;
    const label = [row.city, row.region, row.country].filter(Boolean).join(", ");
    locationCounts.set(label, (locationCounts.get(label) ?? 0) + 1);
  }
  const topLocations = Array.from(locationCounts.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const botAgentCounts = new Map<string, number>();
  for (const row of botPageviewRows) {
    const agent = row.user_agent || "(no User-Agent)";
    botAgentCounts.set(agent, (botAgentCounts.get(agent) ?? 0) + 1);
  }
  const topBotAgents = Array.from(botAgentCounts.entries())
    .map(([agent, count]) => ({ agent, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return NextResponse.json({
    totalViews30d,
    totalViews7d,
    viewsByDay,
    topPages,
    trafficSources,
    topLocations,
    mobilePct,
    callClicks30d,
    callClicks7d,
    leads30d,
    leads7d,
    botViews30d,
    botViews7d,
    topBotAgents,
  });
}
