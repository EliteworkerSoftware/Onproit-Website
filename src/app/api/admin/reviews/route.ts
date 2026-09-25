import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isMailerConfigured } from "@/lib/mailer";
import { getReviewLink, sendReviewRequestEmail } from "@/lib/review-requests";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Asking the same customer twice in a month is pushy; the admin can still
// override after a warning.
const DUPLICATE_WINDOW_DAYS = 30;

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const [link, { data, error }] = await Promise.all([
    getReviewLink(supabase),
    supabase
      .from("review_requests")
      .select("id, created_at, customer_name, customer_email, note, sent_by, reminder_sent_at, clicked_at")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  if (error) {
    const missing = error.message.includes("review_requests");
    return NextResponse.json(
      { error: missing ? "Run supabase/migration-review-requests.sql in Supabase first." : error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ reviewLink: link, requests: data });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isMailerConfigured()) return NextResponse.json({ error: "Email sending isn't configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const note = typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 1000) : null;

  if (!name || name.length > 120) return NextResponse.json({ error: "Enter the customer's name" }, { status: 400 });
  if (!EMAIL_PATTERN.test(email)) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const reviewLink = await getReviewLink(supabase);
  if (!reviewLink) {
    return NextResponse.json({ error: "Save your Google review link at the top of this page first" }, { status: 400 });
  }

  if (!body.force) {
    const since = new Date(Date.now() - DUPLICATE_WINDOW_DAYS * 86_400_000).toISOString();
    const { data: recent } = await supabase
      .from("review_requests")
      .select("created_at")
      .ilike("customer_email", email)
      .gte("created_at", since)
      .limit(1);
    if (recent && recent.length > 0) {
      return NextResponse.json(
        {
          duplicate: true,
          error: `${email} was already asked on ${new Date(recent[0].created_at).toLocaleDateString("en-US")}. Send again anyway?`,
        },
        { status: 409 }
      );
    }
  }

  const token = randomUUID();
  const senderName = admin.full_name?.trim().split(/\s+/)[0] || "The team";

  try {
    await sendReviewRequestEmail({ to: email, customerName: name, token, note, senderName });
  } catch (err) {
    console.error("Review request email error:", err);
    return NextResponse.json({ error: "The email couldn't be sent — try again in a minute" }, { status: 502 });
  }

  const { error } = await supabase.from("review_requests").insert({
    customer_name: name,
    customer_email: email,
    note,
    token,
    sent_by: admin.full_name || admin.email,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
