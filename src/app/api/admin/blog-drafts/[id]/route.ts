import { NextRequest, NextResponse, after } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { draftReviewUrl } from "@/lib/blog-drafts";
import { SITE_URL } from "@/lib/constants";
import { isIndexNowConfigured, submitUrlsToIndexNow } from "@/lib/indexnow";

// Publish a draft: it goes live on /blog (the blog pages revalidate hourly,
// and a brand-new slug renders on first request). Any keyword the draft was
// written for is closed out as done with the real post URL.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const now = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ published_at: now, updated_at: now })
    .eq("id", id)
    .is("published_at", null)
    .select("slug");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const slug = data?.[0]?.slug;
  if (!slug) return NextResponse.json({ error: "Draft not found or already published" }, { status: 404 });

  const postUrl = `${SITE_URL}/blog/${slug}`;
  await supabase
    .from("target_keywords")
    .update({ status: "done", content_url: postUrl, content_published_at: now })
    .eq("content_url", draftReviewUrl(id));

  if (isIndexNowConfigured()) {
    after(() => submitUrlsToIndexNow([postUrl, `${SITE_URL}/blog`]).catch(() => {}));
  }

  return NextResponse.json({ ok: true, url: postUrl });
}

// Delete a draft (never a published post). A keyword it was written for goes
// back to the queue so the agent can take another pass.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id).is("published_at", null);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase
    .from("target_keywords")
    .update({ status: "queued", content_url: null })
    .eq("content_url", draftReviewUrl(id));

  return NextResponse.json({ ok: true });
}
