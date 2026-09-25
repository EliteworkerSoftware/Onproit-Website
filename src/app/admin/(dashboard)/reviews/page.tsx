"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BellRing, CheckCircle2, ExternalLink, Mail, Send, Star, Trash2 } from "lucide-react";

interface ReviewRequest {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  note: string | null;
  sent_by: string | null;
  reminder_sent_at: string | null;
  clicked_at: string | null;
}

// Offer a follow-up once a request has sat unopened this long.
const REMINDER_AFTER_DAYS = 5;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const inputClasses =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export default function AdminReviewsPage() {
  const [requests, setRequests] = useState<ReviewRequest[] | null>(null);
  const [reviewLink, setReviewLink] = useState("");
  const [savedLink, setSavedLink] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");

  const [linkStatus, setLinkStatus] = useState("");
  const [linkError, setLinkError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendNotice, setSendNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [senders, setSenders] = useState<{ id: string; name: string }[]>([]);
  const [senderId, setSenderId] = useState("");

  async function fetchData() {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load");
    return data as {
      reviewLink: string | null;
      requests: ReviewRequest[];
      senders: { id: string; name: string }[];
      currentUserId: string;
    };
  }

  async function load() {
    try {
      const data = await fetchData();
      setRequests(data.requests);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load");
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetchData()
      .then((data) => {
        if (cancelled) return;
        setRequests(data.requests);
        setSenders(data.senders);
        setSenderId(data.currentUserId);
        setSavedLink(data.reviewLink);
        setReviewLink(data.reviewLink ?? "");
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveLink(e: FormEvent) {
    e.preventDefault();
    setLinkError("");
    setLinkStatus("");
    const res = await fetch("/api/admin/reviews/link", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: reviewLink }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLinkError(data.error || "Failed to save");
      return;
    }
    setSavedLink(data.link);
    setLinkStatus("Saved.");
  }

  async function send(e: FormEvent, force = false) {
    e.preventDefault();
    setSending(true);
    setSendError("");
    setSendNotice("");
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, note, force, senderId }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);

    if (res.status === 409 && data.duplicate) {
      if (confirm(data.error)) return send(e, true);
      return;
    }
    if (!res.ok) {
      setSendError(data.error || "Failed to send");
      return;
    }
    setSendNotice(`Review request sent to ${name}.`);
    setName("");
    setEmail("");
    setNote("");
    load();
  }

  async function remind(r: ReviewRequest) {
    if (!confirm(`Send ${r.customer_name} one friendly follow-up?`)) return;
    setBusyId(r.id);
    const res = await fetch(`/api/admin/reviews/${r.id}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) alert(data.error || "Failed to send reminder");
    load();
  }

  async function remove(r: ReviewRequest) {
    if (!confirm(`Remove the request to ${r.customer_name} from this list?`)) return;
    setBusyId(r.id);
    await fetch(`/api/admin/reviews/${r.id}`, { method: "DELETE" });
    setBusyId(null);
    load();
  }

  const stats = useMemo(() => {
    const list = requests ?? [];
    const clicked = list.filter((r) => r.clicked_at).length;
    return {
      sent: list.length,
      clicked,
      rate: list.length ? Math.round((clicked / list.length) * 100) : 0,
    };
  }, [requests]);

  function reminderDue(r: ReviewRequest) {
    if (r.clicked_at || r.reminder_sent_at) return false;
    return Date.now() - new Date(r.created_at).getTime() > REMINDER_AFTER_DAYS * 86_400_000;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Google Reviews</h1>
      <p className="mt-1 text-sm text-gray-500">
        Ask customers for a Google review in a couple of clicks. More reviews help you show up in Google Maps and local
        search — and win the call once they find you.
      </p>

      {loadError && <p className="mt-4 text-sm text-red-600">{loadError}</p>}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={(e) => send(e)} className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-brand" />
            <h2 className="text-lg font-semibold text-gray-900">Send a review request</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            They get a short, personal email from you with one button that opens your Google review page.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Send as</label>
              <select value={senderId} onChange={(e) => setSenderId(e.target.value)} className={inputClasses}>
                {senders.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                The email is signed with their first name, and customer replies go to their inbox.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Customer name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Customer email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClasses}
                placeholder="jane@company.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Personal note <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="e.g. It was great getting your new office network up and running last week."
              />
              <p className="mt-1 text-xs text-gray-400">Shown at the top of the email. A specific line gets more reviews.</p>
            </div>
          </div>

          {sendError && <p className="mt-3 text-sm text-red-600">{sendError}</p>}
          {sendNotice && <p className="mt-3 text-sm text-green-600">{sendNotice}</p>}

          <button
            type="submit"
            disabled={sending || !savedLink}
            className="mt-4 flex items-center gap-2 rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            {sending ? "Sending…" : "Send review request"}
          </button>
          {!savedLink && <p className="mt-2 text-xs text-amber-600">Save your Google review link first (right).</p>}
        </form>

        <div className="space-y-6">
          <form onSubmit={saveLink} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Your Google review link</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Where the email&apos;s button sends customers. To get it: search <strong>ONPRO IT</strong> on Google while
              signed in to your Business Profile account → <strong>Ask for reviews</strong> (or &ldquo;Get more
              reviews&rdquo;) → copy the link.
            </p>
            <input
              value={reviewLink}
              onChange={(e) => setReviewLink(e.target.value)}
              className={inputClasses}
              placeholder="https://g.page/r/…/review"
            />
            {linkError && <p className="mt-2 text-sm text-red-600">{linkError}</p>}
            <div className="mt-3 flex items-center gap-3">
              <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                Save link
              </button>
              {savedLink && (
                <a
                  href={savedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-brand hover:underline"
                >
                  Test it <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {linkStatus && <span className="text-sm text-green-600">{linkStatus}</span>}
            </div>
          </form>

          <div className="grid grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
              <p className="text-xs text-gray-500">Requests sent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.clicked}</p>
              <p className="text-xs text-gray-500">Opened review page</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.rate}%</p>
              <p className="text-xs text-gray-500">Response rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Sent requests</h2>
        <p className="mt-1 text-sm text-gray-500">
          &ldquo;Opened&rdquo; means they clicked through to your Google review page. Google doesn&apos;t say whether
          they finished writing it, so check your Business Profile for new reviews.
        </p>

        {!requests ? (
          <p className="mt-4 text-sm text-gray-500">{loadError ? "" : "Loading…"}</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No requests sent yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-900">{r.customer_name}</span>
                    <span className="text-gray-500">{r.customer_email}</span>
                    {r.clicked_at ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 uppercase">
                        <CheckCircle2 className="h-3 w-3" /> Opened {formatDate(r.clicked_at)}
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">
                        Not opened yet
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Sent {formatDate(r.created_at)}
                    {r.sent_by && ` by ${r.sent_by}`}
                    {r.reminder_sent_at && ` · reminder sent ${formatDate(r.reminder_sent_at)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {reminderDue(r) && (
                    <button
                      onClick={() => remind(r)}
                      disabled={busyId === r.id}
                      className="flex items-center gap-1 text-xs font-medium text-brand hover:underline disabled:opacity-50"
                    >
                      <BellRing className="h-3.5 w-3.5" /> Send reminder
                    </button>
                  )}
                  <button
                    onClick={() => remove(r)}
                    disabled={busyId === r.id}
                    className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
