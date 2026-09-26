"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import InfoTip from "@/components/admin/InfoTip";

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
        <InfoTip text={"The towns, counties, and states ONPRO IT works in. It drives your SEO: keywords that name a place here count as local and score higher, keywords naming places you don't serve are always Low priority, and the content agent only builds location pages for places you serve. The public Areas We Serve page lists these too."} />
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
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Places we serve {<InfoTip text={"One place per line (town, county, state, or zip). A keyword counts as local if it contains any of these anywhere, so “haddon” matches both Haddonfield and Haddon Heights. Keep entries specific enough not to match unrelated words."} />}
              </label>
              <textarea value={inArea} onChange={(e) => setInArea(e.target.value)} rows={14} className={textareaClasses} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Places we don&apos;t serve {<InfoTip text={"Places you've decided not to chase, one per line. Keywords that mention them are forced to Low priority and the content agent won't build pages for them."} />}
              </label>
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
            <InfoTip text={"Saves both lists and immediately re-checks every tracked keyword against them, so priorities and scores on the Analytics page update right away."}>
            <button
              onClick={save}
              disabled={status === "saving"}
              className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {status === "saving" ? "Saving…" : "Save Service Area"}
            </button>
            </InfoTip>
            {message && (
              <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>{message}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
