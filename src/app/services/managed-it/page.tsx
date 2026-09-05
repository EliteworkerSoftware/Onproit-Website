import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getServiceBySlug } from "@/lib/services-data";
import { SITE_URL } from "@/lib/constants";

const service = getServiceBySlug("managed-it")!;

export const metadata: Metadata = {
  title: service.metaTitle,
  description: service.metaDescription,
  keywords: service.keywords,
  openGraph: {
    title: service.metaTitle,
    description: service.metaDescription,
    url: `${SITE_URL}/services/${service.slug}`,
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/services/${service.slug}`,
  },
};

export default function ManagedItPage() {
  return <ServicePageTemplate service={service} />;
}
