export const SITE_URL = "https://www.onproit.com";
export const COMPANY_NAME = "ONPRO IT";
export const PHONE_DISPLAY = "856-988-2663";
export const PHONE_HREF = "+18569882663";
export const EMAIL = "gregg@onproit.com";
export const HOURS = "Mon–Fri 9:00 AM – 5:00 PM";
export const HOURS_NOTE = "24/7 emergency support available for managed clients";
export const ADDRESS = {
  street: "127 Haddon Ave.",
  city: "Berlin Township",
  state: "NJ",
  zip: "08091",
};
export const ADDRESS_FULL = `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`;

export const SISTER_COMPANIES = [
  {
    name: "Elite Smart Home",
    url: "https://elitesmarthome.com",
    description: "Smart home automation, audio-video, and lighting control for residential and commercial spaces.",
  },
  {
    name: "Elite Smart Security, LLC",
    url: undefined,
    description: "Security systems, access control, and surveillance for homes and businesses.",
  },
];

export const SERVICES = [
  { title: "Structured Cabling", href: "/services/cabling" },
  { title: "Managed IT Helpdesk", href: "/services/it-support" },
  { title: "Cyber Security", href: "/services/cybersecurity" },
  { title: "Cloud Solutions", href: "/services/cloud" },
  { title: "VoIP Phone Systems", href: "/services/voip" },
  { title: "Network Solutions", href: "/services/network-wifi" },
  { title: "Data Backup & Recovery", href: "/services/backup-recovery" },
  { title: "AV & Conference Rooms", href: "/services/av-integration" },
  { title: "Network AI Security Cameras", href: "/services/security-cameras" },
  { title: "Entry Access Control", href: "/services/entry-access-control" },
  { title: "IT Consulting", href: "/services/consulting" },
  { title: "Managed IT Services", href: "/services/managed-it" },
];

// One link per state we serve — no city-level entries here, so there's no
// arbitrary "why this town and not that one" favoritism. City/town pages
// still exist and are in the sitemap; they're just not in global nav.
export const SERVICE_AREAS = [
  { title: "New Jersey", href: "/managed-it-services-new-jersey" },
  { title: "Pennsylvania", href: "/pennsylvania-cabling" },
  { title: "Delaware", href: "/delaware-cabling" },
];
