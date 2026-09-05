"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ExternalLink, LogOut } from "lucide-react";
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

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-dark">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/images/logo.svg" alt="ONPRO IT" width={140} height={31} className="h-8 w-auto" />
            <span className="text-sm font-semibold uppercase tracking-widest text-white/50">
              Admin
            </span>
          </Link>
          <nav className="hidden flex-wrap items-center gap-1 lg:flex">
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

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white sm:flex"
          >
            <ExternalLink className="h-4 w-4" />
            Live Site
          </a>
          <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 sm:inline">
            {admin.email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
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
