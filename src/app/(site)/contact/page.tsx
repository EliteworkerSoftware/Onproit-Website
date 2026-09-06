import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { SITE_URL } from "@/lib/constants";
import { getSettings, HOURS_NOTE_TEXT } from "@/lib/get-settings";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact ONPRO IT | IT Services Southern NJ & Philadelphia",
  description:
    "Contact ONPRO IT for managed IT services, structured cabling, and cybersecurity in Southern NJ, Philadelphia, and Delaware. Call 856-988-2663.",
  keywords: "contact ONPRO IT, IT company West Berlin NJ, IT support contact Southern NJ",
  openGraph: {
    title: "Contact ONPRO IT | IT Services Southern NJ & Philadelphia",
    description:
      "Contact ONPRO IT for managed IT services, structured cabling, and cybersecurity in Southern NJ, Philadelphia, and Delaware.",
    url: `${SITE_URL}/contact`,
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const hours = `Mon–Fri ${settings.hours_weekdays}`;

  const INFO_CARDS = [
    { Icon: Phone, label: "Phone", value: settings.contact_phone, href: `tel:${settings.contact_phone.replace(/[^0-9+]/g, "")}` },
    { Icon: MapPin, label: "Address", value: settings.contact_address, href: undefined },
    { Icon: Clock, label: "Hours", value: hours, href: undefined },
  ];

  return (
    <>
      <section className="bg-white pt-8 pb-16 sm:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Contact ONPRO IT
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Tell us what you need — a member of our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 lg:col-span-2">
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>

            <div className="space-y-3">
              {INFO_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <card.Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {card.label}
                    </p>
                    {card.href ? (
                      <a href={card.href} className="block truncate text-sm font-medium text-gray-900 hover:text-brand">
                        {card.value}
                      </a>
                    ) : (
                      <p className="truncate text-sm font-medium text-gray-900">{card.value}</p>
                    )}
                    {card.label === "Hours" && (
                      <p className="mt-0.5 text-xs text-gray-500">{HOURS_NOTE_TEXT}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Find Us</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <iframe
              title="ONPRO IT location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.contact_address)}&output=embed`}
              width="100%"
              height="400"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
