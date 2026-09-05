import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import ConsultationButton from "@/components/ConsultationButton";
import { SERVICES_DATA } from "@/lib/services-data";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "IT Services in Southern NJ & Philadelphia | ONPRO IT",
  description:
    "Explore ONPRO IT's full range of IT services for Southern NJ and Philadelphia businesses — managed IT, cybersecurity, cabling, cloud, VoIP, and more.",
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

export default function ServicesOverviewPage() {
  return (
    <>
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
            Comprehensive IT Solutions for Growing Businesses
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            From day-to-day support to strategic infrastructure planning, ONPRO IT is the local
            technology partner that helps businesses in South Jersey and the Philadelphia Metro
            area thrive.
          </p>
          <div className="mt-8">
            <ConsultationButton href="/schedule" variant="primary">
              Schedule a Consultation
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

      <section className="bg-linear-to-br from-brand to-brand-dark py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Transform Your Business IT?</h2>
          <p className="mt-4 text-white/90">
            Contact us today for a free assessment of your current infrastructure and discover how
            we can help your business grow.
          </p>
          <div className="mt-8">
            <ConsultationButton href="/schedule" variant="outline-light">
              Schedule a Consultation
            </ConsultationButton>
          </div>
        </div>
      </section>
    </>
  );
}
