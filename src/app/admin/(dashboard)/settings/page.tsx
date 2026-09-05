"use client";

import { useEffect, useState } from "react";

interface Settings {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
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
    </div>
  );
}
