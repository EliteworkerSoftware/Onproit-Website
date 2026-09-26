import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { revisionsByTarget } from "@/lib/content-revisions";

// Unpublished blog posts (published_at is null) — drafts waiting for review.
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, category, created_at")
    .is("published_at", null)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const revisions = await revisionsByTarget(supabase, "blog").catch(() => ({}) as Record<string, never[]>);
  return NextResponse.json({ drafts: data.map((d) => ({ ...d, revisions: revisions[d.id] ?? [] })) });
}
