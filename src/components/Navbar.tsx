"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import clsx from "clsx";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/constants";

const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "About Us", href: "/about-us" },
  { title: "Tech Insights", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {NAV_LINKS.map((link) => (
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
          {NAV_LINKS.map((link) => (
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
