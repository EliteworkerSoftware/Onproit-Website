import {
  Briefcase,
  Cloud,
  HardDrive,
  type LucideIcon,
  Network,
  PhoneCall,
  Server,
  ShieldCheck,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "managed services": Server,
  "managed it": Server,
  security: ShieldCheck,
  infrastructure: Network,
  network: Network,
  cloud: Cloud,
  voip: PhoneCall,
  backup: HardDrive,
  consulting: Briefcase,
};

export function getCategoryIcon(category: string | null): LucideIcon {
  if (!category) return Server;
  return CATEGORY_ICONS[category.toLowerCase()] ?? Server;
}

// Mirrors the per-service colors used on /services — same hues, same
// mapping — so a "Cloud" article and the Cloud Solutions page read as the
// same topic. A translucent wash over the shared dark gradient, not a bold
// opaque fill, so the thumbnails stay in the site's dark palette instead of
// turning into a rainbow of solid colors. Full literal classes so Tailwind's
// scanner picks them up.
const CATEGORY_TINT: Record<string, string> = {
  "managed services": "bg-blue-500/30",
  "managed it": "bg-blue-500/30",
  security: "bg-red-500/30",
  infrastructure: "bg-teal-500/30",
  network: "bg-teal-500/30",
  cloud: "bg-indigo-500/30",
  voip: "bg-green-500/30",
  backup: "bg-emerald-500/30",
  consulting: "bg-violet-500/30",
};

export function getCategoryTintClass(category: string | null): string {
  if (!category) return "";
  return CATEGORY_TINT[category.toLowerCase()] ?? "";
}
