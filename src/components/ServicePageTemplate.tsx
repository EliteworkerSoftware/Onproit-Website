import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import { SERVICES_DATA, type ServiceData } from "@/lib/services-data";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";

export default function ServicePageTemplate({ service }: { service: ServiceData }) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.navTitle,
    provider: { "@type": "LocalBusiness", name: "ONPRO IT" },
    areaServed: "Southern New Jersey, Philadelphia, Delaware",
    description: service.metaDescription,
    url: `${SITE_URL}/services/${service.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.navTitle, item: `${SITE_URL}/services/${service.slug}` },
    ],
  };

  const relatedServices = SERVICES_DATA.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative overflow-hidden bg-dark text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
          <Image src={service.heroImage} alt={service.h1} fill priority className="object-cover" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-dark to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <service.Icon className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{service.h1}</h1>
            <p className="mt-6 text-lg text-gray-300">{service.intro}</p>
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

        <div className="relative h-64 w-full sm:h-80 lg:hidden">
          <Image src={service.heroImage} alt={service.h1} fill priority className="object-cover" />
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-dark to-transparent" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">What {service.navTitle} Actually Involves</h2>
          <div className="mt-6 space-y-4 text-gray-600">
            {service.whatIsIt.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Built for Businesses Like Yours</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.whoItsFor.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute inset-y-0 left-0 hidden w-[42%] lg:block">
          <Image
            src={service.secondaryImage ?? "/images/about-team.png"}
            alt={`ONPRO IT team delivering ${service.navTitle.toLowerCase()}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-72 w-full sm:h-96 lg:hidden">
          <Image
            src={service.secondaryImage ?? "/images/about-team.png"}
            alt={`ONPRO IT team delivering ${service.navTitle.toLowerCase()}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mt-10 lg:mt-0 lg:ml-auto lg:max-w-xl">
            <h2 className="text-3xl font-bold text-gray-900">What It Costs You to Go Without It</h2>
            <ul className="mt-6 space-y-3">
              {service.risks.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">How We Make It Happen</h2>
          <div className="mt-8 space-y-6">
            {service.howWeDeliver.map((item, i) => (
              <div key={item} className="relative border-l-2 border-brand/20 pl-6">
                <span className="absolute -left-1.25 top-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <span className="text-xs font-bold uppercase tracking-wide text-brand">Step {i + 1}</span>
                <p className="mt-1 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">What You Get</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.benefits.map((item) => (
              <div key={item} className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                <p className="text-sm font-medium text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Where We Work</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {service.areasServed.map((area) => (
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            {service.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Other Ways We Can Help</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-gray-800 transition-colors hover:border-accent hover:text-accent"
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
            Talk to an ONPRO IT technology advisor about {service.navTitle.toLowerCase()} for
            your business.
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
