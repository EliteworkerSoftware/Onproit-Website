import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getPreviewUrl, gh, isContentAgentPr, isGitHubConfigured, pathsInBody, type PullRequest } from "@/lib/github";

// Open pull requests from the content agent, with what changed and a link to
// Vercel's live preview of the branch, for the Content Review page.
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isGitHubConfigured()) return NextResponse.json({ configured: false, prs: [] });

  try {
    const open = (await gh<PullRequest[]>("/pulls?state=open&per_page=30")).filter(isContentAgentPr);

    const prs = await Promise.all(
      open.map(async (pr) => {
        const [files, previewUrl] = await Promise.all([
          gh<{ filename: string; status: string; additions: number; deletions: number }[]>(
            `/pulls/${pr.number}/files?per_page=100`
          ),
          getPreviewUrl(pr.head.sha).catch(() => null),
        ]);
        return {
          number: pr.number,
          title: pr.title,
          body: pr.body,
          url: pr.html_url,
          created_at: pr.created_at,
          previewUrl,
          pages: pathsInBody(pr.body),
          files: files.map((f) => ({ name: f.filename, status: f.status, additions: f.additions, deletions: f.deletions })),
        };
      })
    );

    return NextResponse.json({ configured: true, prs });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "GitHub request failed" }, { status: 502 });
  }
}
