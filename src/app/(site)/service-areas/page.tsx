import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import { LOCATIONS_DATA, locationLinkLabel } from "@/lib/locations-data";
import { SERVICES_DATA, SERVICE_COLOR_BADGE } from "@/lib/services-data";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { getServiceArea } from "@/lib/service-area";
import { DEFAULT_SERVICE_AREA } from "@/lib/keyword-region";
import { groupServiceArea } from "@/lib/service-area-display";

// The place list comes from Admin → Settings → Service Area, so edits there
// show up here within the hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Service Areas | IT Services in South Jersey, Philadelphia & Delaware | ONPRO IT",
  description:
    "Managed IT, structured cabling, cybersecurity, VoIP, security cameras, and more for businesses across South Jersey, the Jersey Shore, Mercer County, the Philadelphia area, and Delaware.",
  openGraph: {
    title: "Service Areas | ONPRO IT",
    description:
      "Every ONPRO IT service, available across South Jersey, the Jersey Shore, Mercer County, the Philadelphia area, and Delaware.",
    url: `${SITE_URL}/service-areas`,
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/service-areas`,
  },
};

// The local page for a place, if one exists (e.g. "cherry hill" →
// /managed-it-services-cherry-hill-nj).
function localPageFor(term: string) {
  const slug = term.replace(/\s+/g, "-");
  return LOCATIONS_DATA.find((l) => l.path.includes(slug));
}

export default async function ServiceAreasPage() {
  const area = isSupabaseAdminConfigured() ? await getServiceArea(getSupabaseAdmin()) : DEFAULT_SERVICE_AREA;
  const regions = groupServiceArea(area.inArea);

  const localPageGroups = SERVICES_DATA.map((service) => ({
    service,
    pages: LOCATIONS_DATA.filter((l) => l.focus === service.slug),
  })).filter((g) => g.pages.length > 0);

  return (
    <>
      <section className="bg-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Areas We Serve</h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            One local team for businesses across South Jersey, the Jersey Shore, Mercer County, the Philadelphia area,
            and Delaware &mdash; and every service we offer is available everywhere we work.
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Every Service, Everywhere We Work</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Whether you&apos;re in Cherry Hill, Toms River, Philadelphia, or Wilmington, you get the full ONPRO IT team
            &mdash; not a reduced menu.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DATA.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:border-accent"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:text-white ${SERVICE_COLOR_BADGE[s.color]}`}
                >
                  <s.Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-accent">{s.navTitle}</span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Where We Work</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Don&apos;t see your town? If you&apos;re nearby, we can almost certainly help &mdash; just ask.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {regions.map(({ region, places }) => (
              <div key={region} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">{region}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {places.map((p) => {
                    const page = localPageFor(p.term);
                    return page ? (
                      <Link
                        key={p.term}
                        href={`/${page.path}`}
                        className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/5 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/10"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        {p.name}
                      </Link>
                    ) : (
                      <span
                        key={p.term}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700"
                      >
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        {p.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {localPageGroups.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Local Service Pages</h2>
              <p className="mt-3 max-w-2xl text-gray-600">A closer look at what we do in specific areas.</p>
            </div>
            {localPageGroups.map(({ service, pages }) => (
              <div key={service.slug}>
                <h3 className="text-xl font-semibold text-gray-900">
                  <Link href={`/services/${service.slug}`} className="hover:text-accent">
                    {service.navTitle}
                  </Link>
                </h3>
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
      )}

      <section className="bg-brand py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Let&apos;s Talk About Your Business</h2>
          <p className="mt-4 text-white/90">One call covers IT, cabling, security, phones, and more &mdash; wherever you are in our area.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ConsultationButton href={`tel:${PHONE_HREF}`} variant="accent">
              Call {PHONE_DISPLAY}
            </ConsultationButton>
            <ConsultationButton href="/contact" variant="outline-light">
              Get a Free Quote
            </ConsultationButton>
          </div>
        </div>
      </section>
    </>
  );
}
