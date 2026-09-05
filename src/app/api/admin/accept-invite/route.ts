import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Missing invite token" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: invite, error: inviteError } = await supabase
    .from("admin_invites")
    .select("id, email, status, expires_at")
    .eq("token", token)
    .single();

  if (inviteError || !invite) {
    return NextResponse.json({ error: "Invalid or expired invite link" }, { status: 400 });
  }
  if (invite.status !== "pending") {
    return NextResponse.json({ error: "This invite has already been used" }, { status: 400 });
  }
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "This invite link has expired" }, { status: 400 });
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const message = createError?.message.includes("already been registered")
      ? "An account with that email already exists — try logging in instead."
      : createError?.message || "Failed to create account";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: created.user.id,
    email: invite.email,
    role: "admin",
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  await supabase
    .from("admin_invites")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  return NextResponse.json({ ok: true });
}
