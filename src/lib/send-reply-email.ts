import "server-only";
import { sendMail } from "@/lib/mailer";
import { AdminReplyEmail } from "@/emails/AdminReplyEmail";

export async function sendReplyEmail({ to, name, message }: { to: string; name: string; message: string }) {
  // This is a direct reply to something the recipient sent us, so it sends
  // from the real monitored inbox instead of noreply@ — a Reply-To header on
  // a noreply From still leaves "noreply" as the visible sender, which reads
  // as "don't reply" even when it would technically route correctly.
  const from = `ONPRO IT <${(process.env.CONTACT_TO_EMAIL || "sales@onproit.com").trim()}>`;
  await sendMail({
    to,
    from,
    subject: "Re: Your message to ONPRO IT",
    react: AdminReplyEmail({ name, message }),
  });
}
