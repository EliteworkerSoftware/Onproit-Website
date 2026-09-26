import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { gh, isContentAgentPr, isGitHubConfigured, type PullRequest } from "@/lib/github";
import type { Revision } from "@/lib/content-revisions";

// A request marked in_progress this long ago without finishing is treated as
// abandoned (the run died) and handed out again.
const STALE_AFTER_MINUTES = 60;

// For the content-revision agent: every change request waiting to be worked,
// with what it needs to act — the feedback, the PR's branch and description
// (website changes) or the draft's current text (blog), and any earlier
// requests on the same item for context.
export async function GET(req: NextRequest) {
  const secret = process.env.CONTENT_AGENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ revisions: [] });

  const supabase = getSupabaseAdmin();
  const stale = new Date(Date.now() - STALE_AFTER_MINUTES * 60_000).toISOString();
  const { data, error } = await supabase
    .from("content_revisions")
    .select("*")
    .or(`status.eq.pending,and(status.eq.in_progress,created_at.lt.${stale})`)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const revisions = [];
  for (const r of (data ?? []) as Revision[]) {
    const { data: history } = await supabase
      .from("content_revisions")
      .select("created_at, feedback, result_note, status")
      .eq("kind", r.kind)
      .eq("target", r.target)
      .neq("id", r.id)
      .order("created_at", { ascending: true });

    if (r.kind === "pr") {
      if (!isGitHubConfigured()) continue;
      const pr = await gh<PullRequest & { state: string }>(`/pulls/${r.target}`).catch(() => null);
      if (!pr || !isContentAgentPr(pr) || pr.state !== "open") {
        await supabase
          .from("content_revisions")
          .update({ status: "failed", result_note: "The pull request is no longer open", completed_at: new Date().toISOString() })
          .eq("id", r.id);
        continue;
      }
      revisions.push({
        id: r.id,
        kind: r.kind,
        feedback: r.feedback,
        requested_by: r.requested_by,
        requested_at: r.created_at,
        pr: { number: pr.number, branch: pr.head.ref, title: pr.title, description: pr.body, url: pr.html_url },
        earlier_requests: history ?? [],
      });
    } else {
      const { data: draft } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, content")
        .eq("id", r.target)
        .is("published_at", null)
        .maybeSingle();
      if (!draft) {
        await supabase
          .from("content_revisions")
          .update({ status: "failed", result_note: "The draft was published or deleted", completed_at: new Date().toISOString() })
          .eq("id", r.id);
        continue;
      }
      revisions.push({
        id: r.id,
        kind: r.kind,
        feedback: r.feedback,
        requested_by: r.requested_by,
        requested_at: r.created_at,
        draft,
        earlier_requests: history ?? [],
      });
    }
  }

  return NextResponse.json({ revisions });
}
