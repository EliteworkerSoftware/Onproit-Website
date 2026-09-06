"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface ConsultationButtonProps {
  href?: string;
  variant?: "primary" | "outline" | "outline-light" | "accent";
  className?: string;
  children: React.ReactNode;
}

export default function ConsultationButton({
  href = "/contact",
  variant = "primary",
  className,
  children,
}: ConsultationButtonProps) {
  const pathname = usePathname();

  function handleClick() {
    if (!href.startsWith("tel:")) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, event: "call_click" }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold transition-colors",
        variant === "primary" &&
          "bg-brand text-white hover:bg-brand-dark",
        variant === "accent" &&
          "bg-accent text-white hover:bg-accent-dark",
        variant === "outline" &&
          "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
        variant === "outline-light" &&
          "border-2 border-white text-white hover:bg-white hover:text-dark",
        className
      )}
    >
      {children}
    </Link>
  );
}
