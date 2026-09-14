import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

// Narrow write path for the content-writing automation — the only thing it's
// allowed to do is flag a queued keyword as "in_review" with a link to the PR
// it opened. It can never mark a keyword "done" (that's a human confirming
// the PR was merged and content is actually live) or touch anything else,
// so a leaked CONTENT_AGENT_SECRET can't be used to tamper with the rest of
// the keyword pipeline.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { id } = await params;
  const { pr_url } = await req.json().catch(() => ({}));
  if (typeof pr_url !== "string" || !pr_url.trim()) {
    return NextResponse.json({ error: "pr_url is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("target_keywords")
    .update({ status: "in_review", content_url: pr_url.trim() })
    .eq("id", id)
    .eq("status", "queued");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
