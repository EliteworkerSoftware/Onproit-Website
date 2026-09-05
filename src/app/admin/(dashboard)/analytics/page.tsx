"use client";

import { useEffect, useState } from "react";
import { Eye, Globe, Smartphone, TrendingUp } from "lucide-react";

interface AnalyticsData {
  totalViews30d: number;
  totalViews7d: number;
  viewsByDay: { day: string; count: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  mobilePct: number;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/analytics");
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
  }, []);

  const maxDayCount = data ? Math.max(1, ...data.viewsByDay.map((d) => d.count)) : 1;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">
        Real visits to onproit.com, tracked directly — last 30 days.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!data ? (
        <p className="mt-8 text-sm text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Page Views (30 days)</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalViews30d}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Page Views (7 days)</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalViews7d}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-gray-500">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">Mobile Visitors</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{data.mobilePct}%</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-gray-900">Views Per Day</h2>
            {data.viewsByDay.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No page views recorded yet.</p>
            ) : (
              <div className="mt-4 flex h-40 items-end gap-1">
                {data.viewsByDay.map((d) => (
                  <div key={d.day} className="group relative flex-1">
                    <div
                      className="rounded-t bg-brand transition-colors group-hover:bg-brand-dark"
                      style={{ height: `${Math.max(4, (d.count / maxDayCount) * 100)}%` }}
                    />
                    <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                      {d.day}: {d.count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-gray-900">Top Pages</h2>
              {data.topPages.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">No page views recorded yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.topPages.map((p) => (
                    <li key={p.path} className="flex items-center justify-between text-sm">
                      <span className="truncate text-gray-700">{p.path}</span>
                      <span className="ml-3 shrink-0 font-medium text-gray-900">{p.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">Top Referrers</h2>
              </div>
              {data.topReferrers.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">
                  No external referrers yet — visits are direct or from search.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.topReferrers.map((r) => (
                    <li key={r.referrer} className="flex items-center justify-between text-sm">
                      <span className="truncate text-gray-700">{r.referrer}</span>
                      <span className="ml-3 shrink-0 font-medium text-gray-900">{r.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
