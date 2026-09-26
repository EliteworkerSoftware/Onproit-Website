import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

const STATUSES = ["in_progress", "done", "failed"];

// The revision agent reports progress: in_progress when it starts, then done
// (with a plain-English note of what it changed) or failed (with why).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { id } = await params;
  const { status, note } = await req.json().catch(() => ({}));
  if (!STATUSES.includes(status)) return NextResponse.json({ error: `status must be one of ${STATUSES.join(", ")}` }, { status: 400 });

  const update: Record<string, unknown> = { status };
  if (typeof note === "string" && note.trim()) update.result_note = note.trim().slice(0, 2000);
  if (status !== "in_progress") update.completed_at = new Date().toISOString();

  const { error } = await getSupabaseAdmin().from("content_revisions").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
