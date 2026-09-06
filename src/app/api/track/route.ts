import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

// Blocks both named crawlers/bots and generic non-browser HTTP clients
// (scripts, monitoring tools, link-checkers). Note this is defense-in-depth,
// not the primary filter — most bots never reach this at all, since tracking
// only fires from client-side JS in a real browser, not on the server.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|curl|wget|python-requests|python-urllib|go-http-client|java\/|libwww|okhttp|axios|node-fetch|postmanruntime|insomnia|http_?client|scrapy|phantomjs|selenium|puppeteer|playwright|lighthouse|pingdom|uptimerobot|monitor/i;

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: true });

  const userAgent = req.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) return NextResponse.json({ ok: true });

  const { path, referrer, event } = await req.json().catch(() => ({ path: null, referrer: null, event: null }));
  if (typeof path !== "string" || !path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }
  const eventType = event === "call_click" ? "call_click" : null;

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
    });
  } catch (err) {
    console.error("Page view tracking error:", err);
  }

  return NextResponse.json({ ok: true });
}
