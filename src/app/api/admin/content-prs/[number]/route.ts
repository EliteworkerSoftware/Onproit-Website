import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { gh, isContentAgentPr, isGitHubConfigured, pathForKeyword, type PullRequest } from "@/lib/github";
import { SITE_URL } from "@/lib/constants";

async function loadPr(number: string) {
  if (!/^\d+$/.test(number)) throw new Error("Invalid PR number");
  const pr = await gh<PullRequest>(`/pulls/${number}`);
  if (!isContentAgentPr(pr)) throw new Error("Only content agent pull requests can be managed here");
  return pr;
}

// Publish: merge the PR into main. Vercel deploys main automatically, so the
// changes are live a couple of minutes later. The PR's keywords are marked
// done with the live URL of the page written for each.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isGitHubConfigured()) return NextResponse.json({ error: "GitHub is not connected" }, { status: 503 });

  const { number } = await params;
  let pr: PullRequest;
  try {
    pr = await loadPr(number);
    await gh(`/pulls/${number}/merge`, {
      method: "PUT",
      body: JSON.stringify({ merge_method: "squash", sha: pr.head.sha }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Merge failed";
    const friendly = message.includes("405") || message.includes("409")
      ? "GitHub couldn't merge this automatically (it conflicts with a newer change). Reject it and the agent will redo it next run."
      : message;
    return NextResponse.json({ error: friendly }, { status: 409 });
  }

  // Tidy up the merged branch; not worth failing the publish over.
  await gh(`/git/refs/heads/${pr.head.ref}`, { method: "DELETE" }).catch(() => {});

  const supabase = getSupabaseAdmin();
  const { data: keywords } = await supabase
    .from("target_keywords")
    .select("id, keyword")
    .eq("content_url", pr.html_url)
    .eq("status", "in_review");

  const now = new Date().toISOString();
  for (const k of keywords ?? []) {
    const path = pathForKeyword(pr.body, k.keyword);
    await supabase
      .from("target_keywords")
      .update({ status: "done", content_url: path ? `${SITE_URL}${path}` : pr.html_url, content_published_at: now })
      .eq("id", k.id);
  }

  return NextResponse.json({ ok: true, keywordsCompleted: keywords?.length ?? 0 });
}

// Reject: close the PR without merging. Its keywords go back into the queue
// so the agent takes a fresh pass on the next run.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isGitHubConfigured()) return NextResponse.json({ error: "GitHub is not connected" }, { status: 503 });

  const { number } = await params;
  let pr: PullRequest;
  try {
    pr = await loadPr(number);
    await gh(`/pulls/${number}`, { method: "PATCH", body: JSON.stringify({ state: "closed" }) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Close failed" }, { status: 502 });
  }

  await gh(`/git/refs/heads/${pr.head.ref}`, { method: "DELETE" }).catch(() => {});

  await getSupabaseAdmin()
    .from("target_keywords")
    .update({ status: "queued", content_url: null, queued_at: new Date().toISOString() })
    .eq("content_url", pr.html_url)
    .eq("status", "in_review");

  return NextResponse.json({ ok: true });
}
