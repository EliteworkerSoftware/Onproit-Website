"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

interface Recipient {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string | null;
  notify_contact_forms: boolean;
  notify_chatbot_leads: boolean;
}

const EMPTY = { email: "", name: "", phone: "", role: "", notify_contact_forms: true, notify_chatbot_leads: false };

export default function AdminEmailRecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[] | null>(null);
  const [editing, setEditing] = useState<Recipient | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/email-recipients");
    const data = await res.json();
    if (res.ok) setRecipients(data.recipients);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/email-recipients");
      const data = await res.json();
      if (!cancelled && res.ok) setRecipients(data.recipients);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function openNew() {
    setForm(EMPTY);
    setEditing("new");
    setError("");
  }

  function openEdit(r: Recipient) {
    setForm({
      email: r.email,
      name: r.name ?? "",
      phone: r.phone ?? "",
      role: r.role ?? "",
      notify_contact_forms: r.notify_contact_forms,
      notify_chatbot_leads: r.notify_chatbot_leads,
    });
    setEditing(r);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const url = editing === "new" ? "/api/admin/email-recipients" : `/api/admin/email-recipients/${(editing as Recipient).id}`;
    const method = editing === "new" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save");
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this recipient?")) return;
    await fetch(`/api/admin/email-recipients/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Recipients</h1>
          <p className="mt-1 text-sm text-gray-500">Configure which addresses receive submission alerts.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add Email Recipient
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Contact Forms</th>
              <th className="px-4 py-3">Chatbot Leads</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!recipients ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                  Loading…
                </td>
              </tr>
            ) : recipients.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                  No recipients yet.
                </td>
              </tr>
            ) : (
              recipients.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.email}</p>
                    {r.name && <p className="text-xs text-gray-500">{r.name}</p>}
                  </td>
                  <td className="px-4 py-3">{r.notify_contact_forms ? "✓" : "—"}</td>
                  <td className="px-4 py-3">{r.notify_chatbot_leads ? "✓" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(r)} className="rounded-md p-2 text-gray-500 hover:bg-gray-100">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(r.id)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editing === "new" ? "Add Email Recipient" : "Edit Email Recipient"}
              </h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alerts@company.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Name / Label</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sales Team"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Alert Subscriptions
                </p>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.notify_contact_forms}
                    onChange={(e) => setForm({ ...form, notify_contact_forms: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  Contact Forms (Contact Us page)
                </label>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
