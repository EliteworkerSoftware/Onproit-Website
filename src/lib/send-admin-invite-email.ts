import "server-only";
import { sendMail } from "@/lib/mailer";
import { AdminInviteEmail } from "@/emails/AdminInviteEmail";

export async function sendAdminInviteEmail({ to, inviteLink }: { to: string; inviteLink: string }) {
  await sendMail({
    to,
    subject: "You've been added to the ONPRO IT admin dashboard",
    react: AdminInviteEmail({ inviteLink }),
  });
}
