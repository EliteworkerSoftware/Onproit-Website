"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { RESEARCH_SERVICES } from "@/lib/research-seeds";
import { groupServiceArea } from "@/lib/service-area-display";
import InfoTip from "@/components/admin/InfoTip";

interface Idea {
  keyword: string;
  searchVolume: number;
  competition: string | null;
  region: string;
  opportunity: number;
}

const MAX_SEEDS = 20;

// On-demand DataForSEO keyword research: service + towns (or custom phrases)
// → real related searches with monthly volume in the Philadelphia market →
// tick the ones worth tracking. Each search is one paid request (~$0.09),
// budget-capped and listed in DataForSEO activity.
export default function FindKeywordsPanel({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [places, setPlaces] = useState<{ region: string; places: { name: string; term: string }[] }[]>([]);
  const [service, setService] = useState(RESEARCH_SERVICES[0].phrase);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Idea[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!open || places.length > 0) return;
    let cancelled = false;
    fetch("/api/admin/service-area")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.inArea)) setPlaces(groupServiceArea(data.inArea));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, places.length]);

  // "<service phrase>" + "<service phrase> <town>" for each picked town,
  // plus any custom phrases typed in — capped at DataForSEO's 20 per request.
  const seeds = useMemo(() => {
    const list = [service, ...[...picked].map((name) => `${service} ${name.toLowerCase().replace(/,/g, "")}`)];
    for (const line of custom.split(/[\n,]/)) if (line.trim()) list.push(line.trim().toLowerCase());
    return [...new Set(list)].slice(0, MAX_SEEDS);
  }, [service, picked, custom]);

  function togglePlace(name: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else if (next.size < MAX_SEEDS - 1) next.add(name);
      return next;
    });
  }

  async function search() {
    setSearching(true);
    setError("");
    setNotice("");
    setResults(null);
    const res = await fetch("/api/admin/keyword-research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seeds }),
    });
    const data = await res.json().catch(() => ({}));
    setSearching(false);
    if (!res.ok) {
      setError(data.error || "Search failed");
      return;
    }
    setResults(data.results);
    // Pre-tick the strongest: estimated High/Medium with real demand.
    setSelected(new Set((data.results as Idea[]).filter((r) => r.opportunity >= 25).map((r) => r.keyword)));
  }

  function toggleSelected(keyword: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) next.delete(keyword);
      else next.add(keyword);
      return next;
    });
  }

  async function addSelected() {
    if (!results) return;
    setAdding(true);
    const chosen = results.filter((r) => selected.has(r.keyword)).map((r) => ({ keyword: r.keyword, searchVolume: r.searchVolume }));
    const res = await fetch("/api/admin/keywords/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: chosen }),
    });
    const data = await res.json().catch(() => ({}));
    setAdding(false);
    if (!res.ok) {
      setError(data.error || "Failed to add");
      return;
    }
    setNotice(`Added ${data.added} keyword${data.added === 1 ? "" : "s"} to Target Keywords — queue the ones to chase.`);
    setResults((prev) => (prev ? prev.filter((r) => !selected.has(r.keyword)) : prev));
    setSelected(new Set());
    onAdded();
  }

  if (!open) {
    return (
<InfoTip text={"Look up real Google searches related to a service and your towns, with how many people search each one per month around Philadelphia. Use it to find keywords your site isn't showing for yet. Each search costs about $0.09 of the monthly DataForSEO budget."}>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
        <Sparkles className="h-3.5 w-3.5" /> Find new keywords (DataForSEO)
      </button>
</InfoTip>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-brand/30 bg-brand/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Find new keywords with DataForSEO</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Real Google searches in the Philadelphia market with their monthly volume. One search ≈ $0.09 of the monthly
            budget and is listed in DataForSEO activity.
          </p>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <label className="text-xs font-medium text-gray-600">
          Service {<InfoTip text={"The ONPRO IT service to research. Its phrase (e.g. “managed it services”) is combined with each town you pick below."} />}
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
          >
            {RESEARCH_SERVICES.map((s) => (
              <option key={s.slug} value={s.phrase}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-gray-600 lg:col-span-2">
          Extra starting phrases <span className="font-normal text-gray-400">(optional, one per line)</span>{" "}
          <InfoTip text={"Your own ideas to research, like a niche or a way customers phrase things. DataForSEO returns related searches for these too."} />
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            rows={2}
            placeholder="e.g. it support for restaurants nj"
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <p className="mt-3 text-xs font-medium text-gray-600">
        Towns <span className="font-normal text-gray-400">({picked.size} picked — each becomes &ldquo;{service} &lt;town&gt;&rdquo;)</span>{" "}
        <InfoTip text={"Click towns from your Service Area to include them. Each picked town becomes a starting phrase, e.g. “managed it services cherry hill”. One search covers up to 20 phrases."} />
      </p>
      <div className="mt-1 max-h-40 space-y-2 overflow-y-auto rounded-md bg-white p-2">
        {places.length === 0 ? (
          <p className="text-xs text-gray-400">Loading your service area…</p>
        ) : (
          places.map((group) => (
            <div key={group.region} className="flex flex-wrap items-center gap-1.5">
              <span className="w-full text-[10px] font-semibold tracking-wide text-gray-400 uppercase">{group.region}</span>
              {group.places.map((p) => (
                <button
                  key={p.term}
                  onClick={() => togglePlace(p.name)}
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    picked.has(p.name) ? "border-brand bg-brand text-white" : "border-gray-200 text-gray-600 hover:border-brand"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
<InfoTip text={"Runs one DataForSEO search (about $0.09) and lists the real searches that came back. Nothing is added until you tick results and click Add. Limited to 5 searches a day."}>
        <button
          onClick={search}
          disabled={searching || seeds.length === 0}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {searching ? "Searching…" : `Search ${seeds.length} phrase${seeds.length === 1 ? "" : "s"} (~$0.09)`}
        </button>
</InfoTip>
        {error && <span className="text-sm text-red-600">{error}</span>}
        {notice && <span className="text-sm text-green-700">{notice}</span>}
      </div>

      {results && (
        <div className="mt-4">
          {results.length === 0 ? (
            <p className="text-sm text-gray-500">No new searches with real volume came back — try other towns or phrases.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-gray-500">
                  {results.length} new searches · ticked = estimated opportunity 25+{" "}
                  <InfoTip text={"Only searches you're not already tracking are shown. The ones worth chasing (estimated Opportunity 25+, i.e. Medium or High) are ticked for you. Change the ticks, then click Add."} />{" "}
                  ·{" "}
                  <button onClick={() => setSelected(new Set(results.map((r) => r.keyword)))} className="text-brand hover:underline">
                    select all
                  </button>{" "}
                  ·{" "}
                  <button onClick={() => setSelected(new Set())} className="text-brand hover:underline">
                    clear
                  </button>
                </p>
<InfoTip text={"Adds the ticked searches to Target Keywords (labeled “from DataForSEO research”), where you can queue them for content."}>
                <button
                  onClick={addSelected}
                  disabled={adding || selected.size === 0}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {adding ? "Adding…" : `Add ${selected.size} to Target Keywords`}
                </button>
</InfoTip>
              </div>
              <div className="mt-2 max-h-80 overflow-y-auto rounded-md bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-200 text-xs text-gray-400">
                      <th className="w-8 py-1.5 pl-2" />
                      <th className="py-1.5">Search</th>
                      <th className="py-1.5 text-right">
                        <span className="inline-flex items-center gap-1">
                          Searches / mo {<InfoTip text={"About how many times a month people around Philadelphia and South Jersey search exactly this, from Google's data."} />}
                        </span>
                      </th>
                      <th className="py-1.5 pr-2 text-right">
                        <span className="inline-flex items-center gap-1">
                          Opportunity (est.) {<InfoTip text={"The score it would get as a Target Keyword (0–100), based on demand and whether it names your area. It's an estimate because your site isn't ranking for it yet."} />}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.keyword} className="border-b border-gray-100">
                        <td className="py-1.5 pl-2">
                          <input type="checkbox" checked={selected.has(r.keyword)} onChange={() => toggleSelected(r.keyword)} />
                        </td>
                        <td className="py-1.5 text-gray-800">
                          {r.keyword}
                          {r.region === "in_area" && (
                            <InfoTip text="This search mentions a town or county in your Service Area, so it scores higher.">
                              <span className="ml-2 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                                names your area
                              </span>
                            </InfoTip>
                          )}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">{r.searchVolume.toLocaleString()}</td>
                        <td className="py-1.5 pr-2 text-right font-medium text-gray-900">{r.opportunity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
