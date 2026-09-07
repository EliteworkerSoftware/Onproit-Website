import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { SERVICE_COLOR_BADGE, type ServiceColor } from "@/lib/services-data";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  color?: ServiceColor;
}

export default function ServiceCard({ title, description, href, Icon, color }: ServiceCardProps) {
  const colorClasses = color
    ? SERVICE_COLOR_BADGE[color]
    : "bg-accent/10 text-accent group-hover:bg-accent";

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors group-hover:text-white ${colorClasses}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
