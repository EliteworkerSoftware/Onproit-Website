import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";
import { SERVICE_AREA_LIST } from "@/lib/services-data";

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
      <section className="relative overflow-hidden bg-dark text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
          <Image
            src="/images/voip-team.png"
            alt="ONPRO IT technician working in a server room"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-dark to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Why ONPRO IT Exists</h1>
            <p className="mt-6 text-lg text-gray-300">
              We didn&apos;t start out as an IT company. We started by trying to solve the same
              problem our clients come to us with.
            </p>
          </div>
        </div>

        <div className="relative h-64 w-full sm:h-80 lg:hidden">
          <Image
            src="/images/voip-team.png"
            alt="ONPRO IT technician working in a server room"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-dark to-transparent" />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 text-gray-600">
            <p>
              Before ONPRO IT, we ran Elite Smart Home and Elite Smart Security — smart home
              automation, AV, and access control and surveillance systems. All of it depends on a
              solid network underneath, so we were already deep in networking long before we ever
              called ourselves an IT company.
            </p>
            <p>
              When it came time to find someone to handle our own company&apos;s IT, we ran into
              the same wall every small business runs into: the IT companies that actually knew
              what they were doing only wanted large corporate accounts with big budgets. Everyone
              else was left to figure it out on their own.
            </p>
            <p>
              So that&apos;s what most small businesses do — a router from a big-box store, a
              laptop from wherever, a cousin&apos;s guy on speed dial for when it breaks. It works
              until it doesn&apos;t, and then nobody can tell you why, because no one ever actually
              understood the whole system. It&apos;s not a strategy, it&apos;s a Frankenstein built
              from mismatched parts.
            </p>
            <p>
              We started ONPRO IT to be what we couldn&apos;t find: enterprise-grade IT built for
              small and medium-sized businesses. It was a natural move for us — integration and
              security already relied on the same networking fundamentals — so we carried the same
              standards that made those companies work into IT: show up, do it right the first
              time, and take responsibility for the whole system instead of just one piece of it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Where We Work</p>
          <p className="mt-2 text-sm text-gray-600">
            Headquartered in Berlin Township, NJ, with on-site and remote support across:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICE_AREA_LIST.map((area) => (
              <span
                key={area}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600"
              >
                <MapPin className="h-3.5 w-3.5 text-brand" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-brand to-brand-dark py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Let&apos;s Talk About Your Technology</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ConsultationButton href={`tel:${PHONE_HREF}`} variant="outline-light">
              Call {PHONE_DISPLAY}
            </ConsultationButton>
            <ConsultationButton href="/contact" variant="primary">
              Get a Free Quote
            </ConsultationButton>
          </div>
        </div>
      </section>
    </>
  );
}
