import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS } from "./constants";

export function AdminInviteEmail({ inviteLink }: { inviteLink: string }) {
  return (
    <EmailLayout preview="You've been invited to the ONPRO IT admin dashboard">
      <Text
        style={{
          margin: "0 0 4px",
          fontFamily: FONT_STACK,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: COLORS.brand,
        }}
      >
        Admin access
      </Text>
      <Heading
        style={{
          margin: "0 0 20px",
          fontFamily: FONT_STACK,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        You&rsquo;ve been added to the ONPRO IT admin dashboard
      </Heading>

      <Text style={{ margin: "0 0 28px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        Click below to set your password and activate your account.
      </Text>

      <PillButton href={inviteLink}>Set your password</PillButton>

      <Spacer height={28} />
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        This link expires in 7 days. If you weren&rsquo;t expecting this invite, you can safely
        ignore this email.
      </Text>
    </EmailLayout>
  );
}

export default AdminInviteEmail;
