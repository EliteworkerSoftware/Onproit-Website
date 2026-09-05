import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import { LOCATIONS_DATA, type LocationData } from "@/lib/locations-data";
import { HARDWARE_PHOTOS, SERVICES_DATA } from "@/lib/services-data";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";

export default function LocationPageTemplate({ location }: { location: LocationData }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: location.h1.replace(" | ONPRO IT", ""), item: `${SITE_URL}/${location.path}` },
    ],
  };

  const serviceLabel = location.focus === "cabling" ? "Structured Cabling" : "Managed IT Services";

  const relatedServiceSlugs =
    location.focus === "cabling" ? ["cabling", "network-wifi"] : ["managed-it", "it-support", "cybersecurity"];
  const relatedServices = SERVICES_DATA.filter((s) => relatedServiceSlugs.includes(s.slug));
  const otherLocations = LOCATIONS_DATA.filter((l) => l.path !== location.path).slice(0, 4);
  const accentImage = location.focus === "cabling" ? HARDWARE_PHOTOS.cabling : HARDWARE_PHOTOS.serverRack;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative overflow-hidden bg-dark py-20 text-white">
        {location.heroImage && (
          <Image
            src={location.heroImage}
            alt={location.h1}
            fill
            priority
            className="object-cover opacity-30"
          />
        )}
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{location.h1}</h1>
          <p className="mt-6 text-lg text-gray-300">{location.intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ConsultationButton href={`tel:${PHONE_HREF}`} variant="primary">
              Call Now: {PHONE_DISPLAY}
            </ConsultationButton>
            <ConsultationButton href="/contact" variant="outline-light">
              Get a Free Quote
            </ConsultationButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Areas We Serve</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {location.areasServed.map((area) => (
              <span
                key={area}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700"
              >
                <MapPin className="h-4 w-4 text-brand" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-up">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Local Businesses Call Us Instead of a Typical {serviceLabel} Company
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {location.whyChoose.map((item) => (
                <li key={item} className="rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {location.heroImage && (
            <div className="relative animate-fade-up-delay">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={location.heroImage}
                  alt={location.h1}
                  width={1000}
                  height={750}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 hidden h-32 w-32 rotate-[-4deg] overflow-hidden rounded-xl border-4 border-white shadow-2xl sm:block">
                <Image
                  src={accentImage}
                  alt="ONPRO IT installed networking hardware"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            {location.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">What Else We Design, Install & Manage</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-800 hover:border-brand hover:text-brand"
              >
                {s.navTitle}
              </Link>
            ))}
          </div>
          <h3 className="mt-10 text-lg font-semibold text-gray-900">Other Areas We Serve</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {otherLocations.map((l) => (
              <Link
                key={l.path}
                href={`/${l.path}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-brand hover:text-brand"
              >
                {l.h1.replace(" | ONPRO IT", "")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-brand to-brand-dark py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Let&apos;s Build It</h2>
          <p className="mt-4 text-white/90">
            Talk to your local ONPRO IT team about {serviceLabel.toLowerCase()} for your business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ConsultationButton href={`tel:${PHONE_HREF}`} variant="outline-light">
              Call {PHONE_DISPLAY}
            </ConsultationButton>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 font-semibold text-brand hover:bg-gray-100"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
