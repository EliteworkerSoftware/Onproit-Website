"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import clsx from "clsx";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/constants";

function trackCallClick(pathname: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathname, event: "call_click" }),
    keepalive: true,
  }).catch(() => {});
}

const SERVICE_LINKS = [
  { title: "Managed IT Services", href: "/services/managed-it" },
  { title: "IT Help Desk", href: "/services/it-support" },
  { title: "Cybersecurity", href: "/services/cybersecurity" },
  { title: "Network & WiFi", href: "/services/network-wifi" },
  { title: "Cloud Solutions", href: "/services/cloud" },
  { title: "Data Backup & Recovery", href: "/services/backup-recovery" },
  { title: "Structured Cabling", href: "/services/cabling" },
  { title: "AV & Conference Rooms", href: "/services/av-integration" },
  { title: "Network AI Security Cameras", href: "/services/security-cameras" },
  { title: "Entry Access Control", href: "/services/entry-access-control" },
  { title: "IT Consulting", href: "/services/consulting" },
  { title: "VoIP Phone Systems", href: "/services/voip" },
];

const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about-us" },
  { title: "Tech Insights", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full bg-dark transition-shadow",
        scrolled && "shadow-md"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/logo.svg" alt="ONPRO IT logo" width={180} height={40} className="h-10 w-auto" priority />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
            >
              Services
              <ChevronDown className="h-4 w-4" />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full w-64 rounded-lg border border-gray-700 bg-slate-800 py-2 shadow-xl">
                {SERVICE_LINKS.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <a
          href={`tel:${PHONE_HREF}`}
          onClick={() => trackCallClick(pathname)}
          className="hidden items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark lg:flex"
        >
          <Phone className="h-4 w-4" />
          Call {PHONE_DISPLAY}
        </a>

        <button
          className="p-2 text-gray-300 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-gray-700 bg-dark px-4 pb-4 lg:hidden">
          <Link
            href="/"
            className="block py-2 text-sm font-medium text-gray-300"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <button
            className="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-300"
            onClick={() => setServicesOpen((v) => !v)}
          >
            Services
            <ChevronDown className={clsx("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
          </button>
          {servicesOpen && (
            <div className="ml-4 border-l border-gray-700 pl-4">
              {SERVICE_LINKS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block py-2 text-sm text-gray-400"
                  onClick={() => setMobileOpen(false)}
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}
          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-gray-300"
              onClick={() => setMobileOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          <a
            href={`tel:${PHONE_HREF}`}
          onClick={() => trackCallClick(pathname)}
            className="mt-3 block rounded-md bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
      )}
    </header>
  );
}
