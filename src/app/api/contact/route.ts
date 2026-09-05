import { NextRequest, NextResponse, after } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { ContactLeadEmail } from "@/emails/ContactLeadEmail";

const NAME_LIMIT = 200;
const COMPANY_LIMIT = 200;
const MESSAGE_LIMIT = 5000;

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, service, message, turnstileToken } = await req.json();

    if (typeof name !== "string" || !name.trim() || name.length > NAME_LIMIT) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    if (company != null && (typeof company !== "string" || company.length > COMPANY_LIMIT)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (message != null && (typeof message !== "string" || message.length > MESSAGE_LIMIT)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const remoteIp = req.headers.get("x-forwarded-for");
    const isHuman = await verifyTurnstile(turnstileToken, remoteIp);
    if (!isHuman) {
      return NextResponse.json({ error: "Verification failed — please try again" }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Form submission is not configured yet. Please call us instead." },
        { status: 503 }
      );
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      service: service?.trim() || null,
      message: message?.trim() || null,
      source: "website",
    };

    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase.from("contact_submissions").insert(payload);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    // Team notification runs after the response is already sent — via
    // after(), not just fire-and-forget — so a slow Mailgun call can't push
    // the visitor-facing request past its timeout.
    after(async () => {
      if (!isMailerConfigured()) return;
      try {
        const { data: recipients } = await supabase
          .from("email_recipients")
          .select("email")
          .eq("notify_contact_forms", true);

        const to = (recipients ?? []).map((r) => r.email);
        if (to.length === 0) return;

        await sendMail({
          to,
          subject: `New ONPRO IT inquiry from ${payload.name}`,
          react: ContactLeadEmail(payload),
        });
      } catch (err) {
        console.error("Contact notification email error:", err);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
