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
