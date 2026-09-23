import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

export function KeywordInReviewEmail({ keyword, prUrl }: { keyword: string; prUrl: string }) {
  return (
    <EmailLayout preview={`New page ready for review: "${keyword}"`}>
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
        A new page is ready for your review
      </Heading>

      <Text style={{ margin: "0 0 28px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        The content agent wrote a page for the keyword <strong>&ldquo;{keyword}&rdquo;</strong> and opened a
        pull request. Nothing is live yet &mdash; review the PR and merge it to publish.
      </Text>

      <PillButton href={prUrl}>Review the pull request</PillButton>

      <Spacer height={28} />
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        Once it&rsquo;s merged and live, mark the keyword done on the{" "}
        <a href={`${SITE_URL}/admin/analytics#target-keywords`} style={{ color: COLORS.brand }}>
          analytics dashboard
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

export default KeywordInReviewEmail;
