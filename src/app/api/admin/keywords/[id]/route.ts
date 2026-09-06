import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { target_url, priority, notes, status } = await req.json().catch(() => ({}));

  const update: Record<string, string | null> = {};
  if (target_url !== undefined) update.target_url = target_url || null;
  if (priority !== undefined) update.priority = priority || "medium";
  if (notes !== undefined) update.notes = notes || null;
  if (status !== undefined && ["discovered", "queued", "done"].includes(status)) update.status = status;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("target_keywords").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("target_keywords").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
