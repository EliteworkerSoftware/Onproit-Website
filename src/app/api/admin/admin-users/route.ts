import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { generateTempPassword, hashPassword } from "@/lib/admin-password";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendAdminInviteEmail } from "@/lib/send-admin-invite-email";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, display_name, joined_at, last_login_at")
    .order("joined_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data, currentUserId: admin.id });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, displayName } = await req.json();
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const tempPassword = generateTempPassword();
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("admin_users").insert({
    email: normalizedEmail,
    display_name: displayName?.trim() || null,
    password_hash: hashPassword(tempPassword),
  });

  if (error) {
    const message = error.code === "23505" ? "An admin with that email already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // The account already exists at this point — a Mailgun hiccup shouldn't
  // turn into a 500 for an account that now exists but has no way to know
  // its own password, so this failure is reported, not thrown.
  let emailSent = true;
  try {
    await sendAdminInviteEmail({ to: normalizedEmail, tempPassword });
  } catch (err) {
    console.error("Admin invite email error:", err);
    emailSent = false;
  }

  return NextResponse.json({ ok: true, emailSent });
}
