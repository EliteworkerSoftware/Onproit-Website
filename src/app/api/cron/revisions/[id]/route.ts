import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { snapshotTarget, type RevisionKind } from "@/lib/content-revisions";

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

  const supabase = getSupabaseAdmin();
  const { data: row, error } = await supabase.from("content_revisions").update(update).eq("id", id).select("kind, target").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "Revision not found" }, { status: 404 });

  // Record the item as it was when work started and when it finished, so
  // Content Review can show exactly what changed. Best effort: a missing
  // snapshot only hides the comparison.
  if (status !== "failed") {
    try {
      const snapshot = await snapshotTarget(supabase, row.kind as RevisionKind, row.target);
      if (snapshot) {
        await supabase
          .from("content_revisions")
          .update(status === "in_progress" ? { before_snapshot: snapshot } : { after_snapshot: snapshot })
          .eq("id", id);
      }
    } catch {}
  }
  return NextResponse.json({ ok: true });
}
