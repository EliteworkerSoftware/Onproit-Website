import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { COLORS } from "./constants";

export function AdminReplyEmail({ name, message }: { name: string; message: string }) {
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <EmailLayout preview="A reply from the ONPRO IT team">
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
        A reply from ONPRO IT
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
        Hi {firstName},
      </Heading>

      <Text
        style={{
          margin: 0,
          fontFamily: FONT_STACK,
          fontSize: 16,
          lineHeight: "26px",
          color: COLORS.ink,
          whiteSpace: "pre-wrap",
        }}
      >
        {message}
      </Text>

      <Text style={{ margin: "32px 0 0", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        — The ONPRO IT team
      </Text>
    </EmailLayout>
  );
}

export default AdminReplyEmail;
