import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendReplyEmail } from "@/lib/send-reply-email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { message } = await req.json();
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Reply message is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: contactMessage, error: fetchError } = await supabase
    .from("contact_messages")
    .select("name, email")
    .eq("id", id)
    .single();

  if (fetchError || !contactMessage) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await sendReplyEmail({ to: contactMessage.email, name: contactMessage.name, message });
  } catch (err) {
    console.error("Admin reply email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  await supabase.from("contact_messages").update({ read: true }).eq("id", id);

  return NextResponse.json({ ok: true });
}
