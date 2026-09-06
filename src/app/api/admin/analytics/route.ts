import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

const SEARCH_ENGINES = ["google.", "bing.", "yahoo.", "duckduckgo."];
const SOCIAL_SITES = ["facebook.", "instagram.", "linkedin.", "twitter.", "x.com", "tiktok."];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DISPLAY_TIMEZONE = "America/New_York";

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

interface PageViewRow {
  id: string;
  path: string;
  referrer: string | null;
  is_mobile: boolean | null;
  event_type: string | null;
  created_at: string;
  city: string | null;
  region: string | null;
  country: string | null;
  is_likely_bot: boolean;
  user_agent: string | null;
  session_id: string | null;
  duration_seconds: number | null;
  click_label: string | null;
  click_href: string | null;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const empty = {
    totalViews30d: 0,
    totalViews7d: 0,
    viewsByDay: [],
    viewsByHour: [],
    viewsByDayOfWeek: [],
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
    sessions: [],
  };

  if (!isSupabaseAdminConfigured()) return NextResponse.json(empty);

  const supabase = getSupabaseAdmin();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [viewsResult, leadsResult] = await Promise.all([
    supabase
      .from("page_views")
      .select(
        "id, path, referrer, is_mobile, event_type, created_at, city, region, country, is_likely_bot, user_agent, session_id, duration_seconds, click_label, click_href"
      )
      .gte("created_at", since30d)
      .order("created_at", { ascending: false })
      .limit(10000),
    supabase.from("contact_messages").select("created_at").gte("created_at", since30d),
  ]);

  if (viewsResult.error || !viewsResult.data) {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }

  const allRows = viewsResult.data as PageViewRow[];
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
  const hourCounts = new Map<number, number>();
  const dayOfWeekCounts = new Map<number, number>();
  for (const row of pageviewRows) {
    const day = row.created_at.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);

    const localDate = new Date(row.created_at);
    const hour = Number(
      new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: DISPLAY_TIMEZONE }).format(
        localDate
      )
    );
    const normalizedHour = hour === 24 ? 0 : hour;
    hourCounts.set(normalizedHour, (hourCounts.get(normalizedHour) ?? 0) + 1);

    const weekdayName = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: DISPLAY_TIMEZONE }).format(
      localDate
    );
    const dayIndex = DAY_NAMES.findIndex((d) => d === weekdayName);
    if (dayIndex >= 0) dayOfWeekCounts.set(dayIndex, (dayOfWeekCounts.get(dayIndex) ?? 0) + 1);
  }
  const viewsByDay = Array.from(dayCounts.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
  const viewsByHour = Array.from({ length: 24 }, (_, hour) => ({ hour, count: hourCounts.get(hour) ?? 0 }));
  const viewsByDayOfWeek = DAY_NAMES.map((day, i) => ({ day, count: dayOfWeekCounts.get(i) ?? 0 }));

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

  // Group every human row (pageviews + clicks) by session so the admin can
  // drill into one visitor's full journey: which pages, how long on each,
  // and every link/button they clicked, in order.
  const sessionRows = humanRows.filter((r) => r.session_id);
  const sessionGroups = new Map<string, PageViewRow[]>();
  for (const row of sessionRows) {
    const key = row.session_id!;
    if (!sessionGroups.has(key)) sessionGroups.set(key, []);
    sessionGroups.get(key)!.push(row);
  }

  const sessions = Array.from(sessionGroups.entries())
    .map(([sessionId, rows]) => {
      const sorted = [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));
      const pageRows = sorted.filter((r) => !r.event_type);
      const clickRows = sorted.filter((r) => r.event_type === "click" || r.event_type === "call_click");
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const totalDurationSeconds = sorted.reduce((sum, r) => sum + (r.duration_seconds ?? 0), 0);

      return {
        sessionId,
        firstSeen: first.created_at,
        lastSeen: last.created_at,
        pageCount: pageRows.length,
        ctaClicks: clickRows.length,
        totalDurationSeconds,
        isMobile: first.is_mobile ?? false,
        city: first.city,
        region: first.region,
        country: first.country,
        entryReferrer: first.referrer,
        entrySource: categorizeReferrer(first.referrer),
        timeline: sorted.map((r) => ({
          type: r.event_type === "call_click" ? "call_click" : r.event_type === "click" ? "click" : "page",
          path: r.path,
          label: r.click_label,
          href: r.click_href,
          durationSeconds: r.duration_seconds,
          timestamp: r.created_at,
        })),
      };
    })
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
    .slice(0, 100);

  return NextResponse.json({
    totalViews30d,
    totalViews7d,
    viewsByDay,
    viewsByHour,
    viewsByDayOfWeek,
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
    sessions,
  });
}
