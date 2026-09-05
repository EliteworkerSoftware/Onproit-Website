import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { BookingConfirmedEmail } from "@/emails/BookingConfirmedEmail";
import { EMAIL } from "@/lib/constants";

// Cal.com signs the raw request body with the webhook secret you set when
// creating the webhook in its dashboard — verify it here so this public URL
// can't be used to inject fake bookings or spam the notification email.
function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

type CalAttendee = { name?: string; email?: string; phoneNumber?: string };
type CalBookingPayload = {
  uid?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  attendees?: CalAttendee[];
  // The phone number question can land in any of these depending on how it's
  // configured on the event type — check all rather than betting on one.
  responses?: { phone?: { value?: string }; attendeePhoneNumber?: { value?: string } };
  smsReminderNumber?: string;
  // Cal.com puts the join link in different places depending on the video
  // provider — metadata.videoCallUrl covers Google Meet/Cal Video, while
  // videoCallData.url is the provider's own link for other integrations.
  metadata?: { videoCallUrl?: string };
  videoCallData?: { url?: string };
};
type CalWebhookEvent = {
  triggerEvent?: string;
  payload?: CalBookingPayload;
};

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-cal-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: CalWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const booking = event.payload;
  if (!booking?.uid) {
    return NextResponse.json({ ok: true });
  }

  const pipelineStatus =
    event.triggerEvent === "BOOKING_CANCELLED"
      ? "cancelled"
      : event.triggerEvent === "BOOKING_RESCHEDULED"
        ? "rescheduled"
        : "confirmed";

  const attendee = booking.attendees?.[0];
  const meetingUrl = booking.metadata?.videoCallUrl || booking.videoCallData?.url || null;
  const attendeePhone =
    attendee?.phoneNumber ||
    booking.responses?.attendeePhoneNumber?.value ||
    booking.responses?.phone?.value ||
    booking.smsReminderNumber ||
    null;

  const supabase = getSupabaseAdmin();
  const { error: dbError } = await supabase.from("bookings").upsert(
    {
      booking_uid: booking.uid,
      attendee_name: attendee?.name ?? null,
      attendee_email: attendee?.email ?? null,
      attendee_phone: attendeePhone,
      event_type: booking.title ?? null,
      starts_at: booking.startTime ?? null,
      ends_at: booking.endTime ?? null,
      meeting_url: meetingUrl,
      pipeline_status: pipelineStatus,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "booking_uid" }
  );

  if (dbError) {
    console.error("Supabase upsert error:", dbError);
  }

  // Notify only on new bookings, not every cancel/reschedule ping.
  if (event.triggerEvent === "BOOKING_CREATED" && isMailerConfigured()) {
    const when = booking.startTime
      ? new Date(booking.startTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
      : "unknown time";

    try {
      const to = process.env.CONTACT_TO_EMAIL || EMAIL;
      await sendMail({
        to,
        subject: `New consultation booked: ${attendee?.name || attendee?.email || "someone"}`,
        react: BookingConfirmedEmail({
          attendeeName: attendee?.name || attendee?.email || "Someone",
          attendeeEmail: attendee?.email || "no email given",
          eventType: booking.title,
          when,
        }),
      });
    } catch (err) {
      console.error("Booking notification email error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
