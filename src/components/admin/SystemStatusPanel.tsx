"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, RefreshCw, XCircle } from "lucide-react";

interface Check {
  name: string;
  ok: boolean;
  detail: string;
  optional?: boolean;
}

export default function SystemStatusPanel() {
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchChecks() {
    const res = await fetch("/api/admin/system-status");
    const data = await res.json();
    return (data.checks ?? []) as Check[];
  }

  async function recheck() {
    setLoading(true);
    setChecks(await fetchChecks().catch(() => []));
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetchChecks()
      .catch(() => [] as Check[])
      .then((list) => {
        if (cancelled) return;
        setChecks(list);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          <p className="mt-1 text-sm text-gray-500">
            Live check that each connected service&apos;s keys actually work. Changed a key in Vercel? Redeploy, then recheck.
          </p>
        </div>
        <button
          onClick={recheck}
          disabled={loading}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Recheck
        </button>
      </div>

      {!checks ? (
        <p className="mt-4 text-sm text-gray-500">Checking…</p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-100">
          {checks.map((c) => (
            <li key={c.name} className="flex items-start gap-3 py-3">
              {c.ok ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              ) : c.optional ? (
                <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className={`text-xs ${c.ok || c.optional ? "text-gray-500" : "text-red-600"}`}>{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
