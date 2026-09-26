import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { gh, isGitHubConfigured } from "@/lib/github";

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
}

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
    .select("*")
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(200);
  const grouped: Record<string, Revision[]> = {};
  for (const r of (data ?? []) as Revision[]) (grouped[r.target] ??= []).push(r);
  return grouped;
}
