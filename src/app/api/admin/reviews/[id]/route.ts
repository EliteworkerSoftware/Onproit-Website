import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getReviewSender, sendReviewRequestEmail } from "@/lib/review-requests";

// Within this long of the original, a resend repeats the original email
// (e.g. "I never got it"); after that it's the friendlier follow-up.
const FOLLOW_UP_AFTER_DAYS = 3;
// Guards against double-clicks and back-to-back resends to the same person.
const MIN_HOURS_BETWEEN_RESENDS = 1;

// Resend a review request. reminder_sent_at records the most recent resend.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data: request } = await supabase
    .from("review_requests")
    .select("created_at, customer_name, customer_email, note, token, reminder_sent_at, sender_id")
    .eq("id", id)
    .maybeSingle();

  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  const lastSent = new Date(request.reminder_sent_at ?? request.created_at).getTime();
  if (Date.now() - lastSent < MIN_HOURS_BETWEEN_RESENDS * 3_600_000) {
    return NextResponse.json({ error: "This was just sent — wait an hour before resending" }, { status: 429 });
  }
  const isReminder = Date.now() - new Date(request.created_at).getTime() > FOLLOW_UP_AFTER_DAYS * 86_400_000;

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
      // The personal note belongs to the original message only.
      note: isReminder ? null : request.note,
      sender,
      isReminder,
    });
  } catch (err) {
    console.error("Review reminder email error:", err);
    return NextResponse.json({ error: "The email couldn't be sent — try again in a minute" }, { status: 502 });
  }

  await supabase.from("review_requests").update({ reminder_sent_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ ok: true, kind: isReminder ? "follow-up" : "original" });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin().from("review_requests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
