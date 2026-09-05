"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
}

export default function ReplyForm({
  submission,
  onClose,
  onSent,
}: {
  submission: Submission;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const res = await fetch(`/api/admin/inquiries/${submission.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to send reply");
      setStatus("error");
      return;
    }
    onSent();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Reply to {submission.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-500">Sending to {submission.email}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder="Write your reply..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
