import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import ConsultationButton from "@/components/ConsultationButton";
import { SERVICES_DATA } from "@/lib/services-data";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "IT Services in Southern NJ & Philadelphia | ONPRO IT",
  description:
    "ONPRO IT provides IT services — managed IT, cybersecurity, cabling, cloud & VoIP — for South Jersey, Philly & Delaware businesses. Call for a free quote.",
  keywords: "IT services NJ, managed IT Philadelphia, business technology services Southern NJ",
  openGraph: {
    title: "IT Services in Southern NJ & Philadelphia | ONPRO IT",
    description:
      "Explore ONPRO IT's full range of IT services for Southern NJ and Philadelphia businesses.",
    url: `${SITE_URL}/services`,
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
};

const DIFFERENTIATORS = [
  "Local Support in NJ, PA & DE",
  "Certified Industry Experts",
  "Proactive Monitoring 24/7",
  "No Long-Term Contracts Required",
];

const FAQS = [
  {
    question: "What IT services does ONPRO IT provide?",
    answer:
      "ONPRO IT provides managed IT services, IT support and help desk, cybersecurity, network and WiFi design, cloud and Microsoft 365, data backup and disaster recovery, structured cabling, AV and conference room systems, network security cameras, entry access control, IT consulting, VoIP phone systems, and AI integration — all delivered and supported by one local team.",
  },
  {
    question: "Do I need to combine multiple vendors to get all of these IT services?",
    answer:
      "No. One of the main advantages of working with ONPRO IT is that the same team designs, installs, and manages all of it — your network, security, phones, and cameras — so you have one company to call instead of juggling separate vendors who point fingers at each other.",
  },
  {
    question: "Are your IT services billed hourly or at a flat monthly rate?",
    answer:
      "Most of our IT services are billed at a flat, predictable monthly rate rather than by the hour, so you don't get a surprise invoice when something goes wrong. We can also scope one-off projects separately when that fits better.",
  },
  {
    question: "What areas do you provide IT services in?",
    answer:
      "We provide IT services to businesses throughout South Jersey, the Greater Philadelphia area, and Delaware — with local technicians based in the region, not a remote call center.",
  },
  {
    question: "Do you offer IT services for small businesses, or only larger companies?",
    answer:
      "We work with small and mid-sized businesses across a range of industries. Whether you have a handful of employees or a few hundred, we scale the mix of IT services to fit your team and budget.",
  },
  {
    question: "Is there a long-term contract required for IT services?",
    answer:
      "No — we don't require long-term contracts. We earn your business every month on the strength of the service itself.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function ServicesOverviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative overflow-hidden bg-dark py-20 text-white">
        <Image
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
          alt="Business team discussing IT strategy in a modern office"
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            IT Services, Designed, Installed & Managed by One Local Team
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            From the network cabling in your walls to the help desk ticket you file next year,
            ONPRO IT delivers the full range of IT services — managed IT, cybersecurity, cabling,
            cloud, VoIP, and more — as the local technology partner that builds and supports it
            all for businesses in South Jersey, Philadelphia, and Delaware.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ConsultationButton href={`tel:${PHONE_HREF}`} variant="primary">
              Call {PHONE_DISPLAY}
            </ConsultationButton>
            <ConsultationButton href="/contact" variant="outline-light">
              Get a Free Quote
            </ConsultationButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything Your Business Needs to Succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            We provide a full spectrum of managed technology services, eliminating the need for
            multiple vendors and simplifying support.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {SERVICES_DATA.map((s) => (
              <ServiceCard
                key={s.slug}
                title={s.navTitle}
                description={s.intro}
                href={`/services/${s.slug}`}
                Icon={s.Icon}
                color={s.color}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            A Strategic Technology Partner, Not Just a Vendor
          </h2>
          <p className="mt-4 text-gray-600">
            We believe that technology should be an asset, not a liability. Our approach goes
            beyond fixing broken computers. We work alongside you to design resilient networks,
            secure your assets, and implement forward-thinking strategies that align with your
            business goals.
          </p>
          <ul className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link href="/about-us" className="text-sm font-semibold text-brand hover:underline">
              Learn More About Us →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            {FAQS.map((faq) => (
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
          <h2 className="text-3xl font-bold">Ready to Transform Your Business IT?</h2>
          <p className="mt-4 text-white/90">
            Contact us today for a free assessment of your current infrastructure and discover how
            we can help your business grow.
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
