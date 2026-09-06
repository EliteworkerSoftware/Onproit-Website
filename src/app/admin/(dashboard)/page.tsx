import Link from "next/link";
import { ArrowRight, BarChart3, Eye, Inbox, MessageSquare, MousePointerClick, Phone, Search, Settings, Shield } from "lucide-react";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { isSearchConsoleConfigured, querySearchAnalytics } from "@/lib/search-console";

const NAV_CARDS = [
  { title: "Inquiries", description: "Contact form messages, inbox and archived.", href: "/admin/inquiries", Icon: Inbox },
  { title: "Analytics", description: "Site visits, top pages, and referrers.", href: "/admin/analytics", Icon: BarChart3 },
  { title: "Admin Users", description: "Manage who can access this dashboard.", href: "/admin/admin-users", Icon: Shield },
  { title: "Settings", description: "Public contact info and business hours.", href: "/admin/settings", Icon: Settings },
];

function isoDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function isoDayNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

interface RecentInquiry {
  id: string;
  name: string;
  company: string | null;
  service: string | null;
  created_at: string;
}

async function getInquirySummary(): Promise<{ total: number; recent: RecentInquiry[] }> {
  if (!isSupabaseAdminConfigured()) return { total: 0, recent: [] };
  const supabase = getSupabaseAdmin();
  const { data, count } = await supabase
    .from("contact_messages")
    .select("id, name, company, service, created_at", { count: "exact" })
    .eq("read", false)
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(3);
  return { total: count ?? 0, recent: data ?? [] };
}

interface WeeklyStats {
  views: number;
  callClicks: number;
  ctaClicks: number;
  leads: number;
}

async function getWeeklyStats(): Promise<WeeklyStats> {
  const empty = { views: 0, callClicks: 0, ctaClicks: 0, leads: 0 };
  if (!isSupabaseAdminConfigured()) return empty;

  const supabase = getSupabaseAdmin();
  const since = isoDateNDaysAgo(7);
  const [viewsResult, leadsResult] = await Promise.all([
    supabase.from("page_views").select("event_type, is_likely_bot").gte("created_at", since).limit(10000),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);

  const rows = (viewsResult.data ?? []).filter((r) => !r.is_likely_bot);
  return {
    views: rows.filter((r) => !r.event_type).length,
    callClicks: rows.filter((r) => r.event_type === "call_click").length,
    ctaClicks: rows.filter((r) => r.event_type === "click").length,
    leads: leadsResult.count ?? 0,
  };
}

interface KeywordMover {
  keyword: string;
  change: number;
}

async function getKeywordMovers(): Promise<KeywordMover[]> {
  if (!isSupabaseAdminConfigured() || !isSearchConsoleConfigured()) return [];

  const supabase = getSupabaseAdmin();
  const { data: keywords } = await supabase.from("target_keywords").select("keyword");
  if (!keywords || keywords.length === 0) return [];

  try {
    const filterGroups = keywords.map((k) => ({
      filters: [{ dimension: "query", operator: "equals", expression: k.keyword }],
    }));
    const [current, previous] = await Promise.all([
      querySearchAnalytics({
        startDate: isoDayNDaysAgo(33),
        endDate: isoDayNDaysAgo(3),
        dimensions: ["query"],
        rowLimit: keywords.length,
        dimensionFilterGroups: filterGroups,
      }),
      querySearchAnalytics({
        startDate: isoDayNDaysAgo(63),
        endDate: isoDayNDaysAgo(34),
        dimensions: ["query"],
        rowLimit: keywords.length,
        dimensionFilterGroups: filterGroups,
      }),
    ]);

    const currentPos = new Map(current.map((r) => [r.keys[0], r.position]));
    const prevPos = new Map(previous.map((r) => [r.keys[0], r.position]));

    return keywords
      .map((k) => {
        const cur = currentPos.get(k.keyword);
        const prev = prevPos.get(k.keyword);
        if (cur === undefined || prev === undefined) return null;
        return { keyword: k.keyword, change: prev - cur };
      })
      .filter((m): m is KeywordMover => m !== null && Math.abs(m.change) >= 1)
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 3);
  } catch (err) {
    console.error("Dashboard keyword movers error:", err);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const [admin, inquiries, stats, movers] = await Promise.all([
    getCurrentAdmin(),
    getInquirySummary(),
    getWeeklyStats(),
    getKeywordMovers(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back{admin?.full_name ? `, ${admin.full_name}` : ""}</h1>
      <p className="mt-1 text-sm text-gray-500">Here&apos;s what needs your attention.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Link
          href="/admin/inquiries"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-brand" />
              <h2 className="text-sm font-semibold text-gray-900">New Inquiries</h2>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          {inquiries.total === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No unread inquiries — you&apos;re all caught up.</p>
          ) : (
            <>
              <p className="mt-2 text-2xl font-bold text-gray-900">{inquiries.total} unread</p>
              <ul className="mt-3 space-y-2">
                {inquiries.recent.map((i) => (
                  <li key={i.id} className="text-sm">
                    <span className="font-medium text-gray-900">{i.name}</span>
                    {i.company && <span className="text-gray-500"> · {i.company}</span>}
                    {i.service && <span className="text-gray-500"> · {i.service}</span>}
                    <span className="ml-2 text-xs text-gray-400">{timeAgo(i.created_at)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Link>

        <Link
          href="/admin/analytics#target-keywords"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-brand" />
              <h2 className="text-sm font-semibold text-gray-900">Ranking Changes</h2>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          {movers.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No significant moves on your target keywords in the last month.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {movers.map((m) => {
                const improved = m.change > 0;
                return (
                  <li key={m.keyword} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-gray-700">{m.keyword}</span>
                    <span className={improved ? "shrink-0 font-medium text-green-600" : "shrink-0 font-medium text-red-600"}>
                      {improved ? "+" : "-"}
                      {Math.abs(m.change).toFixed(1)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/analytics" className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-500">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Page Views</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.views}</p>
          <p className="mt-1 text-xs text-gray-400">last 7 days</p>
        </Link>
        <Link href="/admin/analytics" className="rounded-xl border border-brand/30 bg-brand/5 p-5 hover:shadow-md">
          <div className="flex items-center gap-2 text-brand">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">Call Clicks</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.callClicks}</p>
          <p className="mt-1 text-xs text-gray-400">last 7 days</p>
        </Link>
        <Link href="/admin/analytics" className="rounded-xl border border-brand/30 bg-brand/5 p-5 hover:shadow-md">
          <div className="flex items-center gap-2 text-brand">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Leads</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.leads}</p>
          <p className="mt-1 text-xs text-gray-400">last 7 days</p>
        </Link>
        <Link href="/admin/analytics" className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-500">
            <MousePointerClick className="h-4 w-4" />
            <span className="text-sm font-medium">Other CTA Clicks</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.ctaClicks}</p>
          <p className="mt-1 text-xs text-gray-400">last 7 days</p>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {NAV_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <card.Icon className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">{card.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
