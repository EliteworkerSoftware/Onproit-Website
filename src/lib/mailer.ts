import "server-only";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

export function isMailerConfigured(): boolean {
  return !!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);
}

export async function sendMail({
  to,
  subject,
  react,
  from,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
}): Promise<void> {
  if (!isMailerConfigured()) {
    throw new Error("Mailgun is not configured: set MAILGUN_API_KEY and MAILGUN_DOMAIN in .env.local.");
  }

  const [html, text] = await Promise.all([render(react), render(react, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY! });
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: from || process.env.CONTACT_FROM_EMAIL || `ONPRO IT Website <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    html,
    text,
  });
}
