import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Cable,
  Clock,
  Cloud,
  HardDrive,
  Headphones,
  Network,
  PhoneCall,
  ShieldCheck,
  Briefcase,
  Server,
  ClipboardList,
  Rocket,
  Wrench,
} from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import ServiceCard from "@/components/ServiceCard";
import { SERVICE_AREAS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Managed IT Services Southern NJ & Philadelphia | ONPRO IT",
  description:
    "ONPRO IT provides managed IT services, structured cabling, cybersecurity, and smart home integration for businesses in Southern NJ, Philadelphia, and Delaware. One company. All systems integrated.",
  keywords:
    "managed IT services NJ, IT support Southern NJ, structured cabling NJ, cybersecurity NJ, managed IT Philadelphia, MSP New Jersey",
  openGraph: {
    title: "Managed IT Services Southern NJ & Philadelphia | ONPRO IT",
    description:
      "ONPRO IT provides managed IT services, structured cabling, cybersecurity, and smart home integration for businesses in Southern NJ, Philadelphia, and Delaware.",
    url: "https://www.onproit.com/",
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: "https://www.onproit.com/",
  },
};

const VALUE_PROPS = [
  {
    icon: Clock,
    title: "Rapid, Local Response",
    description:
      "Based in Southern NJ, we provide immediate onsite support and wiring services to Southern NJ, Central NJ, Delaware, and Philadelphia.",
  },
  {
    icon: Cable,
    title: "Expert Cabling & Installation",
    description:
      "From Cat6 data wiring to fiber optics, we ensure your network infrastructure is neat, organized, and built for speed.",
  },
  {
    icon: Award,
    title: "Your One-Stop Partner",
    description:
      "Simplify technology. We handle cabling, network installation, VoIP, and IT support, giving you one reliable partner for every need.",
  },
];

const SERVICE_CARDS = [
  { title: "Structured Cabling", description: "Professional installation of Cat6, Fiber Optic, and Low Voltage wiring for businesses in New Jersey, Delaware, and Philadelphia.", href: "/services/cabling", Icon: Cable },
  { title: "Managed IT Helpdesk", description: "Round-the-clock remote support to resolve technical issues quickly.", href: "/services/it-support", Icon: Headphones },
  { title: "Cyber Security", description: "Comprehensive cybersecurity and security camera wiring to protect your organization.", href: "/services/cybersecurity", Icon: ShieldCheck },
  { title: "Cloud Solutions", description: "Seamless cloud migration and management for Microsoft 365 and Google Workspace.", href: "/services/cloud", Icon: Cloud },
  { title: "VoIP Phone Systems", description: "Modern business telephony solutions to keep your team connected anywhere.", href: "/services/voip", Icon: PhoneCall },
  { title: "Network Solutions", description: "Complete network design, WiFi setup, and infrastructure management for growing businesses.", href: "/services/network-wifi", Icon: Network },
  { title: "Data Backup", description: "Secure disaster recovery and data protection strategies for peace of mind.", href: "/services/backup-recovery", Icon: HardDrive },
  { title: "IT Consulting", description: "Strategic IT planning and budgeting to align technology with your business goals.", href: "/services/consulting", Icon: Briefcase },
];

const ONBOARDING_STEPS = [
  { icon: ClipboardList, title: "Discovery Meeting", description: "We start with a face-to-face or virtual meeting to understand your business goals, pain points, and current IT setup." },
  { icon: Wrench, title: "Custom Proposal", description: "You'll receive a detailed roadmap and quote, outlining exactly how we'll solve your challenges without hidden fees." },
  { icon: Rocket, title: "Seamless Onboarding", description: "Once approved, our team handles the transition. We install equipment, configure software, and train your staff." },
  { icon: Server, title: "Proactive Management", description: "We don't just walk away. We monitor your systems 24/7 and provide ongoing support to prevent future issues." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(12,166,244,0.25),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Local IT & Cabling Partner in New Jersey, Delaware & Philadelphia
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              ONPRO IT delivers expert structured cabling, network installation, and managed IT
              services for growing businesses. Serving Southern NJ, Central NJ, Delaware, and the
              Philadelphia Metro area.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ConsultationButton href="/contact" variant="primary">
                Schedule a Discovery Call
              </ConsultationButton>
              <ConsultationButton href="/contact" variant="outline-light">
                Contact Us
              </ConsultationButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Managed IT & Integrated Technology Solutions for South Jersey and Philadelphia
            </h2>
            <p className="mt-4 text-gray-600">
              OnPro IT is your dedicated partner for business technology, providing robust managed
              IT services, structured cabling, and network infrastructure. We are proud to work
              alongside our sister company, Elite Smart Home, to offer a complete spectrum of
              technology solutions.
            </p>
            <p className="mt-4 text-gray-600">
              While OnPro IT focuses on keeping your business connected and secure, Elite Smart
              Home delivers premier automation, audio-video, and smart technology integration for
              modern living and working spaces. Together, we are one technology group committed
              to excellence in South Jersey and the Philadelphia Metro area.
            </p>
            <a
              href="https://elitesmarthome.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              Visit Elite Smart Home
            </a>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-10 text-center shadow-sm">
            <Award className="h-12 w-12 text-brand" />
            <p className="text-lg font-semibold text-gray-900">One Technology Group</p>
            <p className="text-sm text-gray-600">
              ONPRO IT + Elite Smart Home — commercial IT and residential smart technology, under
              one local partnership.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Why Choose ONPRO IT for Cabling & Support?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-gray-600">
            We are the premier choice for structured cabling services and IT support in New
            Jersey, Delaware, and Philadelphia. We provide the dedicated attention and customized
            solutions your organization needs to thrive.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="rounded-xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Comprehensive IT & Cabling Services
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-gray-600">
            From structured cabling and network installation to cloud solutions, we offer complete
            IT support right-sized for businesses in NJ, DE, and PA.
          </p>

          <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-brand/20 bg-brand/5 p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              A Business Technology Partner Beyond Traditional IT
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              We aren&apos;t just fix-it technicians; we are strategic partners in your success.
              Our approach goes beyond traditional break-fix IT. We proactively manage your
              infrastructure, design resilient networks, and implement forward-thinking security
              strategies. By combining deep technical expertise with a business-first mindset, we
              ensure your technology drives efficiency, productivity, and growth.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICE_CARDS.map((s) => (
              <ServiceCard key={s.href} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand">
            Getting Started
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
            Our New Client Onboarding Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            We make switching IT providers or starting a new project simple, transparent, and
            stress-free.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ONBOARDING_STEPS.map((step, i) => (
              <div key={step.title} className="relative rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Managed IT Services in Your Area
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            We provide specialized, high-touch managed IT and cybersecurity services tailored for
            local businesses across the region. Explore our localized service offerings.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {SERVICE_AREAS.filter((a) => !a.title.includes("Cabling")).map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand"
              >
                {area.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-brand to-brand-dark py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Upgrade Your Network Infrastructure?</h2>
          <p className="mt-4 text-lg text-white/90">
            Let&apos;s discuss how our structured cabling and local managed IT services can help
            your business thrive. Schedule a free consultation today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ConsultationButton href="/contact" variant="outline-light">
              Schedule a Call
            </ConsultationButton>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 font-semibold text-brand hover:bg-gray-100"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
