"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

interface AdminUserRow {
  id: string;
  email: string;
  display_name: string | null;
  joined_at: string;
  last_login_at: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const res = await fetch("/api/admin/admin-users");
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users);
      setCurrentUserId(data.currentUserId);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/admin-users");
      const data = await res.json();
      if (!cancelled && res.ok) {
        setUsers(data.users);
        setCurrentUserId(data.currentUserId);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/admin-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, displayName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to invite admin");
      return;
    }
    setInviting(false);
    setEmail("");
    setDisplayName("");
    setNotice(
      data.emailSent
        ? `Invite sent to ${email}.`
        : `Admin created, but the invite email failed to send. Check the Mailgun configuration and re-invite if needed.`
    );
    load();
  }

  async function remove(user: AdminUserRow) {
    if (!confirm(`Remove ${user.email} from the admin dashboard?`)) return;
    const res = await fetch(`/api/admin/admin-users/${user.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to remove admin");
      return;
    }
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="mt-1 text-sm text-gray-500">Users with full access to this dashboard.</p>
        </div>
        <button
          onClick={() => {
            setInviting(true);
            setError("");
          }}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add New Admin
        </button>
      </div>

      {notice && <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!users ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={3}>
                  Loading…
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{u.email}</p>
                    {u.display_name && <p className="text-xs text-gray-500">{u.display_name}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(u.joined_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id === currentUserId ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                        Current User
                      </span>
                    ) : (
                      <button
                        onClick={() => remove(u)}
                        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {inviting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Invite New Administrator</h2>
              <button onClick={() => setInviting(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              They&apos;ll receive an email with a temporary password to log in with.
            </p>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@onproit.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Display Name (optional)</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInviting(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
