import { NextRequest, NextResponse, after } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { sanitizePostHtml } from "@/lib/sanitize-post-html";
import { BLOG_CATEGORIES, draftReviewUrl } from "@/lib/blog-drafts";
import { notifyContentReview } from "@/lib/notify-content-review";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Unpublished drafts allowed to pile up before the agent is told to stop —
// a backlog nobody is reviewing means more drafts won't help.
const MAX_PENDING_DRAFTS = 10;

// Lets the content automation save a blog post as an unpublished draft
// (published_at stays null, so it's invisible on the site). A human
// publishes or deletes it from /admin/blog-drafts. The HTML is sanitized on
// the way in, and this route can't publish, edit, or delete anything.
export async function POST(req: NextRequest) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const rawContent = typeof body.content === "string" ? body.content : "";
  const keywordId = typeof body.keyword_id === "string" && body.keyword_id ? body.keyword_id : null;

  if (!title || title.length > 120) return NextResponse.json({ error: "title must be 1-120 characters" }, { status: 400 });
  if (!SLUG.test(slug) || slug.length > 100) {
    return NextResponse.json({ error: "slug must be lowercase kebab-case, max 100 characters" }, { status: 400 });
  }
  if (!excerpt || excerpt.length > 300) return NextResponse.json({ error: "excerpt must be 1-300 characters" }, { status: 400 });
  if (!(BLOG_CATEGORIES as readonly string[]).includes(category)) {
    return NextResponse.json({ error: `category must be one of: ${BLOG_CATEGORIES.join(", ")}` }, { status: 400 });
  }
  if (!rawContent || rawContent.length > 60_000) {
    return NextResponse.json({ error: "content must be 1-60000 characters of HTML" }, { status: 400 });
  }

  const content = sanitizePostHtml(rawContent);
  const supabase = getSupabaseAdmin();

  const { count } = await supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .is("published_at", null);
  if ((count ?? 0) >= MAX_PENDING_DRAFTS) {
    return NextResponse.json(
      { error: `${MAX_PENDING_DRAFTS}+ drafts are already waiting for review — not adding more` },
      { status: 409 }
    );
  }

  const { data: draft, error } = await supabase
    .from("blog_posts")
    .insert({ title, slug, excerpt, content, category, published_at: null })
    .select("id")
    .single();

  if (error) {
    const message = error.code === "23505" ? "A post with that slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status: error.code === "23505" ? 409 : 500 });
  }

  const reviewUrl = draftReviewUrl(draft.id);

  // Tie the draft to the keyword it targets: in_review now, done when the
  // draft is published (see /api/admin/blog-drafts/[id]).
  let keyword: string | null = null;
  if (keywordId) {
    const { data } = await supabase
      .from("target_keywords")
      .update({ status: "in_review", content_url: reviewUrl })
      .eq("id", keywordId)
      .eq("status", "queued")
      .select("keyword");
    keyword = data?.[0]?.keyword ?? null;
  }

  after(() => notifyContentReview({ keyword: keyword ?? title, reviewUrl, kind: "blog" }));

  return NextResponse.json({ ok: true, id: draft.id, review_url: reviewUrl });
}
