import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Cable,
  Camera,
  KeyRound,
  Clock,
  Cloud,
  HardDrive,
  Headphones,
  Network,
  PhoneCall,
  Presentation,
  ShieldCheck,
  Briefcase,
  Server,
  ClipboardList,
  Sparkles,
  Wrench,
} from "lucide-react";
import ConsultationButton from "@/components/ConsultationButton";
import ServiceCard from "@/components/ServiceCard";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/constants";
import { PLATFORM_ECOSYSTEMS } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Managed IT Services Southern NJ & Philadelphia | ONPRO IT",
  description:
    "ONPRO IT designs, installs, and manages complete business technology environments — managed IT, structured cabling, VoIP, AV, and cybersecurity — for businesses in Southern NJ, Philadelphia, and Delaware.",
  keywords:
    "managed IT services NJ, IT support Southern NJ, structured cabling NJ, cybersecurity NJ, managed IT Philadelphia, MSP New Jersey, one-stop IT and cabling company",
  openGraph: {
    title: "Managed IT Services Southern NJ & Philadelphia | ONPRO IT",
    description:
      "ONPRO IT designs, installs, and manages complete business technology environments for businesses in Southern NJ, Philadelphia, and Delaware.",
    url: "https://www.onproit.com/",
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: "https://www.onproit.com/",
  },
};

const DIFFERENTIATOR_STEPS = [
  {
    title: "Design",
    description:
      "We map out your network, phone system, security, and cloud setup as one connected plan — not a patchwork from five different vendors.",
  },
  {
    title: "Install",
    description:
      "Our own technicians — not subcontractors — run the cabling, mount the hardware, and configure every system before we hand you the keys.",
  },
  {
    title: "Manage",
    description:
      "Once it's live, we don't disappear. Our help desk and security team monitor and support everything we built.",
  },
];

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
    title: "One Reliable Partner",
    description:
      "Cabling, networking, VoIP, and IT support — one team, one phone number, one invoice. No more juggling vendors.",
  },
];

const FEATURED_SERVICES = [
  {
    title: "Managed IT Services",
    description:
      "24/7 monitoring, unlimited help desk support, and strategic planning for the systems we build — billed at one flat monthly rate.",
    href: "/services/managed-it",
    Icon: Server,
    image: "/images/hero-managed-it.png",
  },
  {
    title: "Structured Cabling",
    description:
      "Professional Cat6, fiber optic, and low-voltage wiring installed neat, organized, and built to support everything that runs on top of it.",
    href: "/services/cabling",
    Icon: Cable,
    image: "/images/hero-cabling.png",
  },
];

const SERVICE_CARDS = [
  { title: "IT Help Desk", description: "Round-the-clock remote support for email, software, passwords, and every device your team relies on.", href: "/services/it-support", Icon: Headphones },
  { title: "Cyber Security", description: "Comprehensive cybersecurity and security camera wiring to protect your organization.", href: "/services/cybersecurity", Icon: ShieldCheck },
  { title: "Cloud Solutions", description: "Seamless cloud migration and management for Microsoft 365 and Google Workspace.", href: "/services/cloud", Icon: Cloud },
  { title: "AI Integration & Automation", description: "Copilot, Claude, ChatGPT, and workflow automation — the right AI tools for your business, deployed by a team that uses them internally.", href: "/services/ai-integration", Icon: Sparkles },
  { title: "VoIP Phone Systems", description: "Modern business telephony solutions to keep your team connected anywhere.", href: "/services/voip", Icon: PhoneCall },
  { title: "Network Solutions", description: "Complete network design, WiFi setup, and infrastructure management for growing businesses.", href: "/services/network-wifi", Icon: Network },
  { title: "AV & Conference Rooms", description: "Video conferencing, displays, and digital signage installed and integrated with your network.", href: "/services/av-integration", Icon: Presentation },
  { title: "Network AI Security Cameras", description: "AI-powered security cameras installed and managed on the network we already run.", href: "/services/security-cameras", Icon: Camera },
  { title: "Entry Access Control", description: "Keyless entry and access control systems for your building, doors, and multiple locations.", href: "/services/entry-access-control", Icon: KeyRound },
  { title: "Data Backup", description: "Secure disaster recovery and data protection strategies for peace of mind.", href: "/services/backup-recovery", Icon: HardDrive },
  { title: "IT Consulting", description: "Strategic IT planning and budgeting to align technology with your business goals.", href: "/services/consulting", Icon: Briefcase },
];

const ONBOARDING_STEPS = [
  { icon: ClipboardList, title: "Discovery Meeting", description: "We start with a face-to-face or virtual meeting to understand your business goals, pain points, and current IT setup." },
  { icon: Wrench, title: "Custom Proposal", description: "You'll receive a detailed roadmap and quote, outlining exactly how we'll solve your challenges without hidden fees." },
  { icon: Server, title: "Seamless Onboarding", description: "Once approved, our team handles the transition. We install equipment, configure software, and train your staff." },
  { icon: ShieldCheck, title: "Proactive Management", description: "We don't just walk away. We monitor your systems 24/7 and provide ongoing support to prevent future issues." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-dark text-white">
        {/* Full-bleed image: pinned to the true right edge of the viewport, not boxed into the max-w container */}
        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <Image
            src="/images/hero-home-bg.png"
            alt="Managed IT and Network Cabling Services in NJ, DE and PA"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-dark to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="max-w-xl">
            <h1 className="font-bold tracking-tight">
              <span className="block whitespace-nowrap text-4xl sm:text-5xl lg:text-6xl">Business IT</span>
              <span className="mt-2 block text-2xl text-accent sm:text-3xl lg:text-4xl">
                Designed, Installed and Managed
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              ONPRO IT is a full-scale technology partner — we design, install, and manage your IT
              infrastructure for the life of your business. Serving New Jersey, Pennsylvania, and
              Delaware.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ConsultationButton href={`tel:${PHONE_HREF}`} variant="primary">
                Call {PHONE_DISPLAY}
              </ConsultationButton>
              <ConsultationButton href="/contact" variant="outline-light">
                Get a Free Quote
              </ConsultationButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-3 gap-y-2 text-sm text-gray-400">
              <span>In-house technicians</span>
              <span aria-hidden="true">·</span>
              <span>No subcontractors</span>
              <span aria-hidden="true">·</span>
              <span>NJ · PA · DE</span>
            </div>
          </div>
        </div>

        {/* Mobile: full-bleed edge-to-edge image below the text, no side padding */}
        <div className="relative h-72 w-full sm:h-96 lg:hidden">
          <Image
            src="/images/hero-home-bg.png"
            alt="Managed IT and Network Cabling Services in NJ, DE and PA"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-dark to-transparent" />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              How We&apos;re Different
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Everything a Standard IT Company Does — Plus the Integration Side
            </h2>
            <p className="mt-4 text-gray-600">
              A typical IT company manages your email, software, passwords, and devices. We do
              all of that too — and we&apos;re also the technology integrator who designs and
              installs the physical systems those services run on: cabling, networking, AV,
              cameras, and access control. That makes ONPRO IT a genuinely one-stop IT and
              cabling company — every piece of technology your business touches, connected into
              one managed system and supported by one team, beginning to end.
            </p>
          </div>

          <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gray-200 sm:block" />
            {DIFFERENTIATOR_STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-50 py-20">
        <div className="absolute inset-y-0 left-0 hidden w-[38%] lg:block">
          <Image
            src="/images/hero-cabling.png"
            alt="ONPRO IT technician installing structured network cabling"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-72 w-full sm:h-96 lg:hidden">
          <Image
            src="/images/hero-cabling.png"
            alt="ONPRO IT technician installing structured network cabling"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-10 lg:mt-0 lg:ml-auto lg:max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Why Local Businesses Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Fast, Local, and Genuinely One-Stop
            </h2>
            <div className="mt-8 space-y-6">
              {VALUE_PROPS.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <ConsultationButton href="/contact" variant="primary" className="mt-8">
              Get a Free Quote
            </ConsultationButton>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">What We Do</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Every System Your Business Runs On, Under One Roof
            </h2>
            <p className="mt-4 text-gray-600">
              From the network in the walls to the help desk ticket next Tuesday, it&apos;s the
              same team the whole way through — no handoffs, no pointing fingers between vendors.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-gray-50 px-8 py-8">
            <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
              We Set Up and Support Every Major Ecosystem
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {PLATFORM_ECOSYSTEMS.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col items-center gap-3 rounded-xl bg-white px-4 py-6 shadow-sm"
                >
                  <Image src={p.logo} alt={p.name} width={40} height={40} className="h-10 w-10 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {FEATURED_SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group relative flex min-h-70 flex-col justify-end overflow-hidden rounded-2xl p-8 text-white shadow-xl"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-dark via-dark/70 to-dark/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-white">
                    <s.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 max-w-md text-sm text-gray-200">{s.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
            Switching IT Providers, Without the Headache
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            We make switching IT providers or starting a new project simple, transparent, and
            stress-free.
          </p>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {ONBOARDING_STEPS.map((step, i) => (
              <div key={step.title} className="relative border-l-2 border-brand/20 pl-6">
                <span className="absolute -left-1.25 top-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <span className="text-xs font-bold uppercase tracking-wide text-brand">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-linear-to-br/oklch from-brand-dark to-sky-300 py-20 text-white">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Stop Juggling Vendors?</h2>
          <p className="mt-4 text-lg text-white/90">
            Tell us what you&apos;re building — or what&apos;s broken — and we&apos;ll design,
            install, and manage the fix. Free consultation, no obligation.
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
