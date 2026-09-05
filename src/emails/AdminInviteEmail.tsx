import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

export function AdminInviteEmail({ tempPassword }: { tempPassword: string }) {
  return (
    <EmailLayout preview="Your ONPRO IT admin login">
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
        Here&rsquo;s your ONPRO IT admin login
      </Heading>

      <Text style={{ margin: "0 0 24px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        You&rsquo;ve been given access to the ONPRO IT admin dashboard. Use the password below to
        log in.
      </Text>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: COLORS.paperAlt,
                border: `2px solid ${COLORS.brand}`,
                borderRadius: 12,
                padding: "18px 20px",
                textAlign: "center",
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: COLORS.ink,
              }}
            >
              {tempPassword}
            </td>
          </tr>
        </tbody>
      </table>

      <Spacer height={28} />
      <PillButton href={`${SITE_URL}/admin/login`}>Log in</PillButton>

      <Spacer height={28} />
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        Keep this password somewhere safe — there&rsquo;s no self-service way to change it yet. If
        you ever need a new one, ask another admin to remove and re-invite your account.
      </Text>
    </EmailLayout>
  );
}

export default AdminInviteEmail;
