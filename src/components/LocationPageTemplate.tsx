import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import type { LocationData } from "@/lib/locations-data";
import { SERVICES_DATA } from "@/lib/services-data";
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

  // Every service is available in every service area — this just varies which
  // three get spotlighted so a "cabling" page doesn't imply that's all we do here.
  const relatedServiceSlugs =
    location.focus === "cabling"
      ? ["cabling", "managed-it", "network-wifi"]
      : ["managed-it", "cabling", "cybersecurity"];
  const relatedServices = SERVICES_DATA.filter((s) => relatedServiceSlugs.includes(s.slug));

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

      <section className="relative overflow-hidden bg-dark text-white">
        {location.heroImage && (
          <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
            <Image src={location.heroImage} alt={location.h1} fill priority className="object-cover" />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-dark to-transparent" />
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{location.h1}</h1>
            <p className="mt-6 text-lg text-gray-300">{location.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ConsultationButton href={`tel:${PHONE_HREF}`} variant="primary">
                Call Now: {PHONE_DISPLAY}
              </ConsultationButton>
              <ConsultationButton href="/contact" variant="outline-light">
                Get a Free Quote
              </ConsultationButton>
            </div>
          </div>
        </div>

        {location.heroImage && (
          <div className="relative h-64 w-full sm:h-80 lg:hidden">
            <Image src={location.heroImage} alt={location.h1} fill priority className="object-cover" />
            <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-dark to-transparent" />
          </div>
        )}
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
                <MapPin className="h-4 w-4 text-accent" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
                className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-800 transition-colors hover:border-accent hover:text-accent"
              >
                {s.navTitle}
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Let&apos;s Build It</h2>
          <p className="mt-4 text-white/90">
            Talk to the ONPRO IT team about {serviceLabel.toLowerCase()} for your business.
          </p>
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
