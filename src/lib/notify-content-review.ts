import "server-only";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { KeywordInReviewEmail } from "@/emails/KeywordInReviewEmail";
import { getSettings, parseNotificationEmails } from "@/lib/get-settings";

// Emails the contact-notification recipients that the content agent has
// something waiting for review. Call from inside after() — never throws.
export async function notifyContentReview(params: { keyword: string; reviewUrl: string; kind: "pr" | "blog" }) {
  if (!isMailerConfigured()) return;
  const settings = await getSettings();
  const to = parseNotificationEmails(settings.contact_notification_emails);
  if (to.length === 0) return;
  try {
    await sendMail({
      to,
      subject:
        params.kind === "blog"
          ? `Blog draft ready for review: "${params.keyword}"`
          : `Page ready for review: "${params.keyword}"`,
      react: KeywordInReviewEmail(params),
    });
  } catch (err) {
    console.error("Content review notification email error:", err);
  }
}
