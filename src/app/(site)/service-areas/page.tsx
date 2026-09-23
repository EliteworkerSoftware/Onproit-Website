import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import { LOCATIONS_DATA, locationLinkLabel } from "@/lib/locations-data";
import { SERVICES_DATA } from "@/lib/services-data";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Service Areas | IT Services in South Jersey, Philadelphia & Delaware | ONPRO IT",
  description:
    "Every town, city, and county ONPRO IT serves across South Jersey, the Philadelphia metro, and Delaware — managed IT, structured cabling, and more from one local team.",
  openGraph: {
    title: "Service Areas | ONPRO IT",
    description:
      "Every town, city, and county ONPRO IT serves across South Jersey, the Philadelphia metro, and Delaware.",
    url: `${SITE_URL}/service-areas`,
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/service-areas`,
  },
};

// Hub linking every location page, grouped by service. Built straight from
// LOCATIONS_DATA, so a new location page shows up here automatically.
export default function ServiceAreasPage() {
  const groups = SERVICES_DATA.map((service) => ({
    service,
    pages: LOCATIONS_DATA.filter((l) => l.focus === service.slug),
  })).filter((g) => g.pages.length > 0);

  return (
    <>
      <section className="bg-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Areas We Serve</h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            One local team for businesses across South Jersey, the Philadelphia metro, and Delaware. Find
            your area below, or call us &mdash; if you&apos;re nearby, we can help.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ConsultationButton href={`tel:${PHONE_HREF}`} variant="primary">
              Call {PHONE_DISPLAY}
            </ConsultationButton>
            <ConsultationButton href="/contact" variant="outline-light">
              Get a Free Quote
            </ConsultationButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
          {groups.map(({ service, pages }) => (
            <div key={service.slug}>
              <h2 className="text-2xl font-bold text-gray-900">
                <Link href={`/services/${service.slug}`} className="hover:text-accent">
                  {service.navTitle}
                </Link>
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pages.map((l) => (
                  <li key={l.path}>
                    <Link
                      href={`/${l.path}`}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:border-accent hover:text-accent"
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-accent" />
                      {locationLinkLabel(l)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
