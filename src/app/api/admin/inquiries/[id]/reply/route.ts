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
  const { data: submission, error: fetchError } = await supabase
    .from("contact_submissions")
    .select("name, email")
    .eq("id", id)
    .single();

  if (fetchError || !submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await sendReplyEmail({ to: submission.email, name: submission.name, message });
  } catch (err) {
    console.error("Admin reply email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("inquiry_replies").insert({
    submission_id: id,
    admin_id: admin.id,
    admin_name: admin.display_name || admin.email,
    message,
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
