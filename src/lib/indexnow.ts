import { SITE_URL } from "@/lib/constants";

// IndexNow: a single ping tells every participating engine at once (Bing,
// Yandex — Google does not participate). Each URL is normally picked up
// within minutes rather than however long the next organic crawl takes.
// https://www.indexnow.org/documentation

export function isIndexNowConfigured(): boolean {
  return Boolean(process.env.INDEXNOW_KEY);
}

export async function submitUrlsToIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || urls.length === 0) return;

  const host = new URL(SITE_URL).host;

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList: urls,
    }),
  });

  // IndexNow returns 200 or 202 on success; anything else is worth knowing
  // about even though we don't want a bad ping to fail whatever triggered it.
  if (!res.ok) {
    console.error(`IndexNow submission failed: ${res.status} ${await res.text()}`);
  }
}
