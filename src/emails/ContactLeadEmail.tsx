import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { FieldList } from "./components/FieldList";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

export function ContactLeadEmail({
  name,
  email,
  phone,
  company,
  service,
  message,
}: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message?: string | null;
}) {
  return (
    <EmailLayout preview={`New inquiry from ${name}`}>
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
        New contact form lead
      </Text>
      <Heading
        style={{
          margin: "0 0 24px",
          fontFamily: FONT_STACK,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        {name} wants to hear more
      </Heading>

      <FieldList
        fields={[
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Phone", value: phone || "—" },
          { label: "Company", value: company || "—" },
          { label: "Service Interest", value: service || "—" },
        ]}
      />

      {message && (
        <>
          <Spacer height={20} />
          <Text
            style={{
              margin: "0 0 8px",
              fontFamily: FONT_STACK,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: COLORS.inkMuted,
            }}
          >
            Message
          </Text>
          <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 15, lineHeight: "24px", color: COLORS.ink }}>
            {message}
          </Text>
        </>
      )}

      <Spacer height={32} />
      <PillButton href={`${SITE_URL}/admin/inquiries`}>View in dashboard</PillButton>
    </EmailLayout>
  );
}

export default ContactLeadEmail;
