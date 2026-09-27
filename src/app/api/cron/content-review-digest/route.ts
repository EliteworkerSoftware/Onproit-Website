import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { sendContentReviewDigest } from "@/lib/notify-content-review";

// Sends ONE "ready for review" email covering everything the content agent
// finished and that hasn't been announced yet (nothing to send = no email).

async function run() {
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ sent: 0 });
  try {
    return NextResponse.json(await sendContentReviewDigest(getSupabaseAdmin()));
  } catch (err) {
    console.error("Content review digest error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Digest failed" }, { status: 500 });
  }
}

// The content agent calls this once at the end of its run.
export async function POST(req: NextRequest) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return run();
}

// Daily Vercel cron fallback, in case a run ended without calling it.
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return run();
}
