import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendAdminInviteEmail } from "@/lib/send-admin-invite-email";
import { SITE_URL } from "@/lib/constants";

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data, currentUserId: admin.id });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await req.json();
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("admin_invites").insert({
    email: normalizedEmail,
    token,
    expires_at: expiresAt,
    created_by: admin.id,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let emailSent = true;
  try {
    await sendAdminInviteEmail({
      to: normalizedEmail,
      inviteLink: `${SITE_URL}/admin/accept-invite?token=${token}`,
    });
  } catch (err) {
    console.error("Admin invite email error:", err);
    emailSent = false;
  }

  return NextResponse.json({ ok: true, emailSent });
}
