import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentAdmin } from "@/lib/current-admin";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { currentPassword, newPassword } = await req.json();
  if (typeof currentPassword !== "string" || !currentPassword) {
    return NextResponse.json({ error: "Enter your current password" }, { status: 400 });
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  // Re-verify the current password before allowing a change, since the
  // session cookie alone isn't proof the person at the keyboard knows it.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: admin.email,
    password: currentPassword,
  });
  if (verifyError) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
