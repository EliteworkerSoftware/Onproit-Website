"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Mail, RotateCw, Send, Star, Trash2 } from "lucide-react";
import InfoTip from "@/components/admin/InfoTip";

interface ReviewRequest {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  note: string | null;
  sent_by: string | null;
  reminder_sent_at: string | null;
  clicked_at: string | null;
  reviewed_at: string | null;
}

// After this many days a resend goes out as the follow-up wording (matches
// FOLLOW_UP_AFTER_DAYS in the resend API route).
const FOLLOW_UP_AFTER_DAYS = 3;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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
  const [listNotice, setListNotice] = useState<{ ok: boolean; text: string } | null>(null);
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

  async function resend(r: ReviewRequest) {
    const followUp = isFollowUp(r);
    const what = followUp ? "a friendly follow-up" : "the review request again";
    // Google doesn't tell us who actually posted — an open is the best hint
    // they may already have, so double-check before nagging them.
    const question = r.clicked_at
      ? `${r.customer_name} opened your review page on ${formatDate(r.clicked_at)} — they may have already left a review. Send ${what} anyway?`
      : `Send ${r.customer_name} ${what}?`;
    if (!confirm(question)) return;
    setBusyId(r.id);
    setListNotice(null);
    const res = await fetch(`/api/admin/reviews/${r.id}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    setListNotice(
      res.ok
        ? {
            ok: true,
            text: `Resent to ${r.customer_name} (${r.customer_email})${data.kind === "follow-up" ? " as a follow-up" : ""}.`,
          }
        : { ok: false, text: data.error || "The resend failed — try again." }
    );
    load();
  }

  async function setReviewed(r: ReviewRequest, reviewed: boolean) {
    setBusyId(r.id);
    const res = await fetch(`/api/admin/reviews/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewed }),
    });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) setListNotice({ ok: false, text: data.error || "Failed to update" });
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
      reviewed: list.filter((r) => r.reviewed_at).length,
      rate: list.length ? Math.round((clicked / list.length) * 100) : 0,
    };
  }, [requests]);

  // Matches the server: after this many days a resend goes out as the
  // follow-up wording instead of repeating the original.
  function isFollowUp(r: ReviewRequest) {
    return Date.now() - new Date(r.created_at).getTime() > FOLLOW_UP_AFTER_DAYS * 86_400_000;
  }

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        Google Reviews
        <InfoTip text={"Email customers a request to review ONPRO IT on Google, and track who opened it. More (and more recent) Google reviews help you rank in Google Maps and the local “3-pack”, and help win the call once people find you."} />
      </h1>
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
            <InfoTip text={"Fill this in and click Send. The customer gets a short, branded email from the person you pick, with one button that opens your Google review page. It's saved in Sent requests below so you can see if they opened it."} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            They get a short, personal email from you with one button that opens your Google review page.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Send as {<InfoTip text={"Who the email comes from. It's signed with this person's first name (e.g. “Chris at ONPRO IT”), and if the customer hits Reply, it goes to that person's email. Any admin user can be picked."} />}
              </label>
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
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Customer name {<InfoTip text={"Used in the greeting (“Hi Jane,”). Their first name is enough, but the full name helps you find them in the list later."} />}
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Customer email {<InfoTip text={"Where the request is sent. You'll get a warning if you've already sent a request to this email."} />}
              </label>
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
                Personal note <span className="font-normal text-gray-400">(optional)</span>{" "}
                <InfoTip text={"A sentence about the job you did for them, shown at the top of the email. Mentioning the specific work makes people much more likely to leave a review."} />
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

<InfoTip text={"Emails the review request now and adds it to Sent requests. Turned off until your Google review link is saved."}>
          <button
            type="submit"
            disabled={sending || !savedLink}
            className="mt-4 flex items-center gap-2 rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            {sending ? "Sending…" : "Send review request"}
          </button>
</InfoTip>
          {!savedLink && <p className="mt-2 text-xs text-amber-600">Save your Google review link first (right).</p>}
        </form>

        <div className="space-y-6">
          <form onSubmit={saveLink} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Your Google review link</h2>
            <InfoTip text={"The web address of your Google Business Profile's “write a review” box. Every request email's button opens this link. You only set it once. Click Test it to make sure it opens the review box for ONPRO IT."} />
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
<InfoTip text={"Saves this link so every review request email uses it."}>
              <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                Save link
              </button>
</InfoTip>
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

          <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
              <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
                Requests sent <InfoTip text={"How many review requests are in the list below: everyone you've asked. Resends to the same person don't count twice."} />
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.clicked}</p>
              <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
                Opened review page <InfoTip text={"How many of those customers clicked the button in the email and reached your Google review page. It doesn't mean they finished a review."} />
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.reviewed}</p>
              <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
                Reviews confirmed <InfoTip text={"How many you've marked as reviewed after seeing their review on your Google Business Profile. Google doesn't tell us who reviewed, so this only counts what you've marked."} />
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.rate}%</p>
              <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
                Response rate <InfoTip text={"The share of requests where the customer opened the review page (Opened ÷ Requests sent)."} />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          Sent requests
          <InfoTip text={"Every review request sent, newest first, with its status. Hover a status badge or button to see what it means."} />
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          &ldquo;Opened&rdquo; means they clicked through to your Google review page. Google doesn&apos;t say who
          actually posted a review, so when you see theirs on your Business Profile, click{" "}
          <strong>Mark as reviewed</strong> — that stops any more resends to them.
        </p>

        {listNotice && (
          <p
            className={`mt-4 rounded-lg border p-3 text-sm ${
              listNotice.ok ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {listNotice.text}
          </p>
        )}

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
                    {r.reviewed_at ? (
                      <InfoTip text="You confirmed this customer left a Google review (on the date shown). Resending is turned off for them.">
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 uppercase">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" /> Reviewed {formatDate(r.reviewed_at)}
                      </span>
                      </InfoTip>
                    ) : r.clicked_at ? (
                      <InfoTip text="They clicked the button in the email and reached your Google review page (first time shown). Check your Business Profile to see if they posted, then click Mark as reviewed.">
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 uppercase">
                        <CheckCircle2 className="h-3 w-3" /> Opened {formatDate(r.clicked_at)}
                      </span>
                      </InfoTip>
                    ) : (
                      <InfoTip text="They haven't clicked the review button in the email yet. They may not have read it. Resending after a few days often helps.">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">
                        Not opened yet
                      </span>
                      </InfoTip>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">
                    <span title="When the first request was sent, and by which admin">Sent {formatDate(r.created_at)}</span>
                    {r.sent_by && ` by ${r.sent_by}`}
                    {r.reminder_sent_at && (
                      <span className="font-medium text-gray-500" title="The most recent time you clicked Resend">
                        {" "}
                        · Last resent {formatDate(r.reminder_sent_at)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {r.reviewed_at ? (
<InfoTip text={"Marked reviewed by mistake? This clears it and turns resending back on."}>
                    <button
                      onClick={() => setReviewed(r, false)}
                      disabled={busyId === r.id}
                      className="text-xs font-medium text-gray-500 hover:underline disabled:opacity-50"
                    >
                      Undo reviewed
                    </button>
</InfoTip>
                  ) : (
                    <>
<InfoTip text={"Email this customer again. Within the first 3 days it re-sends the same email; after that it sends a shorter, friendly follow-up. The time is recorded as “Last resent”."}>
                      <button
                        onClick={() => resend(r)}
                        disabled={busyId === r.id}
                        title={isFollowUp(r) ? "Sends the friendly follow-up version" : "Sends the same email again"}
                        className="flex items-center gap-1 text-xs font-medium text-brand hover:underline disabled:opacity-50"
                      >
                        <RotateCw className="h-3.5 w-3.5" /> Resend
                      </button>
</InfoTip>
<InfoTip text={"Click once you see their review on your Google Business Profile. It's counted in Reviews confirmed and stops any more resends to them."}>
                      <button
                        onClick={() => setReviewed(r, true)}
                        disabled={busyId === r.id}
                        className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:underline disabled:opacity-50"
                      >
                        <Star className="h-3.5 w-3.5" /> Mark as reviewed
                      </button>
</InfoTip>
                    </>
                  )}
<InfoTip text={"Take this request off the list, e.g. a typo'd email or a test. It doesn't unsend the email."}>
                  <button
                    onClick={() => remove(r)}
                    disabled={busyId === r.id}
                    className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
</InfoTip>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
