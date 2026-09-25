import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/mailer";
import { ReviewRequestEmail } from "@/emails/ReviewRequestEmail";
import { EMAIL, SITE_URL } from "@/lib/constants";

// The business's Google "leave a review" link, saved in Admin → Reviews
// (app_settings), e.g. https://g.page/r/XXXX/review.
const REVIEW_LINK_KEY = "google_review_link";

export async function getReviewLink(supabase: SupabaseClient): Promise<string | null> {
  const { data } = await supabase.from("app_settings").select("value").eq("key", REVIEW_LINK_KEY).maybeSingle();
  return data?.value || null;
}

export async function saveReviewLink(supabase: SupabaseClient, link: string) {
  const { error } = await supabase.from("app_settings").upsert(
    {
      key: REVIEW_LINK_KEY,
      value: link,
      updated_at: new Date().toISOString(),
      category: "reviews",
      description: "Google Business Profile 'leave a review' link used in review request emails (onproit.com)",
    },
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}

// Only real Google review links — a typo'd or pasted-wrong URL would send
// every customer somewhere useless.
export function isGoogleReviewLink(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return /(^|\.)(google\.[a-z.]+|g\.page|goo\.gl)$/.test(url.hostname);
  } catch {
    return false;
  }
}

// The link that goes in the email: our own redirect, so the click is
// recorded before the customer lands on Google.
export function trackedReviewUrl(token: string) {
  return `${SITE_URL}/review/${token}`;
}

export async function sendReviewRequestEmail(params: {
  to: string;
  customerName: string;
  token: string;
  note?: string | null;
  senderName: string;
  isReminder?: boolean;
}) {
  const firstName = params.customerName.trim().split(/\s+/)[0];
  // From the real monitored inbox with a person's name on it — personal asks
  // get far more reviews than a noreply@, and replies come straight to us.
  const inbox = (process.env.CONTACT_TO_EMAIL || EMAIL).trim();
  await sendMail({
    to: params.to,
    from: `${params.senderName} at ONPRO IT <${inbox}>`,
    subject: params.isReminder ? `Quick follow-up, ${firstName}` : `${firstName}, how did we do?`,
    react: ReviewRequestEmail({
      firstName,
      reviewLink: trackedReviewUrl(params.token),
      note: params.note,
      senderName: params.senderName,
      isReminder: params.isReminder,
    }),
  });
}
