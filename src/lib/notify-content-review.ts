import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { ContentReviewDigestEmail, type DigestItem } from "@/emails/ContentReviewDigestEmail";
import { getSettings, parseNotificationEmails } from "@/lib/get-settings";
import { gh, isGitHubConfigured } from "@/lib/github";

// Emails ONE "ready for review" summary covering every keyword that's been
// marked in_review and not announced yet, then stamps them so they're never
// announced twice. Called by the content agent at the end of its run, with a
// daily cron as the fallback, so a run that builds five keywords sends one
// email, not five.
export async function sendContentReviewDigest(supabase: SupabaseClient): Promise<{ sent: number }> {
  if (!isMailerConfigured()) return { sent: 0 };
  const settings = await getSettings();
  const to = parseNotificationEmails(settings.contact_notification_emails);
  if (to.length === 0) return { sent: 0 };

  // Claim the rows first (only ones still unannounced), so two digests
  // running at once can't both email the same keyword.
  const { data: claimed, error } = await supabase
    .from("target_keywords")
    .update({ review_notified_at: new Date().toISOString() })
    .eq("status", "in_review")
    .is("review_notified_at", null)
    .select("id, keyword, content_url");
  if (error) throw new Error(error.message);
  if (!claimed?.length) return { sent: 0 };

  const items = await describe(supabase, claimed);
  try {
    await sendMail({
      to,
      subject:
        items.length === 1
          ? `Content ready for review: "${items[0].keyword}"`
          : `${items.length} pieces of content ready for review`,
      react: ContentReviewDigestEmail({ items }),
    });
  } catch (err) {
    // Un-claim so the next digest retries them.
    await supabase
      .from("target_keywords")
      .update({ review_notified_at: null })
      .in(
        "id",
        claimed.map((k) => k.id)
      );
    throw err;
  }
  return { sent: items.length };
}

// Turns claimed keywords into email lines: which page batch or blog draft
// each one is in, by its plain-English title.
async function describe(
  supabase: SupabaseClient,
  keywords: { id: string; keyword: string; content_url: string | null }[]
): Promise<DigestItem[]> {
  const draftIds = keywords.map((k) => k.content_url?.match(/#draft-([\w-]+)/)?.[1]).filter((id): id is string => Boolean(id));
  const { data: drafts } = draftIds.length
    ? await supabase.from("blog_posts").select("id, title").in("id", draftIds)
    : { data: [] as { id: string; title: string }[] };
  const draftTitle = new Map((drafts ?? []).map((d) => [d.id, d.title]));

  const prTitles = new Map<string, string>();
  const prNumbers = [...new Set(keywords.map((k) => k.content_url?.match(/\/pull\/(\d+)/)?.[1]).filter(Boolean))] as string[];
  if (isGitHubConfigured()) {
    await Promise.all(
      prNumbers.map((n) =>
        gh<{ title: string }>(`/pulls/${n}`)
          .then((pr) => prTitles.set(n, pr.title))
          .catch(() => {})
      )
    );
  }

  return keywords.map((k) => {
    const draftId = k.content_url?.match(/#draft-([\w-]+)/)?.[1];
    if (draftId) return { keyword: k.keyword, kind: "blog", title: draftTitle.get(draftId) ?? null };
    const pr = k.content_url?.match(/\/pull\/(\d+)/)?.[1];
    return { keyword: k.keyword, kind: "page", title: pr ? (prTitles.get(pr) ?? null) : null };
  });
}
