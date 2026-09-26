"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, RefreshCw, XCircle } from "lucide-react";
import InfoTip from "@/components/admin/InfoTip";

// What each connected service does, in plain English, keyed by check name.
const CHECK_HELP: Record<string, string> = {
  "Email sending (Mailgun)":
    "Sends every email from the site: new-lead notifications, your inquiry replies, review requests, and content-review alerts. If this is red, none of those go out.",
  "Contact form spam protection (Turnstile)":
    "Cloudflare's invisible check on the Contact form that blocks spam bots. If it's broken, real people may be unable to submit the form.",
  "Publish button for website changes (GitHub)":
    "Lets the Publish and Reject buttons on Content Review work, and shows the agent's pending page changes. The website's code lives on GitHub.",
  "Keyword search volumes (DataForSEO)":
    "The paid service that tells us how many people search each keyword per month in the Philadelphia area, and finds new keyword ideas. Capped at a small monthly budget.",
  "Google Search Console":
    "Google's free report of which searches showed your site, how often, and at what position. It feeds the keyword list and rankings on Analytics.",
  "Content agent access":
    "The password the content agent (and revision agent) use to read the keyword queue and report back. Without it they can't do anything.",
  "Scheduled jobs":
    "Lets the automatic daily jobs run (like the keyword sync from Search Console). Without it, nothing updates on its own.",
  "Instant indexing (IndexNow)":
    "Optional. Pings Bing and other search engines the moment a page changes, so they re-crawl it sooner. Google doesn't use IndexNow.",
  "Instant content revisions":
    "Optional. Starts the revision agent the moment you click Request changes. Without it, requests are still picked up by its scheduled check every 3 hours.",
};

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
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            System Status
            <InfoTip text={"A live test of every outside service the website depends on. Green = working. Red = broken, and the note says what's wrong. Gray = optional and not set up. Hover any line to see what that service does."} />
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Live check that each connected service&apos;s keys actually work. Changed a key in Vercel? Redeploy, then recheck.
          </p>
        </div>
        <InfoTip text={"Run every check again now, e.g. after changing a key in Vercel and redeploying."}>
        <button
          onClick={recheck}
          disabled={loading}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Recheck
        </button>
        </InfoTip>
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
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                  {c.name}
                  {CHECK_HELP[c.name] && <InfoTip text={CHECK_HELP[c.name]} />}
                </p>
                <p className={`text-xs ${c.ok || c.optional ? "text-gray-500" : "text-red-600"}`}>{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
