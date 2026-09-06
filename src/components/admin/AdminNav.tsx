"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ExternalLink, LogOut, User as UserIcon } from "lucide-react";
import clsx from "clsx";
import type { AdminUser } from "@/lib/current-admin";

const NAV_LINKS = [
  { title: "Inquiries", href: "/admin/inquiries" },
  { title: "Analytics", href: "/admin/analytics" },
  { title: "Admin Users", href: "/admin/admin-users" },
  { title: "Settings", href: "/admin/settings" },
];

const POLL_INTERVAL_MS = 30_000;

export default function AdminNav({ admin }: { admin: AdminUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/admin/inquiries/unread-count");
        const data = await res.json();
        if (!cancelled && res.ok) {
          setUnreadCount(data.count);
          document.title = data.count > 0 ? `(${data.count}) ONPRO IT Admin` : "ONPRO IT Admin";
        }
      } catch {
        // ignore transient poll failures
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-dark">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {/* Desktop: logo stays on the left, inline with the nav */}
          <Link href="/admin" className="hidden items-center gap-2 lg:flex">
            <Image src="/images/logo.svg" alt="ONPRO IT" width={140} height={31} className="h-8 w-auto" />
            <span className="text-sm font-semibold uppercase tracking-widest text-white/50">Admin</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  {link.title}
                  {link.title === "Inquiries" && unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile: logo centered with an "Administrator" label beneath it */}
        <Link
          href="/admin"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center lg:hidden"
        >
          <Image src="/images/logo.svg" alt="ONPRO IT" width={140} height={31} className="h-8 w-auto" />
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Administrator
          </span>
        </Link>

        <div className="relative ml-auto flex items-center justify-end gap-3" ref={menuRef}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white sm:flex"
          >
            <ExternalLink className="h-4 w-4" />
            Live Site
          </a>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white/70 hover:bg-white/20"
            aria-label="Account menu"
          >
            {admin.avatar_url ? (
              <Image src={admin.avatar_url} alt="" width={36} height={36} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-5 w-5" />
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-700 bg-slate-800 py-2 shadow-xl">
              <div className="border-b border-gray-700 px-4 py-2">
                <p className="truncate text-sm font-medium text-white">
                  {admin.full_name || "Administrator"}
                </p>
                <p className="truncate text-xs text-white/50">{admin.email}</p>
              </div>
              <Link
                href="/admin/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
              >
                Profile
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white sm:hidden"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Site
              </a>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-1.5 px-4 py-2 text-left text-sm text-red-300 hover:bg-slate-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="flex flex-wrap gap-1 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden">
        {NAV_LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                active ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              )}
            >
              {link.title}
              {link.title === "Inquiries" && unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
