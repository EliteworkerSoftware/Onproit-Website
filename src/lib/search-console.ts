import { JWT } from "google-auth-library";

// Full (not .readonly) scope — the service account is provisioned as a Full
// user on the property, so this also lets us resubmit the sitemap to force
// a fresh crawl (see submitSitemap below), not just read analytics.
const SCOPE = "https://www.googleapis.com/auth/webmasters";

export function isSearchConsoleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &&
      process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY &&
      process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL
  );
}

function getClient() {
  const privateKey = (process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  return new JWT({
    email: process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: [SCOPE],
  });
}

// Tells Google the sitemap has changed and should be re-fetched. This does
// NOT force individual pages to be (re)indexed — Google still crawls and
// ranks on its own schedule — it just clears the "we haven't looked at this
// sitemap in a while" staleness. There is no public API for the "Request
// Indexing" action in Search Console's UI; that part stays manual.
export async function submitSitemap(sitemapUrl: string): Promise<void> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL!;
  const client = getClient();

  await client.request({
    url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    method: "PUT",
  });
}

export interface SitemapStatus {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  errors?: string;
  warnings?: string;
  contents?: { type: string; submitted: string; indexed: string }[];
}

export async function listSitemaps(): Promise<SitemapStatus[]> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL!;
  const client = getClient();

  const res = await client.request<{ sitemap?: SitemapStatus[] }>({
    url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    method: "GET",
  });

  return res.data.sitemap ?? [];
}

export interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function querySearchAnalytics(params: {
  startDate: string;
  endDate: string;
  dimensions: string[];
  rowLimit?: number;
  dimensionFilterGroups?: unknown[];
}): Promise<SearchAnalyticsRow[]> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL!;
  const client = getClient();

  const res = await client.request<{ rows?: SearchAnalyticsRow[] }>({
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    method: "POST",
    data: {
      startDate: params.startDate,
      endDate: params.endDate,
      dimensions: params.dimensions,
      rowLimit: params.rowLimit ?? 25,
      ...(params.dimensionFilterGroups ? { dimensionFilterGroups: params.dimensionFilterGroups } : {}),
    },
  });

  return res.data.rows ?? [];
}
