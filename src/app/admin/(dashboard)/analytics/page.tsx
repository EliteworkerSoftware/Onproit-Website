"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Bot,
  ChevronDown,
  Eye,
  Info,
  MapPin,
  MessageSquare,
  Monitor,
  MousePointerClick,
  Phone,
  Search,
  Smartphone,
  Tablet,
} from "lucide-react";

interface TimelineEvent {
  type: "page" | "click" | "call_click";
  path: string;
  label: string | null;
  href: string | null;
  durationSeconds: number | null;
  timestamp: string;
}

interface VisitorSession {
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  pageCount: number;
  ctaClicks: number;
  totalDurationSeconds: number;
  isMobile: boolean;
  os: "Apple" | "Android" | "Windows" | "Other";
  formFactor: "Phone" | "Tablet" | "Desktop";
  city: string | null;
  region: string | null;
  country: string | null;
  entryReferrer: string | null;
  entrySource: string;
  timeline: TimelineEvent[];
}

interface AnalyticsData {
  rangeFrom: string;
  rangeTo: string;
  totalViews: number;
  recentViews: number | null;
  viewsByDay: { day: string; count: number }[];
  viewsByHour: { hour: number; count: number }[];
  viewsByDayOfWeek: { day: string; count: number }[];
  topPages: { path: string; count: number }[];
  trafficSources: { source: string; count: number }[];
  topLocations: { location: string; count: number }[];
  mobilePct: number;
  callClicks: number;
  recentCallClicks: number | null;
  leads: number;
  recentLeads: number | null;
  botViews: number;
  recentBotViews: number | null;
  topBotAgents: { agent: string; count: number }[];
  sessions: VisitorSession[];
}

interface SearchQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  positionChange: number | null;
}

interface SearchQueryByPage {
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  position: number;
  positionChange: number | null;
}

interface SearchConsoleData {
  configured: boolean;
  topQueries: SearchQuery[];
  topQueriesByPage: SearchQueryByPage[];
}

const WEEKDAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isoDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatDayLabel(isoDay: string) {
  const [year, month, day] = isoDay.split("-").map(Number);
  // Constructed as UTC to match the UTC-day bucketing used server-side.
  const weekday = WEEKDAY_ABBR[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return { weekday, date: `${month}/${day}` };
}

function formatHour(hour: number) {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

function formatDuration(seconds: number) {
  if (!seconds || seconds < 1) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}m ${remaining}s`;
}

function formatLocation(s: { city: string | null; region: string | null; country: string | null }) {
  if (!s.city || !s.region || !s.country) return "Unknown location";
  return [s.city, s.region, s.country].join(", ");
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });
}

function TimelineList({ timeline }: { timeline: TimelineEvent[] }) {
  return (
    <ol className="space-y-2">
      {timeline.map((event, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 w-20 shrink-0 text-xs text-gray-400">{formatTime(event.timestamp)}</span>
          {event.type === "page" ? (
            <span className="text-gray-700">
              Viewed{" "}
              <span className="font-medium text-gray-900">{event.path === "/" ? "Home (/)" : event.path}</span>
              {event.durationSeconds != null && (
                <span className="text-gray-400"> — {formatDuration(event.durationSeconds)}</span>
              )}
            </span>
          ) : (
            <span className="text-gray-700">
              <span className={event.type === "call_click" ? "font-medium text-brand" : "font-medium text-accent"}>
                {event.type === "call_click" ? "Called" : "Clicked"}
              </span>{" "}
              &quot;{event.label ?? "unlabeled"}&quot;
              <span className="text-gray-400"> on {event.path === "/" ? "Home (/)" : event.path}</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

const FORM_FACTOR_ICON = { Phone: Smartphone, Tablet: Tablet, Desktop: Monitor };

function DeviceBadge({ os, formFactor }: { os: VisitorSession["os"]; formFactor: VisitorSession["formFactor"] }) {
  const FormIcon = FORM_FACTOR_ICON[formFactor];
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-700">
      {os === "Apple" && (
        <Image src="/images/brands/apple.svg" alt="Apple" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
      )}
      {os === "Android" && (
        <Image src="/images/brands/android.svg" alt="Android" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
      )}
      <FormIcon className="h-3.5 w-3.5 shrink-0 text-gray-500" />
      <span>{formFactor}</span>
    </span>
  );
}

function PositionChangeBadge({ change }: { change: number | null }) {
  if (change === null) return <span className="text-gray-400">new</span>;
  if (Math.abs(change) < 0.05) return <span className="text-gray-400">±0</span>;
  const improved = change > 0;
  return (
    <span className={improved ? "font-medium text-green-600" : "font-medium text-red-600"}>
      {improved ? "+" : "-"}
      {Math.abs(change).toFixed(1)}
    </span>
  );
}

function ChartYAxis({ max, heightClass }: { max: number; heightClass: string }) {
  return (
    <div className={`flex ${heightClass} w-8 shrink-0 flex-col justify-between text-right text-[10px] leading-none text-gray-400`}>
      <span>{max}</span>
      <span>{Math.round(max * 0.75)}</span>
      <span>{Math.round(max * 0.5)}</span>
      <span>{Math.round(max * 0.25)}</span>
      <span>0</span>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        aria-label="More info"
        className="flex items-center justify-center text-gray-400 hover:text-gray-600"
      >
        <Info className="h-3.5 w-3.5 cursor-help" />
      </button>
      {open && (
        <span className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-normal normal-case leading-snug text-white shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

interface TrackedKeyword {
  id: string;
  keyword: string;
  target_url: string | null;
  priority: string;
  notes: string | null;
  source: string;
  status: string;
  region: "in_area" | "out_of_area" | "unspecified" | null;
  last_impressions: number | null;
  last_clicks: number | null;
  last_position: number | null;
  last_synced_at: string | null;
  content_url: string | null;
  queued_at: string | null;
  content_published_at: string | null;
  created_at: string;
}

const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  high: "rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-600",
  low: "rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500",
  medium: "rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600",
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  queued: { label: "Queued for content", className: "bg-brand/10 text-brand" },
  done: { label: "Done", className: "bg-green-50 text-green-600" },
  discovered: { label: "Discovered", className: "bg-gray-100 text-gray-500" },
};

const KEYWORDS_PAGE_SIZE = 20;

function TargetKeywordsPanel() {
  const [keywords, setKeywords] = useState<TrackedKeyword[] | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [page, setPage] = useState(1);

  async function load() {
    const res = await fetch("/api/admin/keywords");
    const data = await res.json();
    if (res.ok) setKeywords(data.keywords);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/keywords");
      const data = await res.json();
      if (!cancelled && res.ok) setKeywords(data.keywords);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function setStatus(id: string, status: string, content_url?: string) {
    await fetch(`/api/admin/keywords/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(content_url !== undefined ? { content_url } : {}) }),
    });
    load();
  }

  function handleMarkDone(id: string) {
    const url = window.prompt(
      "URL of the content published for this keyword (leave blank if marking done without content)"
    );
    if (url === null) return; // cancelled
    setStatus(id, "done", url.trim() || undefined);
  }

  async function handleRemove(id: string) {
    await fetch(`/api/admin/keywords/${id}`, { method: "DELETE" });
    load();
  }

  // Keywords with deliberate work behind them — queued or done — sorted
  // most-recently-touched first. This is the "what have we actually done"
  // view, kept separate and always visible rather than buried behind the
  // filters used for browsing the much larger discovery list.
  const inProgress = useMemo(() => {
    if (!keywords) return [];
    return keywords
      .filter((k) => k.status === "queued" || k.status === "done")
      .sort((a, b) => {
        const aTime = a.content_published_at || a.queued_at || a.created_at;
        const bTime = b.content_published_at || b.queued_at || b.created_at;
        return bTime.localeCompare(aTime);
      });
  }, [keywords]);

  const regionSummary = useMemo(() => {
    if (!keywords || keywords.length === 0) return null;
    let total = 0;
    let inArea = 0;
    let outOfArea = 0;
    for (const k of keywords) {
      const impressions = k.last_impressions ?? 0;
      total += impressions;
      if (k.region === "in_area") inArea += impressions;
      if (k.region === "out_of_area") outOfArea += impressions;
    }
    if (total === 0) return null;
    return {
      inAreaPct: Math.round((inArea / total) * 100),
      outOfAreaPct: Math.round((outOfArea / total) * 100),
    };
  }, [keywords]);

  const counts = useMemo(() => {
    if (!keywords) return null;
    return {
      total: keywords.length,
      queued: keywords.filter((k) => k.status === "queued").length,
      done: keywords.filter((k) => k.status === "done").length,
      high: keywords.filter((k) => k.priority === "high").length,
      outOfArea: keywords.filter((k) => k.region === "out_of_area").length,
    };
  }, [keywords]);

  const filtered = useMemo(() => {
    if (!keywords) return [];
    const q = search.trim().toLowerCase();
    return keywords.filter((k) => {
      if (q && !k.keyword.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && k.status !== statusFilter) return false;
      if (priorityFilter !== "all" && k.priority !== priorityFilter) return false;
      if (regionFilter !== "all" && (k.region ?? "unspecified") !== regionFilter) return false;
      return true;
    });
  }, [keywords, search, statusFilter, priorityFilter, regionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / KEYWORDS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * KEYWORDS_PAGE_SIZE, currentPage * KEYWORDS_PAGE_SIZE);

  function updateFilter(setter: (v: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  const hasActiveFilters = search !== "" || statusFilter !== "all" || priorityFilter !== "all" || regionFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setRegionFilter("all");
    setPage(1);
  }

  return (
    <>
      <div id="content-effort" className="mt-6 scroll-mt-6 rounded-xl border border-brand/30 bg-brand/5 p-6">
        <div className="flex items-center gap-2">
          <MousePointerClick className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-semibold text-gray-900">Content Effort</h2>
          <InfoTooltip text="Every keyword you've queued or finished content for, most recently touched first — the record of actual work, separate from the much bigger list of everything Search Console has discovered. Position shown is as of the last daily sync, so you can watch whether a keyword's ranking actually moved after you published something for it." />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          What you&apos;ve actually put effort into — queued for content or already published.
        </p>

        {!keywords ? (
          <p className="mt-4 text-sm text-gray-500">Loading…</p>
        ) : inProgress.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            Nothing queued yet. Find a keyword worth targeting below and click &quot;Queue for content.&quot;
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-brand/10">
            {inProgress.map((k) => {
              const status = STATUS_BADGE[k.status] ?? STATUS_BADGE.discovered;
              return (
                <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900">{k.keyword}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {k.last_impressions != null
                        ? `#${Number(k.last_position).toFixed(1)} avg · ${k.last_impressions} shown · ${k.last_clicks} clicked`
                        : "No Search Console data yet"}
                      {k.status === "queued" && k.queued_at && ` · queued ${formatTimestamp(k.queued_at)}`}
                    </p>
                    {k.status === "done" && (
                      <p className="mt-0.5 text-xs text-green-600">
                        {k.content_url ? (
                          <>
                            Published{k.content_published_at ? ` ${formatTimestamp(k.content_published_at)}` : ""}:{" "}
                            <a href={k.content_url} target="_blank" rel="noopener noreferrer" className="underline">
                              {k.content_url}
                            </a>
                          </>
                        ) : (
                          "Marked done — no content URL recorded"
                        )}
                      </p>
                    )}
                  </div>
                  {k.status === "queued" && (
                    <button
                      onClick={() => handleMarkDone(k.id)}
                      className="shrink-0 text-xs font-medium text-green-600 hover:underline"
                    >
                      Mark done
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div id="target-keywords" className="mt-6 scroll-mt-6 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-900">Target Keywords</h2>
        <InfoTooltip text="This list populates itself — a daily job pulls every real query Search Console sees for your site (at least 3 impressions in the trailing 30 days) with no manual entry. Priority is computed automatically from real numbers, not a guess: High = 50+ impressions and within reach of page 1 (position ≤30). Medium = decent demand (15+ impressions) further out. Low = everything else. Search Console only reports the searcher's country, never city/state, so 'Outside service area' is detected by parsing the town name in the query text itself against your real coverage area — any North/Central Jersey town gets forced to Low priority automatically regardless of demand, since you don't want to pursue that. Click 'Queue for content' on anything worth writing about — that just flags it. Tell Claude to check the content queue in a chat session and it'll go write the actual blog post or page update for whatever's flagged, then mark it done with a link to what was actually published, so there's a real record instead of just a checkbox." />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        Auto-synced daily from Search Console — nothing here was typed in by hand. Queue anything
        worth building content for, then ask Claude to check the queue.
      </p>

      {regionSummary && (
        <p
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            regionSummary.inAreaPct >= 50 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {regionSummary.inAreaPct}% of search demand is inside your real service area
          {regionSummary.outOfAreaPct > 0 && ` · ${regionSummary.outOfAreaPct}% is out-of-area (North/Central Jersey, deprioritized automatically)`}
        </p>
      )}

      {!keywords ? (
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      ) : keywords.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          Nothing synced yet — the daily job hasn&apos;t run, or no query has 3+ impressions yet.
        </p>
      ) : (
        <>
          {counts && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => updateFilter(setStatusFilter, "queued")}
                className="rounded-full bg-brand/10 px-3 py-1 font-medium text-brand hover:bg-brand/20"
              >
                {counts.queued} queued
              </button>
              <button
                onClick={() => updateFilter(setPriorityFilter, "high")}
                className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-600 hover:bg-red-100"
              >
                {counts.high} high priority
              </button>
              <button
                onClick={() => updateFilter(setStatusFilter, "done")}
                className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-600 hover:bg-green-100"
              >
                {counts.done} done
              </button>
              <button
                onClick={() => updateFilter(setRegionFilter, "out_of_area")}
                className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-600 hover:bg-orange-100"
              >
                {counts.outOfArea} outside area
              </button>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-500">{counts.total} total</span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => updateFilter(setSearch, e.target.value)}
              placeholder="Search keywords…"
              className="min-w-40 flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <select
              value={statusFilter}
              onChange={(e) => updateFilter(setStatusFilter, e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All statuses</option>
              <option value="discovered">Discovered</option>
              <option value="queued">Queued</option>
              <option value="done">Done</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => updateFilter(setPriorityFilter, e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={regionFilter}
              onChange={(e) => updateFilter(setRegionFilter, e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All regions</option>
              <option value="in_area">In service area</option>
              <option value="out_of_area">Outside service area</option>
              <option value="unspecified">No town mentioned</option>
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs font-medium text-gray-500 hover:underline">
                Clear filters
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * KEYWORDS_PAGE_SIZE + 1}–
            {Math.min(currentPage * KEYWORDS_PAGE_SIZE, filtered.length)} of {filtered.length}
            {hasActiveFilters ? ` matching (${counts?.total} total)` : ""}
          </p>
        </>
      )}

      {keywords && keywords.length > 0 && paged.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-100">
          {paged.map((k) => {
            const status = STATUS_BADGE[k.status] ?? STATUS_BADGE.discovered;
            return (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-900">{k.keyword}</span>
                    <span className={PRIORITY_BADGE_CLASSES[k.priority] ?? PRIORITY_BADGE_CLASSES.medium}>
                      {k.priority}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {k.source === "search_console" ? "from Search Console" : "manual"}
                    </span>
                    {k.region === "out_of_area" && (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-orange-600">
                        Outside service area
                      </span>
                    )}
                  </div>
                  {k.target_url && <p className="text-xs text-gray-400">{k.target_url}</p>}
                  <p className="mt-0.5 text-xs text-gray-500">
                    {k.last_impressions != null
                      ? `#${Number(k.last_position).toFixed(1)} avg · ${k.last_impressions} shown · ${k.last_clicks} clicked (last synced ${k.last_synced_at ? formatTimestamp(k.last_synced_at) : "—"})`
                      : "No Search Console data recorded yet"}
                  </p>
                  {k.notes && <p className="mt-1 text-xs italic text-gray-400">{k.notes}</p>}
                  {k.status === "queued" && k.queued_at && (
                    <p className="mt-1 text-xs text-brand">Queued {formatTimestamp(k.queued_at)}</p>
                  )}
                  {k.status === "done" && (
                    <p className="mt-1 text-xs text-green-600">
                      {k.content_url ? (
                        <>
                          Content published{k.content_published_at ? ` ${formatTimestamp(k.content_published_at)}` : ""}:{" "}
                          <a href={k.content_url} target="_blank" rel="noopener noreferrer" className="underline">
                            {k.content_url}
                          </a>
                        </>
                      ) : (
                        "Marked done — no content URL recorded"
                      )}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {k.status !== "queued" && (
                    <button
                      onClick={() => setStatus(k.id, "queued")}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      Queue for content
                    </button>
                  )}
                  {k.status === "queued" && (
                    <button
                      onClick={() => handleMarkDone(k.id)}
                      className="text-xs font-medium text-green-600 hover:underline"
                    >
                      Mark done
                    </button>
                  )}
                  <button onClick={() => handleRemove(k.id)} className="text-xs font-medium text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {keywords && keywords.length > 0 && filtered.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No keywords match these filters.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="text-xs font-medium text-gray-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:no-underline"
          >
            ← Previous
          </button>
          <span className="text-xs text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="text-xs font-medium text-gray-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:no-underline"
          >
            Next →
          </button>
        </div>
      )}
      </div>
    </>
  );
}

const RANGE_PRESETS = [
  { label: "Today", from: () => todayIso(), to: () => todayIso() },
  { label: "Last 7 Days", from: () => isoDateNDaysAgo(6), to: () => todayIso() },
  { label: "Last 30 Days", from: () => isoDateNDaysAgo(29), to: () => todayIso() },
  { label: "Last 90 Days", from: () => isoDateNDaysAgo(89), to: () => todayIso() },
];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [from, setFrom] = useState(isoDateNDaysAgo(29));
  const [to, setTo] = useState(todayIso());
  const [searchData, setSearchData] = useState<SearchConsoleData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/analytics?from=${from}&to=${to}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load analytics");
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load analytics");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/search-console?from=${from}&to=${to}`);
        const json = await res.json();
        if (!cancelled && res.ok) setSearchData(json);
      } catch {
        // Search Console is a bonus panel — fail silently rather than
        // blocking the rest of the analytics page.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  function toggleExpanded(sessionId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  }

  const maxDayCount = data ? Math.max(1, ...data.viewsByDay.map((d) => d.count)) : 1;
  const maxHourCount = data ? Math.max(1, ...data.viewsByHour.map((d) => d.count)) : 1;
  const maxDowCount = data ? Math.max(1, ...data.viewsByDayOfWeek.map((d) => d.count)) : 1;

  // Below 8 days, every weekday appears at most once in the range, so "Views
  // by Day of Week" would just repeat "Views Per Day" with different labels.
  const rangeDays = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
  const showDayOfWeekChart = rangeDays > 7;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">
        Real human visits, calls, and leads for onproit.com. Suspected bot traffic is tracked
        separately below, not mixed into these numbers.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">From</label>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">To</label>
          <input
            type="date"
            value={to}
            min={from}
            max={todayIso()}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          {RANGE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setFrom(preset.from());
                setTo(preset.to());
              }}
              className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-brand hover:text-brand"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!data ? (
        <p className="mt-8 text-sm text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Page Views</span>
                <InfoTooltip text="Every page load in the selected range, one per view. A visitor who looks at 3 pages counts as 3. Suspected bots are excluded and tracked separately below." />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalViews}</p>
              {data.recentViews !== null && (
                <p className="mt-1 text-xs text-gray-400">{data.recentViews} in the last 7 days</p>
              )}
            </div>
            <div className="rounded-xl border border-brand/30 bg-brand/5 p-5">
              <div className="flex items-center gap-2 text-brand">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Call Button Clicks</span>
                <InfoTooltip text="Every click on a phone number or 'Call Now' link anywhere on the site, tracked automatically wherever a tel: link appears." />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.callClicks}</p>
              {data.recentCallClicks !== null && (
                <p className="mt-1 text-xs text-gray-400">{data.recentCallClicks} in the last 7 days</p>
              )}
            </div>
            <div className="rounded-xl border border-brand/30 bg-brand/5 p-5">
              <div className="flex items-center gap-2 text-brand">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Contact Form Leads</span>
                <InfoTooltip text="Contact form submissions successfully saved to the database in this range, regardless of whether the optional Message field was filled in." />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.leads}</p>
              {data.recentLeads !== null && (
                <p className="mt-1 text-xs text-gray-400">{data.recentLeads} in the last 7 days</p>
              )}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-gray-500">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">Mobile Visitors</span>
                <InfoTooltip text="Percentage of page views where the visitor's browser identified itself as a phone or mobile device." />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.mobilePct}%</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">Views Per Day</h2>
              <InfoTooltip text="Total page views for each calendar day in the selected range (day boundaries in UTC). Shows the day-to-day trend — spikes, dips, and the effect of anything you changed on a given date." />
            </div>
            {data.viewsByDay.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No page views recorded yet.</p>
            ) : (
              <div className="mt-4 flex gap-2">
                <ChartYAxis max={maxDayCount} heightClass="h-40" />
                <div className="flex h-40 flex-1 items-end gap-1 border-l border-gray-100 pl-2">
                  {data.viewsByDay.map((d) => (
                    <div key={d.day} className="group relative h-full flex-1">
                      <div
                        className="absolute bottom-0 w-full rounded-t bg-brand transition-colors group-hover:bg-brand-dark"
                        style={{ height: `${Math.max(4, (d.count / maxDayCount) * 100)}%` }}
                      />
                      <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                        {d.day}: {d.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.viewsByDay.length > 0 && (
              <div className="mt-2 flex gap-1 pl-12">
                {data.viewsByDay.map((d) => {
                  const { weekday, date } = formatDayLabel(d.day);
                  return (
                    <div key={d.day} className="flex flex-1 flex-col items-center leading-tight">
                      <span className="text-[9px] font-medium text-gray-500">{weekday}</span>
                      <span className="text-[9px] text-gray-400">{date}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`mt-6 grid grid-cols-1 gap-6 ${showDayOfWeekChart ? "lg:grid-cols-2" : ""}`}>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900">Views by Time of Day</h2>
                <InfoTooltip text="Every page view in the range, bucketed by the hour it happened (converted to Eastern time) and summed across all days. Shows what time of day people tend to visit — useful for staffing chat/phone coverage." />
              </div>
              <p className="mt-1 text-xs text-gray-400">Eastern time, selected range</p>
              <div className="mt-4 flex gap-2">
                <ChartYAxis max={maxHourCount} heightClass="h-32" />
                <div className="flex h-32 flex-1 items-end gap-0.5 border-l border-gray-100 pl-2">
                  {data.viewsByHour.map((d) => (
                    <div key={d.hour} className="group relative h-full flex-1">
                      <div
                        className="absolute bottom-0 w-full rounded-t bg-brand transition-colors group-hover:bg-brand-dark"
                        style={{ height: `${Math.max(3, (d.count / maxHourCount) * 100)}%` }}
                      />
                      <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                        {formatHour(d.hour)}: {d.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-1 flex gap-0.5 pl-12">
                {data.viewsByHour.map((d) => (
                  <div key={d.hour} className="flex-1 text-center">
                    {d.hour % 3 === 0 && (
                      <span className="text-[9px] text-gray-400">{formatHour(d.hour)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {showDayOfWeekChart && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">Views by Day of Week</h2>
                  <InfoTooltip text="Page views bucketed by weekday (Eastern time) and added together across every occurrence in the range — e.g. every Monday's views summed into one bar. Shows which day of the week performs best on average, not a day-by-day timeline." />
                </div>
                <p className="mt-1 text-xs text-gray-400">Eastern time, selected range</p>
                <div className="mt-4 flex gap-2">
                  <ChartYAxis max={maxDowCount} heightClass="h-32" />
                  <div className="flex h-32 flex-1 items-end gap-2 border-l border-gray-100 pl-2">
                    {data.viewsByDayOfWeek.map((d) => (
                      <div key={d.day} className="group relative h-full flex-1">
                        <div
                          className="absolute bottom-0 w-full rounded-t bg-brand transition-colors group-hover:bg-brand-dark"
                          style={{ height: `${Math.max(3, (d.count / maxDowCount) * 100)}%` }}
                        />
                        <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                          {d.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-1 flex gap-2 pl-12">
                  {data.viewsByDayOfWeek.map((d) => (
                    <div key={d.day} className="flex-1 text-center text-[10px] text-gray-400">
                      {d.day}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900">Top Pages</h2>
                <InfoTooltip text="The pages with the most page views in the selected range, most-viewed first." />
              </div>
              {data.topPages.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">No page views recorded yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.topPages.map((p) => (
                    <li key={p.path} className="flex items-center justify-between text-sm">
                      <span className="truncate text-gray-700">{p.path === "/" ? "Home (/)" : p.path}</span>
                      <span className="ml-3 shrink-0 font-medium text-gray-900">{p.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900">Traffic Sources</h2>
                <InfoTooltip text="How visitors arrived, based on the referrer their browser sent: Direct (typed the URL, used a bookmark, or the browser sent no referrer at all — e.g. links from texts or some email/privacy apps), a named search engine (Google, Bing, Yahoo, DuckDuckGo, etc.), Social, or Referral from another site." />
              </div>
              {data.trafficSources.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">No page views recorded yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.trafficSources.map((s) => (
                    <li key={s.source} className="flex items-center justify-between text-sm">
                      <span className="truncate text-gray-700">{s.source}</span>
                      <span className="ml-3 shrink-0 font-medium text-gray-900">{s.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">Top Locations</h2>
                <InfoTooltip text="Visitor city/state/country resolved from their IP address, only shown here when all three could be determined. VPNs and some mobile carriers can't be resolved this precisely and are left out of this list (though still counted in Page Views above)." />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Only visits we could resolve to a full city, state, and country.
              </p>
              {data.topLocations.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">No location data recorded yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.topLocations.map((l) => (
                    <li key={l.location} className="flex items-center justify-between text-sm">
                      <span className="truncate text-gray-700">{l.location}</span>
                      <span className="ml-3 shrink-0 font-medium text-gray-900">{l.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {searchData?.configured && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-900">Top Search Queries</h2>
                  <InfoTooltip text="Real search terms people typed into Google, from Search Console — separate from and more precise than the search engine names in Traffic Sources. Impressions = your site appeared in the results for that search. Clicks = someone actually clicked through. Avg position = where in the results your site tended to show up (#1 is the top result); a high number means you're showing up on page 2+, which explains impressions with zero clicks. The green/red number compares average position to the immediately preceding period of equal length — green means it moved up (toward #1), red means it dropped. This is aggregate data across everyone who searched — it can't be tied to a specific visitor session." />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  What people actually typed into Google to find onproit.com, via Search Console.
                </p>
                {searchData.topQueries.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">No search query data for this range yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {searchData.topQueries.map((q) => (
                      <li key={q.query} className="text-sm">
                        <p className="wrap-break-word text-gray-700">{q.query}</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {q.impressions} shown · {q.clicks} clicked · #{q.position.toFixed(1)} avg{" "}
                          (<PositionChangeBadge change={q.positionChange} /> vs. prior period)
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-900">Top Query by Landing Page</h2>
                  <InfoTooltip text="For each page, the single search term that drove the most clicks to it (via Search Console). Only pages with at least one real click show up here." />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  The single top-clicked search term that brought visitors to each page.
                </p>
                {searchData.topQueriesByPage.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">No search query data for this range yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {searchData.topQueriesByPage.map((p) => (
                      <li key={p.page} className="text-sm">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                          <span className="font-medium text-gray-900">
                            {new URL(p.page).pathname === "/" ? "Home (/)" : new URL(p.page).pathname}
                          </span>
                          <span className="shrink-0 text-xs text-gray-400">{p.clicks} clicks</span>
                        </div>
                        <p className="mt-0.5 wrap-break-word text-xs text-gray-500">&quot;{p.query}&quot;</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          #{p.position.toFixed(1)} avg (<PositionChangeBadge change={p.positionChange} /> vs. prior
                          period)
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {searchData?.configured && <TargetKeywordsPanel />}

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-900">Recent Visitors</h2>
              <InfoTooltip text="One row per browser session (a visit lasts until the tab/browser closes). Device is parsed from the visitor's browser (Apple/Android logo plus phone, tablet, or desktop) — Windows and other platforms show just the form-factor icon. CTA Clicks counts every link and button clicked anywhere on the site during that visit. Time on Site is measured live as they browse, so it only appears once they've navigated away or closed the tab." />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Click a row for the full page-by-page timeline — time on each page and every link or
              button clicked, in order.
            </p>
            {data.sessions.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No visitor sessions recorded yet.</p>
            ) : (
              <>
                {/* Desktop: full table */}
                <div className="mt-4 hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-180 text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                        <th className="pb-2 pr-4 font-medium">First Seen</th>
                        <th className="pb-2 pr-4 font-medium">Location</th>
                        <th className="pb-2 pr-4 font-medium">Source</th>
                        <th className="pb-2 pr-4 font-medium">Device</th>
                        <th className="pb-2 pr-4 font-medium">Pages</th>
                        <th className="pb-2 pr-4 font-medium">CTA Clicks</th>
                        <th className="pb-2 pr-4 font-medium">Time on Site</th>
                        <th className="pb-2 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {data.sessions.map((s) => {
                        const isOpen = expanded.has(s.sessionId);
                        return (
                          <Fragment key={s.sessionId}>
                            <tr
                              onClick={() => toggleExpanded(s.sessionId)}
                              className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-2 pr-4 text-gray-700">{formatTimestamp(s.firstSeen)}</td>
                              <td className="py-2 pr-4 text-gray-700">{formatLocation(s)}</td>
                              <td className="py-2 pr-4 text-gray-700">{s.entrySource}</td>
                              <td className="py-2 pr-4">
                                <DeviceBadge os={s.os} formFactor={s.formFactor} />
                              </td>
                              <td className="py-2 pr-4 text-gray-700">{s.pageCount}</td>
                              <td className="py-2 pr-4 font-medium text-brand">{s.ctaClicks}</td>
                              <td className="py-2 pr-4 text-gray-700">{formatDuration(s.totalDurationSeconds)}</td>
                              <td className="py-2">
                                <ChevronDown
                                  className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                />
                              </td>
                            </tr>
                            {isOpen && (
                              <tr className="border-b border-gray-100 bg-gray-50">
                                <td colSpan={8} className="px-4 py-4">
                                  <TimelineList timeline={s.timeline} />
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: stacked cards instead of a wide table that requires side-scrolling */}
                <div className="mt-4 space-y-3 sm:hidden">
                  {data.sessions.map((s) => {
                    const isOpen = expanded.has(s.sessionId);
                    return (
                      <div key={s.sessionId} className="rounded-lg border border-gray-200">
                        <button
                          onClick={() => toggleExpanded(s.sessionId)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formatTimestamp(s.firstSeen)}</p>
                            <p className="text-xs text-gray-500">{formatLocation(s)}</p>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-100 px-4 py-3 text-sm">
                          <div>
                            <dt className="text-xs text-gray-400">Source</dt>
                            <dd className="text-gray-700">{s.entrySource}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-400">Device</dt>
                            <dd>
                              <DeviceBadge os={s.os} formFactor={s.formFactor} />
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-400">Pages</dt>
                            <dd className="text-gray-700">{s.pageCount}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-400">CTA Clicks</dt>
                            <dd className="font-medium text-brand">{s.ctaClicks}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-400">Time on Site</dt>
                            <dd className="text-gray-700">{formatDuration(s.totalDurationSeconds)}</dd>
                          </div>
                        </dl>
                        {isOpen && (
                          <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                            <TimelineList timeline={s.timeline} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-amber-900">Potential Bot Traffic</h2>
              <InfoTooltip text="Requests whose User-Agent self-identifies or pattern-matches a known crawler, script, or monitoring tool. These are excluded from every number above rather than mixed in — but a sophisticated bot pretending to be a real browser looks identical to a human here and won't be caught." />
            </div>
            <p className="mt-1 text-xs text-amber-700">
              Requests that self-identify or pattern-match as automated (crawlers, scripts,
              monitoring tools). Kept separate from the human numbers above rather than hidden —
              a sophisticated bot disguised as a real browser wouldn&apos;t be caught by this.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-3xl font-bold text-amber-900">{data.botViews}</p>
                {data.recentBotViews !== null && (
                  <p className="mt-1 text-xs text-amber-700">
                    bot-flagged views ({data.recentBotViews} in the last 7 days)
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Top Bot User Agents
                </p>
                {data.topBotAgents.length === 0 ? (
                  <p className="mt-2 text-sm text-amber-700">None recorded.</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {data.topBotAgents.map((b) => (
                      <li key={b.agent} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate text-amber-900">{b.agent}</span>
                        <span className="shrink-0 font-medium text-amber-900">{b.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
