"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const textareaClasses =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export default function ServiceAreaCard() {
  const [inArea, setInArea] = useState<string | null>(null);
  const [outOfArea, setOutOfArea] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/service-area")
      .then((res) => res.json())
      .then((data) => {
        setInArea((data.inArea ?? []).join("\n"));
        setOutOfArea((data.outOfArea ?? []).join("\n"));
      });
  }, []);

  async function save() {
    if (inArea === null) return;
    setStatus("saving");
    setMessage("");
    const res = await fetch("/api/admin/service-area", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inArea, outOfArea }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error || "Failed to save");
      return;
    }
    setInArea(data.inArea.join("\n"));
    setOutOfArea(data.outOfArea.join("\n"));
    setStatus("saved");
    setMessage(
      data.reclassified
        ? `Saved — ${data.reclassified} tracked keyword${data.reclassified === 1 ? "" : "s"} re-tagged.`
        : "Saved — no tracked keywords changed."
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-brand" />
        <h2 className="text-lg font-semibold text-gray-900">Service Area</h2>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Controls which keywords count as local to you. The content agent only suggests and builds pages for places you
        serve, and keywords naming places you don&apos;t serve are always Low priority. One place per line &mdash; a
        keyword matches if it contains the text anywhere (so &ldquo;haddon&rdquo; covers Haddonfield and Haddon Heights).
      </p>

      {inArea === null ? (
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Places we serve</label>
              <textarea value={inArea} onChange={(e) => setInArea(e.target.value)} rows={14} className={textareaClasses} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Places we don&apos;t serve</label>
              <textarea
                value={outOfArea}
                onChange={(e) => setOutOfArea(e.target.value)}
                rows={14}
                className={textareaClasses}
              />
              <p className="mt-1 text-xs text-gray-400">
                If a keyword matches both lists, &ldquo;Places we serve&rdquo; wins (e.g. &ldquo;newark de&rdquo; vs.
                &ldquo;newark&rdquo;).
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={save}
              disabled={status === "saving"}
              className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {status === "saving" ? "Saving…" : "Save Service Area"}
            </button>
            {message && (
              <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>{message}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
