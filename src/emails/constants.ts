import { SITE_URL as SITE_URL_CONST } from "@/lib/constants";

// Email images must be absolute URLs — email clients have no concept of a
// relative "current page" to resolve against.
export const SITE_URL = SITE_URL_CONST;

export const COLORS = {
  brand: "#0ca6f4",
  brandDark: "#0b8fd1",
  accent: "#0ca6f4",
  ink: "#111827",
  inkMuted: "#5b6472",
  nav: "#111827",
  paper: "#ffffff",
  paperAlt: "#f8fafc",
  line: "#e3e8f0",
} as const;
