"use client";

import { useEffect, useState } from "react";
import SystemStatusPanel from "@/components/admin/SystemStatusPanel";
import ServiceAreaCard from "@/components/admin/ServiceAreaCard";
import InfoTip from "@/components/admin/InfoTip";

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
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        Settings
        <InfoTip text={"Business details shown on the public website, who gets emailed about new leads, your service area for SEO, your password, and a health check of every connected system."} />
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Update your public contact details and business hours — shown on the Contact page and footer.
      </p>

      <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Contact Details
            <InfoTip text={"The contact information visitors see on the Contact page and in the website footer. Changes appear on the live site right after you click Save Information."} />
          </h2>
          <p className="mt-1 text-sm text-gray-500">Primary contact information displayed on the website.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Email Address <InfoTip text={"The public email address shown on the website for customers to write to."} />
              </label>
              <input
                value={settings.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Phone Number <InfoTip text={"The public phone number shown on the website. Write it the way you want it displayed, e.g. (856) 555-0123."} />
              </label>
              <input
                value={settings.contact_phone}
                onChange={(e) => update("contact_phone", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Physical Address <InfoTip text={"Your business address, shown on the Contact page with the map. Keep it identical to your Google Business Profile address; matching addresses help local rankings."} />
              </label>
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
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Lead Notifications
            <InfoTip text={"When someone submits the Contact form, an email with their message goes to every address listed here, right away. The message is also saved on the Inquiries page."} />
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Who gets emailed when someone submits the contact form.
          </p>
          <div className="mt-4">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              Notification Email(s) <InfoTip text={"The addresses that get new-lead emails. Separate several with commas. These are private: they're never shown on the website."} />
            </label>
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
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Business Hours
            <InfoTip text={"The hours shown to visitors on the Contact page and in the footer. Type them exactly as you want them to read, e.g. 8:00 AM – 5:00 PM, or Closed."} />
          </h2>
          <p className="mt-1 text-sm text-gray-500">Operating hours shown to customers.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Monday - Friday <InfoTip text={"Your weekday hours as they'll appear on the website."} />
              </label>
              <input
                value={settings.hours_weekdays}
                onChange={(e) => update("hours_weekdays", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Saturday <InfoTip text={"Saturday hours as they'll appear on the website, or Closed."} />
              </label>
              <input
                value={settings.hours_saturday}
                onChange={(e) => update("hours_saturday", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Sunday <InfoTip text={"Sunday hours as they'll appear on the website, or Closed."} />
              </label>
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
<InfoTip text={"Saves Contact Details, Lead Notifications, and Business Hours together. The public website updates right away."}>
          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save Information"}
          </button>
</InfoTip>
        </div>
      </form>

      <div className="mt-6">
        <ServiceAreaCard />
      </div>

      <div className="mt-6 max-w-md">
        <ChangePasswordCard />
      </div>

      <div className="mt-6 max-w-2xl">
        <SystemStatusPanel />
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
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        Change Password
        <InfoTip text={"Changes the password you use to sign in to this dashboard. It only affects your account, not other admins'."} />
      </h2>
      <p className="mt-1 text-sm text-gray-500">Update the password for your own admin account.</p>
      <div className="mt-4 space-y-4">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Current Password <InfoTip text={"The password you use to sign in now, to confirm it's really you."} />
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            New Password <InfoTip text={"Your new password: at least 8 characters."} />
          </label>
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
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Confirm New Password <InfoTip text={"Type the new password again to make sure there's no typo."} />
          </label>
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
