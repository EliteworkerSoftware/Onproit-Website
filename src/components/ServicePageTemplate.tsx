import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MapPin } from "lucide-react";
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

      <section className="relative overflow-hidden bg-dark py-20 text-white">
        <Image
          src={service.heroImage}
          alt={service.h1}
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand/20 text-brand">
            <service.Icon className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{service.h1}</h1>
          <p className="mt-6 text-lg text-gray-300">{service.intro}</p>
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

      <section className="bg-white py-16 overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-up">
            <h2 className="text-3xl font-bold text-gray-900">What {service.navTitle} Actually Involves</h2>
            <div className="mt-6 space-y-4 text-gray-600">
              {service.whatIsIt.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="animate-fade-up-delay overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={service.heroImage}
              alt={service.h1}
              width={1000}
              height={750}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Is This the Right Fit for Your Business?</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.whoItsFor.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="order-2 animate-fade-up overflow-hidden rounded-2xl shadow-xl lg:order-1">
            <Image
              src={service.secondaryImage ?? "/images/about-team.png"}
              alt={`ONPRO IT team delivering ${service.navTitle.toLowerCase()}`}
              width={1000}
              height={750}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="order-1 animate-fade-up-delay lg:order-2">
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
          <ul className="mt-6 space-y-3">
            {service.howWeDeliver.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-600">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">What You Get</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.benefits.map((item) => (
              <div key={item} className="rounded-lg border border-brand/20 bg-brand/5 p-4">
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
                <MapPin className="h-4 w-4 text-brand" />
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Other Ways We Can Help</h2>
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
        </div>
      </section>

      <section className="bg-linear-to-br from-brand to-brand-dark py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Let&apos;s Build It</h2>
          <p className="mt-4 text-white/90">
            Talk to a local ONPRO IT technology advisor about {service.navTitle.toLowerCase()} for
            your business.
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
