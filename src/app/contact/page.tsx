import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import {
  ADDRESS_FULL,
  EMAIL,
  HOURS,
  HOURS_NOTE,
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE_URL,
} from "@/lib/constants";

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

const INFO_CARDS = [
  { Icon: Phone, label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE_HREF}` },
  { Icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { Icon: MapPin, label: "Address", value: ADDRESS_FULL, href: undefined },
  { Icon: Clock, label: "Hours", value: HOURS, href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-dark py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Contact ONPRO IT — Your Southern NJ Technology Partner
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Ready to transform your IT infrastructure? Contact us today for a free consultation on
            cabling, networking, and managed services in NJ, DE, and PA.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INFO_CARDS.map((card) => (
              <div key={card.label} className="rounded-xl border border-gray-200 p-6 text-center">
                <card.Icon className="mx-auto h-6 w-6 text-brand" />
                <h2 className="mt-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {card.label}
                </h2>
                {card.href ? (
                  <a href={card.href} className="mt-1 block text-sm font-medium text-gray-900 hover:text-brand">
                    {card.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium text-gray-900">{card.value}</p>
                )}
                {card.label === "Hours" && (
                  <p className="mt-2 text-xs text-gray-500">{HOURS_NOTE}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find Us</h2>
              <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                <iframe
                  title="ONPRO IT location map"
                  src="https://www.google.com/maps?q=409+Bloomfield+Dr+STE+5,+West+Berlin,+NJ+08091&output=embed"
                  width="100%"
                  height="400"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
