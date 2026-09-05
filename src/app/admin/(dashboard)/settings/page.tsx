"use client";

import { useEffect, useState } from "react";

interface Settings {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
  contact_notification_emails: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings));
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setStatus("saving");
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save");
      setStatus("error");
      return;
    }
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  const inputClasses =
    "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  if (!settings) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Update your public contact details and business hours — shown on the Contact page and footer.
      </p>

      <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
          <p className="mt-1 text-sm text-gray-500">Primary contact information displayed on the website.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                value={settings.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                value={settings.contact_phone}
                onChange={(e) => update("contact_phone", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Physical Address</label>
              <textarea
                value={settings.contact_address}
                onChange={(e) => update("contact_address", e.target.value)}
                rows={2}
                className={inputClasses}
              />
              <p className="mt-1 text-xs text-gray-400">This address is shown on the Contact page map section.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Lead Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">
            Who gets emailed when someone submits the contact form.
          </p>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Notification Email(s)</label>
            <textarea
              value={settings.contact_notification_emails}
              onChange={(e) => update("contact_notification_emails", e.target.value)}
              rows={2}
              className={inputClasses}
              placeholder="you@onproit.com, teammate@onproit.com"
            />
            <p className="mt-1 text-xs text-gray-400">
              Separate multiple addresses with commas — every address listed gets the notification.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Business Hours</h2>
          <p className="mt-1 text-sm text-gray-500">Operating hours shown to customers.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Monday - Friday</label>
              <input
                value={settings.hours_weekdays}
                onChange={(e) => update("hours_weekdays", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Saturday</label>
              <input
                value={settings.hours_saturday}
                onChange={(e) => update("hours_saturday", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Sunday</label>
              <input
                value={settings.hours_sunday}
                onChange={(e) => update("hours_sunday", e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          {status === "saved" && <p className="mb-3 text-sm text-green-600">Saved.</p>}
          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save Information"}
          </button>
        </div>
      </form>

      <div className="mt-6 max-w-md">
        <ChangePasswordCard />
      </div>
    </div>
  );
}

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const inputClasses =
    "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      setStatus("error");
      return;
    }

    setStatus("saving");
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to change password");
      setStatus("error");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
      <p className="mt-1 text-sm text-gray-500">Update the password for your own admin account.</p>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
            className={inputClasses}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {status === "saved" && <p className="mt-3 text-sm text-green-600">Password updated.</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-4 rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "saving" ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
