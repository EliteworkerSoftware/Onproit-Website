import Image from "next/image";
import { CheckCircle2, MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import type { ServiceData } from "@/lib/services-data";
import { SITE_URL } from "@/lib/constants";

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
          <div className="mt-8">
            <ConsultationButton href="/schedule" variant="primary">
              Schedule a Discovery Call
            </ConsultationButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            What Is {service.navTitle} and Why Do You Need It?
          </h2>
          <div className="mt-6 space-y-4 text-gray-600">
            {service.whatIsIt.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Who Is This Service For?</h2>
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            The Business Risks of Going Without {service.navTitle}
          </h2>
          <ul className="mt-6 space-y-3">
            {service.risks.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            How ONPRO IT Delivers {service.navTitle}
          </h2>
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
          <h2 className="text-3xl font-bold text-gray-900">Business Outcomes & Benefits</h2>
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
          <h2 className="text-3xl font-bold text-gray-900">
            Serving Businesses Across {service.areasServed.length > 2 ? "the Region" : service.areasServed.join(" and ")}
          </h2>
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

      <section className="bg-linear-to-br from-brand to-brand-dark py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 text-white/90">
            Talk to a local ONPRO IT technology advisor about {service.navTitle.toLowerCase()} for
            your business.
          </p>
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
