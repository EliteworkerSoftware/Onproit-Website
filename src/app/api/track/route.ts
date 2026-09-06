import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

// Flags (rather than drops) traffic that self-identifies or pattern-matches
// as automated — named crawlers, generic non-browser HTTP clients, scripts,
// monitoring tools, and headless browser frameworks. Recording it instead of
// discarding it lets the admin dashboard show bot traffic as its own
// category rather than making it invisible. Note this only catches bots
// that either announce themselves or use a recognizable client — a
// sophisticated headless browser spoofing a real User-Agent looks identical
// to a human here and isn't something a header check can catch.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|curl|wget|python-requests|python-urllib|go-http-client|java\/|libwww|okhttp|axios|node-fetch|postmanruntime|insomnia|http_?client|scrapy|phantomjs|selenium|puppeteer|playwright|lighthouse|pingdom|uptimerobot|monitor/i;

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: true });

  const { path, referrer, event } = await req.json().catch(() => ({ path: null, referrer: null, event: null }));
  if (typeof path !== "string" || !path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }
  const eventType = event === "call_click" ? "call_click" : null;

  const userAgent = req.headers.get("user-agent") ?? "";
  const isLikelyBot = !userAgent || BOT_PATTERN.test(userAgent);
  const country = req.headers.get("x-vercel-ip-country");
  const region = req.headers.get("x-vercel-ip-country-region");
  const cityHeader = req.headers.get("x-vercel-ip-city");
  const city = cityHeader ? decodeURIComponent(cityHeader) : null;
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);

  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("page_views").insert({
      path,
      referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
      country,
      region,
      city,
      is_mobile: isMobile,
      event_type: eventType,
      is_likely_bot: isLikelyBot,
      user_agent: userAgent ? userAgent.slice(0, 300) : null,
    });
  } catch (err) {
    console.error("Page view tracking error:", err);
  }

  return NextResponse.json({ ok: true });
}
