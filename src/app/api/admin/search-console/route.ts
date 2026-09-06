import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { isSearchConsoleConfigured, querySearchAnalytics } from "@/lib/search-console";

function isoDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!isSearchConsoleConfigured()) {
    return NextResponse.json({ configured: false, topQueries: [], topQueriesByPage: [] });
  }

  const { searchParams } = new URL(req.url);
  // Search Console data typically lags 2-3 days, so default the window to
  // end a few days back rather than "today" to avoid a misleadingly sparse
  // final day.
  const startDate = searchParams.get("from") ?? isoDateNDaysAgo(30);
  const endDate = searchParams.get("to") ?? isoDateNDaysAgo(3);

  // Previous period of equal length immediately before this one, used to
  // compute how much each query's/page's average position moved.
  const rangeDays = Math.round((new Date(`${endDate}T00:00:00Z`).getTime() - new Date(`${startDate}T00:00:00Z`).getTime()) / 86400000) + 1;
  const prevEndDate = addDays(startDate, -1);
  const prevStartDate = addDays(prevEndDate, -(rangeDays - 1));

  try {
    const [queryRows, pageQueryRows, prevQueryRows, prevPageQueryRows] = await Promise.all([
      querySearchAnalytics({ startDate, endDate, dimensions: ["query"], rowLimit: 20 }),
      querySearchAnalytics({ startDate, endDate, dimensions: ["page", "query"], rowLimit: 1000 }),
      querySearchAnalytics({ startDate: prevStartDate, endDate: prevEndDate, dimensions: ["query"], rowLimit: 1000 }),
      querySearchAnalytics({ startDate: prevStartDate, endDate: prevEndDate, dimensions: ["page", "query"], rowLimit: 1000 }),
    ]);

    const prevQueryPosition = new Map<string, number>();
    for (const r of prevQueryRows) prevQueryPosition.set(r.keys[0], r.position);

    const prevPageQueryPosition = new Map<string, number>();
    for (const r of prevPageQueryRows) prevPageQueryPosition.set(r.keys.join("::"), r.position);

    const topQueries = queryRows.map((r) => {
      const query = r.keys[0];
      const prevPosition = prevQueryPosition.get(query);
      return {
        query,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
        // Positive = moved up (toward #1, a lower position number). null = no data for this query last period.
        positionChange: prevPosition !== undefined ? prevPosition - r.position : null,
      };
    });

    // Keep only the single top query (by clicks) for each landing page.
    const bestPerPage = new Map<string, SearchAnalyticsPageRow>();
    for (const r of pageQueryRows) {
      const [page, query] = r.keys;
      const existing = bestPerPage.get(page);
      if (!existing || r.clicks > existing.clicks) {
        bestPerPage.set(page, { page, query, clicks: r.clicks, impressions: r.impressions, position: r.position });
      }
    }
    const topQueriesByPage = Array.from(bestPerPage.values())
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20)
      .map((r) => {
        const prevPosition = prevPageQueryPosition.get(`${r.page}::${r.query}`);
        return { ...r, positionChange: prevPosition !== undefined ? prevPosition - r.position : null };
      });

    return NextResponse.json({ configured: true, startDate, endDate, topQueries, topQueriesByPage });
  } catch (err) {
    console.error("Search Console query error:", err);
    return NextResponse.json({ error: "Failed to load Search Console data" }, { status: 500 });
  }
}

interface SearchAnalyticsPageRow {
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  position: number;
}
