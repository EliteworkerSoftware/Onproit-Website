import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

// "pr" = a pull request with new/changed pages; "blog" = a blog post draft
// waiting in the admin dashboard. Either way nothing is live until approved.
const COPY = {
  pr: {
    what: "wrote content for",
    where: "opened a pull request",
    next: "review the PR and merge it to publish",
    button: "Review the pull request",
  },
  blog: {
    what: "wrote a blog post for",
    where: "saved it as a draft",
    next: "review the draft and publish it from the dashboard",
    button: "Review the blog draft",
  },
} as const;

export function KeywordInReviewEmail({
  keyword,
  reviewUrl,
  kind = "pr",
}: {
  keyword: string;
  reviewUrl: string;
  kind?: keyof typeof COPY;
}) {
  const copy = COPY[kind];
  return (
    <EmailLayout preview={`New content ready for review: "${keyword}"`}>
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
        Content agent
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
        New content is ready for your review
      </Heading>

      <Text style={{ margin: "0 0 28px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        The content agent {copy.what} <strong>&ldquo;{keyword}&rdquo;</strong> and {copy.where}. Nothing is live
        yet &mdash; {copy.next}.
      </Text>

      <PillButton href={reviewUrl}>{copy.button}</PillButton>

      <Spacer height={28} />
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        Track every keyword on the{" "}
        <a href={`${SITE_URL}/admin/analytics#target-keywords`} style={{ color: COLORS.brand }}>
          analytics dashboard
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

export default KeywordInReviewEmail;
