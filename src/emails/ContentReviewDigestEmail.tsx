import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

export interface DigestItem {
  keyword: string;
  // "page" = new or improved website pages (a batch of website changes);
  // "blog" = a blog post draft.
  kind: "page" | "blog";
  // The page batch's or blog draft's title, when known.
  title: string | null;
}

const REVIEW_URL = `${SITE_URL}/admin/content-review`;

// One email per content-agent run listing everything waiting for review.
export function ContentReviewDigestEmail({ items }: { items: DigestItem[] }) {
  const pages = items.filter((i) => i.kind === "page");
  const blogs = items.filter((i) => i.kind === "blog");
  // Page keywords grouped by the batch they're in.
  const batches = new Map<string, string[]>();
  for (const p of pages) {
    const key = p.title ?? "Website changes";
    batches.set(key, [...(batches.get(key) ?? []), p.keyword]);
  }

  const labelStyle = {
    margin: "0 0 6px",
    fontFamily: FONT_STACK,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: COLORS.inkMuted,
  };
  const lineStyle = { margin: "0 0 6px", fontFamily: FONT_STACK, fontSize: 15, lineHeight: "22px", color: COLORS.ink };

  return (
    <EmailLayout preview={`${items.length} ${items.length === 1 ? "item is" : "items are"} ready for your review`}>
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
          margin: "0 0 12px",
          fontFamily: FONT_STACK,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        New content is ready for your review
      </Heading>
      <Text style={{ margin: "0 0 24px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        The content agent finished {items.length === 1 ? "a keyword" : `${items.length} keywords`}. Nothing is live yet
        &mdash; review everything on one page, then publish, request changes, or reject.
      </Text>

      {[...batches.entries()].map(([title, keywords]) => (
        <div key={title} style={{ marginBottom: 20 }}>
          <Text style={labelStyle}>Website pages &middot; {title}</Text>
          {keywords.map((k) => (
            <Text key={k} style={lineStyle}>
              &bull; &ldquo;{k}&rdquo;
            </Text>
          ))}
        </div>
      ))}

      {blogs.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Text style={labelStyle}>Blog post drafts</Text>
          {blogs.map((b) => (
            <Text key={b.keyword} style={lineStyle}>
              &bull; {b.title ? <strong>{b.title}</strong> : null}
              {b.title ? " — for " : ""}&ldquo;{b.keyword}&rdquo;
            </Text>
          ))}
        </div>
      )}

      <Spacer height={8} />
      <PillButton href={REVIEW_URL}>Review everything</PillButton>
    </EmailLayout>
  );
}

export default ContentReviewDigestEmail;
