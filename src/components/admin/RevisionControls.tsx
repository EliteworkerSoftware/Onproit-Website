"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, MessageSquareWarning, XCircle } from "lucide-react";
import type { DiffGroup } from "@/lib/text-diff";
import ChangesView from "./ChangesView";
import InfoTip from "@/components/admin/InfoTip";

export interface RevisionItem {
  id: string;
  created_at: string;
  feedback: string;
  requested_by: string | null;
  status: "pending" | "in_progress" | "done" | "failed";
  result_note: string | null;
  completed_at: string | null;
}

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// "See what changed" under a finished revision: loads the before/after text.
function RevisionChanges({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<DiffGroup[] | null | undefined>(undefined);
  const [error, setError] = useState("");

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (!next || groups !== undefined) return;
    const res = await fetch(`/api/admin/content-revisions/${id}/changes`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setError(data.error || "Couldn't load the changes");
    else setGroups(data.changes);
  }

  return (
    <div className="mt-2">
      <button onClick={toggle} className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide what changed" : "See what changed"}
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : groups === undefined ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : groups === null ? (
            <p className="text-sm text-gray-500">The before and after weren&apos;t recorded for this revision.</p>
          ) : (
            <ChangesView groups={groups} />
          )}
        </div>
      )}
    </div>
  );
}

// "Request changes" for one item on the Content Review page (a batch of
// website changes or a blog draft), plus the history of what was asked and
// what the agent did about it.
export default function RevisionControls({
  endpoint,
  revisions,
  onChanged,
}: {
  endpoint: string;
  revisions: RevisionItem[];
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const working = revisions.some((r) => r.status === "pending" || r.status === "in_progress");

  async function submit() {
    setSending(true);
    setError("");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setError(data.error || "Failed to send");
      return;
    }
    setFeedback("");
    setOpen(false);
    onChanged();
  }

  return (
    <div className="mt-4">
      {revisions.length > 0 && (
        <ul className="mb-3 space-y-2">
          {[...revisions].reverse().map((r) => (
            <li key={r.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
              <p className="flex items-center gap-1 text-xs text-gray-400">
                <InfoTip text="A change you (or another admin) asked for, and what the agent did about it. Waiting = not started yet; spinning = the agent is working on it; green = done (see what changed below); red = it couldn't, and says why." />
                Changes requested {when(r.created_at)}
                {r.requested_by && ` by ${r.requested_by}`}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-gray-700">{r.feedback}</p>
              <p
                className={`mt-2 flex items-start gap-1.5 text-xs font-medium ${
                  r.status === "done" ? "text-green-700" : r.status === "failed" ? "text-red-600" : "text-amber-700"
                }`}
              >
                {r.status === "done" ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                ) : r.status === "failed" ? (
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" />
                )}
                <span>
                  {r.status === "pending" && "Waiting for the content agent to start…"}
                  {r.status === "in_progress" && "The content agent is revising this now…"}
                  {r.status === "done" && `Revised ${r.completed_at ? when(r.completed_at) : ""}${r.result_note ? ` — ${r.result_note}` : ""}`}
                  {r.status === "failed" && `Couldn't revise${r.result_note ? `: ${r.result_note}` : ""}`}
                </span>
              </p>
              {r.status === "done" && <RevisionChanges id={r.id} />}
            </li>
          ))}
        </ul>
      )}

      {!open ? (
        <InfoTip text={"Tell the content agent what's wrong, in your own words. It edits this same item (no new copy), usually within a few minutes, and shows you exactly what it changed. Corrections about ONPRO IT itself are saved so future content gets them right. Turned off while a revision is already running."}>
        <button
          onClick={() => setOpen(true)}
          disabled={working}
          className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
          title={working ? "A revision is already in progress" : undefined}
        >
          <MessageSquareWarning className="h-4 w-4" />
          Request changes
        </button>
        </InfoTip>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <label className="text-sm font-medium text-gray-800">What needs to change?</label>
          <p className="mt-0.5 text-xs text-gray-500">
            Be specific — what&apos;s wrong and what it should say. Corrections about ONPRO IT itself (services, coverage,
            how you work) are also saved so future content gets them right.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            autoFocus
            placeholder="e.g. We don't offer 24/7 on-site support — it's 24/7 remote monitoring with next-business-day on-site. Remove the mention of Camden County. The FAQ about pricing should say we quote per site."
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          <div className="mt-2 flex gap-2">
            <button
              onClick={submit}
              disabled={sending || !feedback.trim()}
              className="rounded-md bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send to the content agent"}
            </button>
            <button onClick={() => setOpen(false)} className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-white">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
