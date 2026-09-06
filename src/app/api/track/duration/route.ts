import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

// Fired via sendBeacon when a visitor navigates away or closes the tab, to
// record how long they actually spent on the page that was already logged
// by /api/track. Capped so a laptop left open overnight doesn't skew data.
const MAX_DURATION_SECONDS = 3600;

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: true });

  const host = req.headers.get("host") ?? "";
  if (!host.includes("onproit.com")) return NextResponse.json({ ok: true });

  const body = await req.json().catch(() => null);
  const id = body?.id;
  const duration = Number(body?.duration);

  if (typeof id !== "string" || !id || !Number.isFinite(duration) || duration < 0) {
    return NextResponse.json({ error: "id and duration are required" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    await supabase
      .from("page_views")
      .update({ duration_seconds: Math.min(Math.round(duration), MAX_DURATION_SECONDS) })
      .eq("id", id);
  } catch (err) {
    console.error("Duration tracking error:", err);
  }

  return NextResponse.json({ ok: true });
}
