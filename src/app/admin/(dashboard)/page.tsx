import Link from "next/link";
import { Inbox, Shield, Settings } from "lucide-react";
import { getCurrentAdmin } from "@/lib/current-admin";

const CARDS = [
  { title: "Inquiries", description: "Contact form messages, inbox and archived.", href: "/admin/inquiries", Icon: Inbox },
  { title: "Admin Users", description: "Manage who can access this dashboard.", href: "/admin/admin-users", Icon: Shield },
  { title: "Settings", description: "Public contact info and business hours.", href: "/admin/settings", Icon: Settings },
];

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back{admin?.full_name ? `, ${admin.full_name}` : ""}</h1>
      <p className="mt-1 text-sm text-gray-500">Manage the ONPRO IT website from here.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <card.Icon className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">{card.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
