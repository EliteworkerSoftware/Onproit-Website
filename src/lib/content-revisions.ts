import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { gh, isGitHubConfigured, type PullRequest } from "@/lib/github";
import { htmlBlocks, linesFromBlocks, linesFromPatch, type DiffGroup } from "@/lib/text-diff";

export type RevisionKind = "pr" | "blog";

export interface Revision {
  id: string;
  created_at: string;
  kind: RevisionKind;
  target: string;
  feedback: string;
  requested_by: string | null;
  status: "pending" | "in_progress" | "done" | "failed";
  result_note: string | null;
  completed_at: string | null;
  before_snapshot?: Snapshot | null;
  after_snapshot?: Snapshot | null;
}

// What an item looked like at a point in time: a pull request's head commit,
// or a blog draft's text.
export type Snapshot = { sha: string } | { title: string; excerpt: string | null; content: string };

export const MAX_FEEDBACK_LENGTH = 4000;

// Starts the content-revision routine right away (REVISION_WEBHOOK_URL is the
// routine's trigger URL, REVISION_WEBHOOK_TOKEN its bearer token). Without it
// the request still waits in the table and the daily run picks it up.
async function startRevisionAgent(revisionId: string): Promise<boolean> {
  const url = process.env.REVISION_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Required by Claude routine API triggers; harmless for other webhooks.
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "experimental-cc-routine-2026-04-01",
        ...(process.env.REVISION_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.REVISION_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ text: `Content revision requested (id ${revisionId}). Process all pending revisions.` }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function requestRevision(
  supabase: SupabaseClient,
  params: { kind: RevisionKind; target: string; feedback: string; requestedBy: string }
): Promise<{ revision: Revision; started: boolean }> {
  const { data, error } = await supabase
    .from("content_revisions")
    .insert({ kind: params.kind, target: params.target, feedback: params.feedback, requested_by: params.requestedBy })
    .select("*")
    .single();
  if (error) {
    throw new Error(
      error.message.includes("content_revisions") ? "Run supabase/migration-content-revisions.sql in Supabase first." : error.message
    );
  }

  // For website changes, also leave the request on the pull request itself,
  // so the PR's history shows what was asked.
  if (params.kind === "pr" && isGitHubConfigured()) {
    await gh(`/issues/${params.target}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: `**Changes requested by ${params.requestedBy}** (from Admin → Content Review):\n\n${params.feedback}` }),
    }).catch(() => {});
  }

  const started = await startRevisionAgent(data.id);
  return { revision: data as Revision, started };
}

// Latest revision requests per target, newest first, for the review cards.
export async function revisionsByTarget(supabase: SupabaseClient, kind: RevisionKind): Promise<Record<string, Revision[]>> {
  const { data } = await supabase
    .from("content_revisions")
    .select("id, created_at, kind, target, feedback, requested_by, status, result_note, completed_at")
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(200);
  const grouped: Record<string, Revision[]> = {};
  for (const r of (data ?? []) as Revision[]) (grouped[r.target] ??= []).push(r);
  return grouped;
}

export async function snapshotTarget(supabase: SupabaseClient, kind: RevisionKind, target: string): Promise<Snapshot | null> {
  if (kind === "pr") {
    if (!isGitHubConfigured()) return null;
    const pr = await gh<PullRequest>(`/pulls/${target}`);
    return { sha: pr.head.sha };
  }
  const { data } = await supabase.from("blog_posts").select("title, excerpt, content").eq("id", target).maybeSingle();
  return data ?? null;
}

// Friendly names for the files the content agent edits.
function fileLabel(path: string) {
  if (path.endsWith("services-data.ts")) return "Service pages";
  if (path.endsWith("locations-data.ts")) return "Location pages";
  if (path === "CONTENT-GUIDELINES.md") return "Content guidelines";
  return path.replace(/^src\//, "");
}

export function groupsFromFiles(files: { filename: string; patch?: string }[]): DiffGroup[] {
  return files
    .map((f) => ({ label: fileLabel(f.filename), lines: linesFromPatch(f.patch) }))
    .filter((g) => g.lines.length > 0);
}

type Commit = { sha: string; parents: { sha: string }[]; commit: { committer: { date: string } } };

// The before/after commits for a website-changes revision. Revisions from
// before snapshots existed fall back to the PR commits made while it ran.
async function prRange(revision: Revision): Promise<{ before: string; after: string } | null> {
  const before = revision.before_snapshot && "sha" in revision.before_snapshot ? revision.before_snapshot.sha : null;
  const after = revision.after_snapshot && "sha" in revision.after_snapshot ? revision.after_snapshot.sha : null;
  if (before && after) return before === after ? null : { before, after };
  if (!revision.completed_at) return null;

  const start = new Date(revision.created_at).getTime();
  const end = new Date(revision.completed_at).getTime() + 60_000;
  const commits = (await gh<Commit[]>(`/pulls/${revision.target}/commits?per_page=100`)).filter((c) => {
    const t = new Date(c.commit.committer.date).getTime();
    return t >= start && t <= end;
  });
  if (!commits.length || !commits[0].parents.length) return null;
  return { before: commits[0].parents[0].sha, after: commits[commits.length - 1].sha };
}

// What a finished revision actually changed, as readable removed/added lines.
// Null when there's nothing recorded to compare.
export async function revisionChanges(revision: Revision): Promise<DiffGroup[] | null> {
  if (revision.kind === "pr") {
    if (!isGitHubConfigured()) return null;
    const range = await prRange(revision);
    if (!range) return null;
    const compare = await gh<{ files?: { filename: string; patch?: string }[] }>(`/compare/${range.before}...${range.after}`);
    return groupsFromFiles(compare.files ?? []);
  }

  const before = revision.before_snapshot && "content" in revision.before_snapshot ? revision.before_snapshot : null;
  const after = revision.after_snapshot && "content" in revision.after_snapshot ? revision.after_snapshot : null;
  if (!before || !after) return null;
  const groups: DiffGroup[] = [
    { label: "Title", lines: linesFromBlocks([before.title], [after.title]) },
    { label: "Summary", lines: linesFromBlocks([before.excerpt ?? ""].filter(Boolean), [after.excerpt ?? ""].filter(Boolean)) },
    { label: "Post", lines: linesFromBlocks(htmlBlocks(before.content), htmlBlocks(after.content)) },
  ];
  return groups.filter((g) => g.lines.length > 0);
}
