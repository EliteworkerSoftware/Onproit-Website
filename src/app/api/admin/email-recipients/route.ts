import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("email_recipients")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recipients: data });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, name, phone, role, notify_contact_forms, notify_chatbot_leads } = await req.json();
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("email_recipients")
    .insert({
      email: email.trim().toLowerCase(),
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      role: role?.trim() || null,
      notify_contact_forms: notify_contact_forms ?? true,
      notify_chatbot_leads: notify_chatbot_leads ?? false,
    })
    .select()
    .single();

  if (error) {
    const message = error.code === "23505" ? "That email is already a recipient" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ recipient: data });
}
