import { JWT } from "google-auth-library";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

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
