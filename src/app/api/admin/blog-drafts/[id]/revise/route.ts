import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { MAX_FEEDBACK_LENGTH, requestRevision } from "@/lib/content-revisions";

// "Request changes" on a blog draft: records the feedback and starts the
// revision agent, which rewrites the draft in place.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { feedback } = await req.json().catch(() => ({}));
  const text = typeof feedback === "string" ? feedback.trim() : "";
  if (!text) return NextResponse.json({ error: "Say what needs to change" }, { status: 400 });
  if (text.length > MAX_FEEDBACK_LENGTH) return NextResponse.json({ error: "That's too long — keep it under 4,000 characters" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: draft } = await supabase.from("blog_posts").select("id").eq("id", id).is("published_at", null).maybeSingle();
  if (!draft) return NextResponse.json({ error: "Draft not found (it may already be published)" }, { status: 404 });

  try {
    const { revision, started } = await requestRevision(supabase, {
      kind: "blog",
      target: id,
      feedback: text,
      requestedBy: admin.full_name || admin.email,
    });
    return NextResponse.json({ ok: true, revision, started });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Request failed" }, { status: 500 });
  }
}
