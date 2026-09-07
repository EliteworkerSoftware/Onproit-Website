"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import clsx from "clsx";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/constants";
import { SERVICE_COLOR_BADGE, SERVICES_DATA } from "@/lib/services-data";

const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "Tech Insights", href: "/blog" },
  { title: "About Us", href: "/about-us" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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
        {/* Invisible spacer matching the hamburger button's footprint, so the
            logo lands visually centered on mobile via justify-between symmetry. */}
        <div className="p-2 lg:hidden" aria-hidden="true">
          <div className="h-6 w-6" />
        </div>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/logo.svg" alt="ONPRO IT logo" width={144} height={32} className="h-8 w-auto" priority />
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
            <Link
              href="/services"
              className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white"
              aria-expanded={servicesOpen}
            >
              Services
              <ChevronDown className={clsx("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
            </Link>

            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                <div className="grid grid-cols-1 gap-1 rounded-xl border border-gray-700 bg-slate-800 p-3 shadow-xl">
                  {SERVICES_DATA.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                    >
                      <span
                        className={clsx(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors group-hover:text-white",
                          SERVICE_COLOR_BADGE[s.color]
                        )}
                      >
                        <s.Icon className="h-3.5 w-3.5" />
                      </span>
                      {s.navTitle}
                    </Link>
                  ))}
                </div>
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

          <div className="flex items-center justify-between">
            <Link
              href="/services"
              className="block flex-1 py-2 text-sm font-medium text-gray-300"
              onClick={() => setMobileOpen(false)}
            >
              Services
            </Link>
            <button
              className="p-2 text-gray-300"
              onClick={() => setMobileServicesOpen((v) => !v)}
              aria-expanded={mobileServicesOpen}
              aria-label="Toggle services submenu"
            >
              <ChevronDown className={clsx("h-4 w-4 transition-transform", mobileServicesOpen && "rotate-180")} />
            </button>
          </div>
          {mobileServicesOpen && (
            <div className="ml-2 space-y-1 border-l border-gray-700 pl-4">
              {SERVICES_DATA.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-3 py-2 text-sm text-gray-400"
                  onClick={() => setMobileOpen(false)}
                >
                  <span
                    className={clsx(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors group-hover:text-white",
                      SERVICE_COLOR_BADGE[s.color]
                    )}
                  >
                    <s.Icon className="h-3 w-3" />
                  </span>
                  {s.navTitle}
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
            className="mt-3 block rounded-md bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
      )}
    </header>
  );
}
