import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { FieldList } from "./components/FieldList";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

export function BookingConfirmedEmail({
  attendeeName,
  attendeeEmail,
  eventType,
  when,
}: {
  attendeeName: string;
  attendeeEmail: string;
  eventType?: string | null;
  when: string;
}) {
  return (
    <EmailLayout preview={`New booking from ${attendeeName}`}>
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
        New consultation booked
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
        {attendeeName} booked a call
      </Heading>

      <FieldList
        fields={[
          { label: "Name", value: attendeeName },
          { label: "Email", value: attendeeEmail },
          { label: "Event", value: eventType || "Consultation" },
          { label: "When", value: when },
        ]}
      />

      <Spacer height={32} />
      <PillButton href={`${SITE_URL}/admin/bookings`}>View in dashboard</PillButton>
    </EmailLayout>
  );
}

export default BookingConfirmedEmail;
