import { Button, Heading, Img, Link, Section, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";
import { ADDRESS_FULL, PHONE_DISPLAY } from "@/lib/constants";

const GOOGLE_G = `${SITE_URL}/images/email/google-g.png`;
// Google's own review-star yellow. Stars are text, not an image, so they
// still show when a mail client (e.g. Outlook) blocks images by default.
const STAR_GOLD = "#FBBC04";

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
      {/* Rating card — the whole card links to the review page. */}
      <Section
        style={{
          backgroundColor: COLORS.paperAlt,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 16,
          padding: "24px 16px 20px",
          marginBottom: 28,
        }}
      >
        <Link href={reviewLink} style={{ textDecoration: "none" }}>
          <Img src={GOOGLE_G} width="44" height="44" alt="Google" style={{ display: "block", margin: "0 auto" }} />
          <Text
            style={{
              margin: "12px 0 6px",
              fontFamily: FONT_STACK,
              fontSize: 34,
              lineHeight: "36px",
              letterSpacing: "6px",
              color: STAR_GOLD,
            }}
          >
            ★★★★★
          </Text>
          <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 13, color: COLORS.inkMuted }}>
            Rate your experience with ONPRO IT on Google
          </Text>
        </Link>
      </Section>

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
      <Button
        href={reviewLink}
        style={{
          backgroundColor: COLORS.brand,
          color: "#ffffff",
          fontFamily: FONT_STACK,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
          padding: "10px 26px 10px 10px",
          borderRadius: 999,
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#ffffff",
            borderRadius: 999,
            padding: 6,
            marginRight: 10,
            verticalAlign: "middle",
            lineHeight: 0,
          }}
        >
          <img src={GOOGLE_G} width="18" height="18" alt="" style={{ display: "block", border: 0 }} />
        </span>
        <span style={{ verticalAlign: "middle" }}>Review us on Google</span>
      </Button>
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
