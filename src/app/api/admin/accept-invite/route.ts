import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { token, password, fullName } = await req.json();
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Missing invite token" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (typeof fullName !== "string" || !fullName.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
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

  let userId: string;
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    // A previous accept attempt can leave an auth user with no profile row
    // behind (e.g. the profile insert failed after the user was created) —
    // that's a stuck, unrecoverable state for the invitee since retrying
    // just hits "already registered" forever. Self-heal by reusing that
    // existing auth user instead of treating it as a hard failure.
    if (createError?.message.includes("already been registered")) {
      const { data: existing, error: listError } = await supabase.auth.admin.listUsers();
      const existingUser = listError
        ? undefined
        : existing.users.find((u) => u.email?.toLowerCase() === invite.email.toLowerCase());
      if (!existingUser) {
        return NextResponse.json(
          { error: "An account with that email already exists — try logging in instead." },
          { status: 400 }
        );
      }
      await supabase.auth.admin.updateUserById(existingUser.id, { password, email_confirm: true });
      userId = existingUser.id;
    } else {
      return NextResponse.json({ error: createError?.message || "Failed to create account" }, { status: 400 });
    }
  } else {
    userId = created.user.id;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    email: invite.email,
    full_name: fullName.trim(),
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
