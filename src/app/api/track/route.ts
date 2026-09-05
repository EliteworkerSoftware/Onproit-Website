import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

const BOT_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless/i;

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: true });

  const userAgent = req.headers.get("user-agent") ?? "";
  if (BOT_PATTERN.test(userAgent)) return NextResponse.json({ ok: true });

  const { path, referrer, event } = await req.json().catch(() => ({ path: null, referrer: null, event: null }));
  if (typeof path !== "string" || !path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }
  const eventType = event === "call_click" ? "call_click" : null;

  const country = req.headers.get("x-vercel-ip-country");
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);

  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("page_views").insert({
      path,
      referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
      country,
      is_mobile: isMobile,
      event_type: eventType,
    });
  } catch (err) {
    console.error("Page view tracking error:", err);
  }

  return NextResponse.json({ ok: true });
}
