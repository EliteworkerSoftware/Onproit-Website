import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SERVICES, SERVICE_AREAS, SISTER_COMPANIES } from "@/lib/constants";
import { getSettings } from "@/lib/get-settings";

export default async function Footer() {
  const settings = await getSettings();
  const phoneHref = settings.contact_phone.replace(/[^0-9+]/g, "");
  const hours = `Mon–Fri ${settings.hours_weekdays}`;

  return (
    <footer className="bg-dark text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/images/logo.svg"
              alt="ONPRO IT logo"
              width={180}
              height={40}
              className="mb-4 h-10 w-auto"
            />
            <p className="mb-4 text-sm text-gray-400">
              Professional managed IT services, structured cabling, and network installation for
              growing businesses. Serving New Jersey, Delaware, and Philadelphia.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{settings.contact_address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <a href={`tel:${phoneHref}`} className="hover:text-white">
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-white">
                  {settings.contact_email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-brand" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Service Areas</h3>
            <ul className="space-y-2 text-sm">
              {SERVICE_AREAS.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="hover:text-white">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Sister Company</h3>
            <ul className="space-y-2 text-sm">
              {SISTER_COMPANIES.map((c) => (
                <li key={c.url}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ONPRO IT. All rights reserved.</p>
          <Link href="/privacy-policy" className="hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
