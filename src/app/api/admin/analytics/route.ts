import { NextRequest, NextResponse } from "next/server";
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
  if (SOCIAL_SITES.some((s) => host.includes(s))) return "Referral";
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

// Dates come in as plain "YYYY-MM-DD" from a date-picker input. Treat them as
// UTC-day boundaries so they line up exactly with how viewsByDay buckets
// created_at (a plain slice(0, 10) of the UTC ISO string) — otherwise a
// timezone mismatch would make a selected day's chart bar and its filtered
// total disagree.
function parseRangeParam(value: string | null, fallbackDaysAgo: number, endOfDay: boolean): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`;
  }
  const d = new Date(Date.now() - fallbackDaysAgo * 24 * 60 * 60 * 1000);
  return endOfDay ? d.toISOString() : d.toISOString();
}

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const empty = {
    rangeFrom: "",
    rangeTo: "",
    totalViews: 0,
    recentViews: null,
    viewsByDay: [],
    viewsByHour: [],
    viewsByDayOfWeek: [],
    topPages: [],
    trafficSources: [],
    topLocations: [],
    mobilePct: 0,
    callClicks: 0,
    recentCallClicks: null,
    leads: 0,
    recentLeads: null,
    botViews: 0,
    recentBotViews: null,
    topBotAgents: [],
    sessions: [],
  };

  if (!isSupabaseAdminConfigured()) return NextResponse.json(empty);

  const { searchParams } = new URL(req.url);
  const rangeStart = parseRangeParam(searchParams.get("from"), 30, false);
  const rangeEnd = parseRangeParam(searchParams.get("to"), 0, true);

  // Secondary "recent" comparison is the last 7 days of the selected range,
  // clamped so it never extends before the range start. Hidden client-side
  // when the range itself is 7 days or shorter (recentStart === rangeStart).
  const sevenDaysBeforeEnd = new Date(new Date(rangeEnd).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentStart = sevenDaysBeforeEnd > rangeStart ? sevenDaysBeforeEnd : rangeStart;
  const showRecent = recentStart > rangeStart;

  const supabase = getSupabaseAdmin();

  const [viewsResult, leadsResult] = await Promise.all([
    supabase
      .from("page_views")
      .select(
        "id, path, referrer, is_mobile, event_type, created_at, city, region, country, is_likely_bot, user_agent, session_id, duration_seconds, click_label, click_href"
      )
      .gte("created_at", rangeStart)
      .lte("created_at", rangeEnd)
      .order("created_at", { ascending: false })
      .limit(10000),
    supabase.from("contact_messages").select("created_at").gte("created_at", rangeStart).lte("created_at", rangeEnd),
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

  const totalViews = pageviewRows.length;
  const recentViews = showRecent ? pageviewRows.filter((r) => r.created_at >= recentStart).length : null;
  const callClicks = callClickRows.length;
  const recentCallClicks = showRecent ? callClickRows.filter((r) => r.created_at >= recentStart).length : null;
  const leadsTotal = leads.length;
  const recentLeads = showRecent ? leads.filter((r) => r.created_at >= recentStart).length : null;
  const botViews = botPageviewRows.length;
  const recentBotViews = showRecent ? botPageviewRows.filter((r) => r.created_at >= recentStart).length : null;

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
  const mobilePct = totalViews > 0 ? Math.round((mobileCount / totalViews) * 100) : 0;

  // Only surface rows with full city + state + country — a bare "US" with no
  // city/state (common for VPNs and some mobile carriers, which IP-geolocation
  // can't resolve further) isn't useful in a location breakdown, so it's left
  // out here rather than shown as an unhelpfully generic entry.
  const locationCounts = new Map<string, number>();
  for (const row of pageviewRows) {
    if (!row.city || !row.region || !row.country) continue;
    const label = [row.city, row.region, row.country].join(", ");
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
    rangeFrom: rangeStart.slice(0, 10),
    rangeTo: rangeEnd.slice(0, 10),
    totalViews,
    recentViews,
    viewsByDay,
    viewsByHour,
    viewsByDayOfWeek,
    topPages,
    trafficSources,
    topLocations,
    mobilePct,
    callClicks,
    recentCallClicks,
    leads: leadsTotal,
    recentLeads,
    botViews,
    recentBotViews,
    topBotAgents,
    sessions,
  });
}
