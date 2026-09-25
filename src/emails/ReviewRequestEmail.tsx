import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS } from "./constants";
import { ADDRESS_FULL, PHONE_DISPLAY } from "@/lib/constants";

// Asks a customer for a Google review. Deliberately short and personal —
// one ask, one button. The same message goes to every customer (Google's
// policy prohibits only asking the ones you expect to be happy).
export function ReviewRequestEmail({
  firstName,
  reviewLink,
  note,
  senderName,
  isReminder = false,
}: {
  firstName: string;
  reviewLink: string;
  note?: string | null;
  senderName: string;
  isReminder?: boolean;
}) {
  const body = { margin: "0 0 20px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink };

  return (
    <EmailLayout preview="Would you share how we did? It takes about 30 seconds.">
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
        {isReminder ? `Quick follow-up, ${firstName}` : `How did we do, ${firstName}?`}
      </Heading>

      {note && <Text style={body}>{note}</Text>}

      <Text style={body}>
        {isReminder
          ? "Just a friendly nudge in case my last email got buried. If you have a moment, a quick Google review would mean a lot to our team."
          : "Thanks for choosing ONPRO IT. If you have a minute, would you share how we did on Google? It helps other local businesses find a team they can trust — and it means a lot to our small team."}
      </Text>

      <Spacer height={8} />
      <PillButton href={reviewLink}>Leave a Google review</PillButton>
      <Spacer height={28} />

      <Text style={{ ...body, margin: "0 0 4px" }}>It only takes about 30 seconds. Thank you!</Text>
      <Text style={{ ...body, margin: 0, fontWeight: 600 }}>— {senderName}, ONPRO IT</Text>

      <Spacer height={36} />
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 12, lineHeight: "20px", color: COLORS.inkMuted }}>
        ONPRO IT · {ADDRESS_FULL} · {PHONE_DISPLAY}
        <br />
        Something not right? Just reply to this email — it comes straight to us.
      </Text>
    </EmailLayout>
  );
}

export default ReviewRequestEmail;
