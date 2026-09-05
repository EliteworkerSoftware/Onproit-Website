import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/current-admin";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav admin={admin} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="py-6 text-center text-xs text-gray-400">
        ONPRO IT Admin Dashboard &copy; {new Date().getFullYear()} &middot; Secure Environment
      </footer>
    </div>
  );
}
