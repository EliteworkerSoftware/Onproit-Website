import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getReviewSender, sendReviewRequestEmail } from "@/lib/review-requests";

// Send one follow-up to a customer who hasn't clicked through yet.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data: request } = await supabase
    .from("review_requests")
    .select("customer_name, customer_email, token, clicked_at, reminder_sent_at, sender_id")
    .eq("id", id)
    .maybeSingle();

  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  if (request.clicked_at) return NextResponse.json({ error: "They already opened the review page" }, { status: 400 });
  if (request.reminder_sent_at) return NextResponse.json({ error: "A reminder was already sent" }, { status: 400 });

  // The follow-up comes from whoever the original was sent as (falling
  // back to you if that admin has since been removed).
  const sender =
    (request.sender_id && (await getReviewSender(supabase, request.sender_id))) || (await getReviewSender(supabase, admin.id));
  if (!sender) return NextResponse.json({ error: "No sender available" }, { status: 400 });

  try {
    await sendReviewRequestEmail({
      to: request.customer_email,
      customerName: request.customer_name,
      token: request.token,
      sender,
      isReminder: true,
    });
  } catch (err) {
    console.error("Review reminder email error:", err);
    return NextResponse.json({ error: "The email couldn't be sent — try again in a minute" }, { status: 502 });
  }

  await supabase.from("review_requests").update({ reminder_sent_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin().from("review_requests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
