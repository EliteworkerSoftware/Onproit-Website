"use client";

import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, Inbox, Mail, Trash2 } from "lucide-react";
import ReplyForm from "@/components/admin/ReplyForm";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string | null;
  status: "inbox" | "archived";
  created_at: string;
}

export default function AdminInquiriesPage() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [tab, setTab] = useState<"inbox" | "archived">("inbox");
  const [replyingTo, setReplyingTo] = useState<Submission | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load inquiries");
      setSubmissions(data.submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiries");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/inquiries");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load inquiries");
        if (!cancelled) setSubmissions(data.submissions);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load inquiries");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function setStatus(id: string, status: "inbox" | "archived") {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message? This can't be undone.")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = (submissions ?? []).filter((s) => s.status === tab);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
      <p className="mt-1 text-sm text-gray-500">Messages submitted through the contact form.</p>

      <div className="mt-6 inline-flex rounded-lg border border-gray-200 bg-white p-1">
        {(["inbox", "archived"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? "bg-brand text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t === "inbox" ? <Inbox className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            {t}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-4">
        {!submissions ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">
              {tab === "inbox" ? "Inbox is empty" : "No archived messages"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {tab === "inbox" ? "No new messages in the database." : "Archived messages will appear here."}
            </p>
          </div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Mail className="h-3.5 w-3.5" />
                    {s.email}
                  </p>
                  {(s.company || s.phone || s.service) && (
                    <p className="mt-0.5 text-xs text-gray-400">
                      {[s.company, s.phone, s.service].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(s.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {s.message && (
                <p className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                  {s.message}
                </p>
              )}
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => setReplyingTo(s)}
                  className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply
                </button>
                {tab === "inbox" ? (
                  <button
                    onClick={() => setStatus(s.id, "archived")}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus(s.id, "inbox")}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ArchiveRestore className="h-3.5 w-3.5" />
                    Restore
                  </button>
                )}
                <button
                  onClick={() => remove(s.id)}
                  className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {replyingTo && (
        <ReplyForm
          submission={replyingTo}
          onClose={() => setReplyingTo(null)}
          onSent={() => setReplyingTo(null)}
        />
      )}
    </div>
  );
}
