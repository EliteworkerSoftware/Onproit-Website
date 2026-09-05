import { MapPin } from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import type { LocationData } from "@/lib/locations-data";

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

  const serviceLabel = location.focus === "cabling" ? "Structured Cabling" : "Managed IT Services";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-dark py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{location.h1}</h1>
          <p className="mt-6 text-lg text-gray-300">{location.intro}</p>
          <div className="mt-8">
            <ConsultationButton href="/contact" variant="primary">
              Schedule a Discovery Call
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

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Local Businesses Choose ONPRO IT for {serviceLabel}
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

      <section className="bg-linear-to-br from-brand to-brand-dark py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 text-white/90">
            Talk to your local ONPRO IT team about {serviceLabel.toLowerCase()} for your business.
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
