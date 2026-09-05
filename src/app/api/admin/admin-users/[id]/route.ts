import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json({ error: "You can't remove your own account" }, { status: 400 });
  }

  // Removes dashboard access (deletes the profile row getCurrentAdmin looks
  // up) without deleting the underlying Supabase Auth user, in case the same
  // account is used elsewhere on this shared project.
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
