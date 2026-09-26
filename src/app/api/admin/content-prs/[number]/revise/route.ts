import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { gh, isContentAgentPr, isGitHubConfigured, type PullRequest } from "@/lib/github";
import { MAX_FEEDBACK_LENGTH, requestRevision } from "@/lib/content-revisions";

// "Request changes" on a batch of website changes: records the feedback and
// starts the revision agent, which updates this same pull request.
export async function POST(req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isGitHubConfigured()) return NextResponse.json({ error: "GitHub is not connected" }, { status: 503 });

  const { number } = await params;
  if (!/^\d+$/.test(number)) return NextResponse.json({ error: "Invalid PR number" }, { status: 400 });

  const { feedback } = await req.json().catch(() => ({}));
  const text = typeof feedback === "string" ? feedback.trim() : "";
  if (!text) return NextResponse.json({ error: "Say what needs to change" }, { status: 400 });
  if (text.length > MAX_FEEDBACK_LENGTH) return NextResponse.json({ error: "That's too long — keep it under 4,000 characters" }, { status: 400 });

  try {
    const pr = await gh<PullRequest>(`/pulls/${number}`);
    if (!isContentAgentPr(pr)) return NextResponse.json({ error: "Not a content agent pull request" }, { status: 400 });
    const { revision, started } = await requestRevision(getSupabaseAdmin(), {
      kind: "pr",
      target: number,
      feedback: text,
      requestedBy: admin.full_name || admin.email,
    });
    return NextResponse.json({ ok: true, revision, started });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Request failed" }, { status: 500 });
  }
}
