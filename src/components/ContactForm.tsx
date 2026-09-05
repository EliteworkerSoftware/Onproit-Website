"use client";

import { useState, type FormEvent } from "react";
import Turnstile from "@/components/Turnstile";

const SERVICE_OPTIONS = [
  "Managed IT Services",
  "IT Help Desk / Support",
  "Cybersecurity",
  "Network & WiFi",
  "Cloud Solutions",
  "Data Backup & Recovery",
  "Structured Cabling",
  "IT Consulting",
  "VoIP Phone Systems",
  "Something Else",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Grab the element now, before the async gap below — React nulls out
    // e.currentTarget once the handler returns, so it can't be read after an
    // await, and calling .reset() on null would throw.
    const formEl = e.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(formEl);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      company: String(formData.get("company") || ""),
      service: String(formData.get("service") || ""),
      message: String(formData.get("message") || ""),
      turnstileToken: formData.get("cf-turnstile-response"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong sending your message. Please try again or call us.");
        setStatus("error");
        return;
      }
      formEl.reset();
      setStatus("success");
    } catch {
      setErrorMessage("Something went wrong sending your message. Please try again or call us.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-green-800">Thanks for reaching out!</h3>
        <p className="mt-2 text-sm text-green-700">
          A member of the ONPRO IT team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-gray-700">
            Company *
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="mb-1 block text-sm font-medium text-gray-700">
          Service Interest
        </label>
        <select
          id="service"
          name="service"
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
