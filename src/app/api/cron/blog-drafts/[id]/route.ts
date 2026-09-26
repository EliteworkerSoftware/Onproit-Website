import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { sanitizePostHtml } from "@/lib/sanitize-post-html";
import { BLOG_CATEGORIES } from "@/lib/blog-drafts";

// Lets the revision agent rewrite a blog DRAFT in place after the admin asks
// for changes. Published posts can't be touched, and the HTML is sanitized
// exactly as on creation.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 120) {
      return NextResponse.json({ error: "title must be 1-120 characters" }, { status: 400 });
    }
    update.title = body.title.trim();
  }
  if (body.excerpt !== undefined) {
    if (typeof body.excerpt !== "string" || !body.excerpt.trim() || body.excerpt.length > 300) {
      return NextResponse.json({ error: "excerpt must be 1-300 characters" }, { status: 400 });
    }
    update.excerpt = body.excerpt.trim();
  }
  if (body.category !== undefined) {
    if (!(BLOG_CATEGORIES as readonly string[]).includes(body.category)) {
      return NextResponse.json({ error: `category must be one of: ${BLOG_CATEGORIES.join(", ")}` }, { status: 400 });
    }
    update.category = body.category;
  }
  if (body.content !== undefined) {
    if (typeof body.content !== "string" || !body.content.trim() || body.content.length > 60_000) {
      return NextResponse.json({ error: "content must be 1-60000 characters of HTML" }, { status: 400 });
    }
    update.content = sanitizePostHtml(body.content);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .update(update)
    .eq("id", id)
    .is("published_at", null)
    .select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: "Draft not found or already published" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
