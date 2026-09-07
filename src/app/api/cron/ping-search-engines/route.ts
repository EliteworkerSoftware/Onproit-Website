import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getAllSiteUrls } from "@/lib/site-urls";
import { isIndexNowConfigured, submitUrlsToIndexNow } from "@/lib/indexnow";
import { isSearchConsoleConfigured, submitSitemap } from "@/lib/search-console";

// Runs on a schedule (see vercel.json) so new/changed pages get picked up
// without anyone remembering to click "resubmit" by hand. Pings IndexNow
// (Bing, Yandex) with every URL, and re-pings Google's sitemap endpoint so
// it knows to re-crawl — the sitemap ping needs the GSC service account to
// be a Full user on the property, not just Restricted; it fails harmlessly
// (logged, not thrown) until that's set.
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const urls = await getAllSiteUrls();
  const results: Record<string, unknown> = { urlCount: urls.length };

  if (isIndexNowConfigured()) {
    try {
      await submitUrlsToIndexNow(urls);
      results.indexNow = "ok";
    } catch (e) {
      results.indexNow = `error: ${(e as Error).message}`;
    }
  } else {
    results.indexNow = "skipped: not configured";
  }

  if (isSearchConsoleConfigured()) {
    try {
      await submitSitemap(`${SITE_URL}/sitemap.xml`);
      results.googleSitemap = "ok";
    } catch (e) {
      results.googleSitemap = `error: ${(e as Error).message}`;
    }
  } else {
    results.googleSitemap = "skipped: not configured";
  }

  return NextResponse.json({ ok: true, ...results });
}
