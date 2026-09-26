"use client";

import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, Inbox, Mail, Trash2 } from "lucide-react";
import ReplyForm from "@/components/admin/ReplyForm";
import InfoTip from "@/components/admin/InfoTip";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  service: string | null;
  message: string | null;
  read: boolean;
  archived: boolean;
  created_at: string;
}

const FIELD_LABEL_CLASSES = "text-xs font-semibold uppercase tracking-wide text-gray-400";
const FIELD_VALUE_CLASSES = "mt-0.5 truncate text-sm font-medium text-gray-900";

export default function AdminInquiriesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [tab, setTab] = useState<"inbox" | "archived">("inbox");
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load inquiries");
      setMessages(data.messages);
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
        if (!cancelled) setMessages(data.messages);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load inquiries");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function setArchived(id: string, archived: boolean) {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived, read: true }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message? This can't be undone.")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = (messages ?? []).filter((m) => (tab === "archived" ? m.archived : !m.archived));

  // Every field is already fully visible in the card — there's no separate
  // "open" step — so viewing the inbox tab is what "viewing" a lead means.
  // Clear the New badge for whatever's currently on screen, a beat after
  // render so it doesn't disappear before the admin has actually seen it.
  useEffect(() => {
    if (tab !== "inbox") return;
    const unread = filtered.filter((m) => !m.read);
    if (unread.length === 0) return;

    const timer = setTimeout(() => {
      setMessages((prev) =>
        prev ? prev.map((m) => (unread.some((u) => u.id === m.id) ? { ...m, read: true } : m)) : prev
      );
      unread.forEach((m) => {
        fetch(`/api/admin/inquiries/${m.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        }).catch(() => {});
      });
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, messages]);

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        Inquiries
        <InfoTip text={"Every message sent through the Contact form on onproit.com. You're also emailed each one as it arrives. Inbox holds messages you haven't dealt with; Archive holds ones you've handled. Nothing here is deleted unless you click Delete."} />
      </h1>
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
            <InfoTip
              text={
                t === "inbox"
                  ? "Messages you haven't archived yet: new ones and ones you're still working on."
                  : "Messages you've archived because they're handled. They're kept here so you can look them up later, and Restore moves one back to the Inbox."
              }
            />
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-4">
        {!messages ? (
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
          filtered.map((m) => (
            <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                <p className="text-base font-semibold text-gray-900">
                  {m.name}
                  {!m.read && (
                    <InfoTip text="You haven't seen this message yet. The badge clears a moment after it's shown on your screen here.">
                      <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">New</span>
                    </InfoTip>
                  )}
                </p>
                <span className="text-xs text-gray-400" title="When the message was submitted">
                  {new Date(m.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                <div>
                  <dt className={`flex items-center gap-1 ${FIELD_LABEL_CLASSES}`}>
                    Email <InfoTip text={"The email address they typed into the form. Click it to write to them from your own email program, or use Reply below to send from the ONPRO IT inbox."} />
                  </dt>
                  <dd className={FIELD_VALUE_CLASSES}>
                    <a href={`mailto:${m.email}`} className="hover:text-brand">
                      {m.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={`flex items-center gap-1 ${FIELD_LABEL_CLASSES}`}>
                    Phone <InfoTip text={"The phone number they left, if any. Click it to call (on a phone or a computer set up for calling)."} />
                  </dt>
                  <dd className={FIELD_VALUE_CLASSES}>
                    {m.phone ? (
                      <a href={`tel:${m.phone}`} className="hover:text-brand">
                        {m.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className={`flex items-center gap-1 ${FIELD_LABEL_CLASSES}`}>
                    Company <InfoTip text={"The business name they entered. It's optional on the form, so it may be blank."} />
                  </dt>
                  <dd className={FIELD_VALUE_CLASSES}>
                    {m.company || <span className="text-gray-400">—</span>}
                  </dd>
                </div>
                <div>
                  <dt className={`flex items-center gap-1 ${FIELD_LABEL_CLASSES}`}>
                    Service Interest <InfoTip text={"The service they picked from the dropdown on the contact form, which tells you what they were asking about."} />
                  </dt>
                  <dd className={FIELD_VALUE_CLASSES}>
                    {m.service || <span className="text-gray-400">—</span>}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">
                <p className={`flex items-center gap-1 ${FIELD_LABEL_CLASSES}`}>
                  Message {<InfoTip text={"What they wrote in the message box on the contact form, word for word."} />}
                </p>
                {m.message ? (
                  <p className="mt-1 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                    {m.message}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-400">No message left.</p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <InfoTip text="Write a reply here and it's emailed to them from the ONPRO IT inbox, so their answer comes back to that inbox. Replying also marks the message as read. It stays in the Inbox until you archive it.">
                <button
                  onClick={() => setReplyingTo(m)}
                  className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply
                </button>
                </InfoTip>
                {!m.archived ? (
                  <InfoTip text="Move this message out of the Inbox once it's handled. It's kept under Archived, not deleted, and you can restore it any time.">
                  <button
                    onClick={() => setArchived(m.id, true)}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                  </button>
                  </InfoTip>
                ) : (
                  <InfoTip text="Move this message back to the Inbox.">
                  <button
                    onClick={() => setArchived(m.id, false)}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ArchiveRestore className="h-3.5 w-3.5" />
                    Restore
                  </button>
                  </InfoTip>
                )}
                <InfoTip text="Permanently delete this message. This can't be undone. Use Archive instead if you might want it later.">
                <button
                  onClick={() => remove(m.id)}
                  className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
                </InfoTip>
              </div>
            </div>
          ))
        )}
      </div>

      {replyingTo && (
        <ReplyForm
          submission={replyingTo}
          onClose={() => setReplyingTo(null)}
          onSent={() => {
            setReplyingTo(null);
            load();
          }}
        />
      )}
    </div>
  );
}
