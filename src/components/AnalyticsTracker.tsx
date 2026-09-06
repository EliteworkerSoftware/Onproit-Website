"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("onpro_session_id");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("onpro_session_id", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

function sendBeaconJson(url: string, data: unknown) {
  try {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    if (navigator.sendBeacon(url, blob)) return;
  } catch {
    // fall through to fetch
  }
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {});
}

function describeClickTarget(el: Element): { label: string; href: string | null } | null {
  const clickable = el.closest("a, button, [role='button']");
  if (!clickable) return null;

  const href = clickable instanceof HTMLAnchorElement ? clickable.getAttribute("href") : null;
  const ariaLabel = clickable.getAttribute("aria-label");
  const text = clickable.textContent?.trim().replace(/\s+/g, " ").slice(0, 120);
  const label = ariaLabel || text || href || "(unlabeled element)";

  return { label, href };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);
  const currentView = useRef<{ id: string; enteredAt: number } | null>(null);

  useEffect(() => {
    const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    if (lastTracked.current === fullPath) return;
    lastTracked.current = fullPath;

    // Record duration for the page being left before tracking the new one.
    if (currentView.current) {
      const { id, enteredAt } = currentView.current;
      sendBeaconJson("/api/track/duration", { id, duration: (Date.now() - enteredAt) / 1000 });
      currentView.current = null;
    }

    const sessionId = getSessionId();

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: fullPath, referrer: document.referrer || null, sessionId }),
      keepalive: true,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.id) {
          currentView.current = { id: json.id, enteredAt: Date.now() };
        }
      })
      .catch(() => {});
  }, [pathname, searchParams]);

  // Flush duration when the tab is hidden/closed, since a route change won't
  // fire for the very last page of the visit.
  useEffect(() => {
    const flush = () => {
      if (!currentView.current) return;
      const { id, enteredAt } = currentView.current;
      sendBeaconJson("/api/track/duration", { id, duration: (Date.now() - enteredAt) / 1000 });
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  // Universal click tracking: every link/button click site-wide, tagged by
  // its visible label. tel: links are tagged call_click to keep feeding the
  // existing "Call Button Clicks" metric; everything else is a generic click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const target = describeClickTarget(e.target);
      if (!target) return;

      const isTel = target.href?.startsWith("tel:") ?? false;
      const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: fullPath,
          sessionId: getSessionId(),
          event: isTel ? "call_click" : "click",
          clickLabel: target.label,
          clickHref: target.href,
        }),
        keepalive: true,
      }).catch(() => {});
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, searchParams]);

  return null;
}
