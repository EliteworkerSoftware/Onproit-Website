import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionCookieValue,
} from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/admin-password";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin dashboard is not configured yet. Set up Supabase first." },
      { status: 503 }
    );
  }

  const { email, password } = await req.json();
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("admin_users")
    .select("id, password_hash")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (error || !user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Best-effort — a failed write here shouldn't block the actual login.
  await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionCookieValue(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
