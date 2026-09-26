"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

const WIDTH = 288;
const MARGIN = 12;

// Plain-English explanation for anything in the admin. Shows on hover (or tap
// on a phone, or keyboard focus). With no children it's a small ⓘ icon; with
// children, hovering that element itself (a button, badge, number) explains it.
export default function InfoTip({
  text,
  children,
  className = "",
}: {
  text: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), 120);
  }

  // Place it under the trigger (above if there's no room), kept on screen.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const tipHeight = tipRef.current?.offsetHeight ?? 80;
    const width = Math.min(WIDTH, window.innerWidth - MARGIN * 2);
    const left = Math.max(MARGIN, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - MARGIN));
    const above = r.bottom + 8 + tipHeight > window.innerHeight && r.top - 8 - tipHeight > 0;
    setPos({ top: above ? r.top - 8 - tipHeight : r.bottom + 8, left, above });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hideSoon}
        onFocus={show}
        onBlur={hideSoon}
        className={children ? `inline-flex ${className}` : `inline-flex align-middle ${className}`}
      >
        {children ?? (
          // A span, not a <button>, so the icon can sit inside buttons, links,
          // and labels without invalid nesting (and without triggering them).
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            aria-label="What does this mean?"
            className="flex cursor-help items-center justify-center text-gray-400 hover:text-brand"
          >
            <Info className="h-3.5 w-3.5" />
          </span>
        )}
      </span>
      {open &&
        createPortal(
          <span
            ref={tipRef}
            role="tooltip"
            onMouseEnter={show}
            onMouseLeave={hideSoon}
            style={{
              position: "fixed",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              width: Math.min(WIDTH, typeof window === "undefined" ? WIDTH : window.innerWidth - MARGIN * 2),
            }}
            className="z-[100] block rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-white shadow-lg"
          >
            {text}
          </span>,
          document.body
        )}
    </>
  );
}
