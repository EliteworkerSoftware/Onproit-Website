import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Users } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import { SISTER_COMPANIES, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About ONPRO IT | Managed IT & Technology Services NJ",
  description:
    "Learn about ONPRO IT, Southern NJ's trusted managed IT services provider. Serving businesses in NJ, PA, and DE with expert IT support, cabling, and cybersecurity.",
  keywords: "about ONPRO IT, managed IT provider Southern NJ, IT company West Berlin NJ",
  openGraph: {
    title: "About ONPRO IT | Managed IT & Technology Services NJ",
    description:
      "Learn about ONPRO IT, Southern NJ's trusted managed IT services provider.",
    url: `${SITE_URL}/about-us`,
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/about-us`,
  },
};

export default function AboutUsPage() {
  return (
    <>
      <section className="bg-dark py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About ONPRO IT — Southern NJ&apos;s Technology Partner
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Delivering enterprise-grade IT solutions and structured cabling to businesses across
            the region.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Built for Small Businesses. Designed to Scale.
            </h2>
            <p className="mt-4 text-gray-600">
              OnPro IT was founded on a simple premise: small and medium-sized businesses deserve
              the same level of enterprise-grade technology support as large corporations. We
              understand that your technology is the backbone of your operations.
            </p>
            <p className="mt-4 text-gray-600">
              Whether you are a startup needing your first network installed or a growing firm
              requiring managed security and helpdesk support, our solutions are tailored to fit
              your specific needs and budget. We grow with you, ensuring your infrastructure is
              always one step ahead of your business goals.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/about-team.png"
              alt="Diverse team collaborating at wooden desk with laptops and plants in a modern office"
              width={1248}
              height={832}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/about-conference-room.jpg"
                alt="Modern conference room with long white table, gray chairs, display screen, and contemporary ceiling design"
                width={1536}
                height={2048}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900">
                One Call for Every System in the Building
              </h2>
              <p className="mt-4 text-gray-600">
                Outfitting a new office, restaurant, or retail space usually means coordinating a
                network installer, an AV company, a security integrator, and a smart-automation
                vendor separately — and hoping they all show up on schedule and agree on how the
                pieces fit together.
              </p>
              <p className="mt-4 text-gray-600">
                Between ONPRO IT and our sister companies, Elite Smart Home and Elite Smart
                Security, one group can handle all of it: networking, IT, AV, lighting and
                automation, and security and access control — designed as one system instead of
                four separate vendors pointing fingers at each other.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-brand" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">ONPRO IT</h3>
              <p className="mt-2 text-sm text-gray-600">
                Managed IT, networking, structured cabling, VoIP, AV, and cybersecurity for
                businesses.
              </p>
            </div>
            {SISTER_COMPANIES.map((c) => (
              <div key={c.name} className="rounded-xl bg-white p-6 shadow-sm">
                <Users className="h-8 w-8 text-brand" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{c.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{c.description}</p>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
                  >
                    Visit {c.name} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Where We Work</h2>
          <p className="mt-4 text-gray-600">
            ONPRO IT is headquartered in Berlin Township, NJ, and provides on-site and remote support
            to businesses throughout Southern New Jersey, Philadelphia, and Delaware — including
            Cherry Hill, Voorhees, Marlton, Mount Laurel, Moorestown, and Medford.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <li className="rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
              Responsiveness — we answer the phone and show up when you need us.
            </li>
            <li className="rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
              Transparency — clear pricing and honest recommendations, always.
            </li>
            <li className="rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
              Accountability — one partner responsible for your whole technology stack.
            </li>
            <li className="rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
              Long-term partnership — we plan for where your business is going, not just today.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-linear-to-br from-brand to-brand-dark py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Let&apos;s Talk About Your Technology</h2>
          <div className="mt-8">
            <ConsultationButton href="/contact" variant="outline-light">
              Contact Us
            </ConsultationButton>
          </div>
        </div>
      </section>
    </>
  );
}
