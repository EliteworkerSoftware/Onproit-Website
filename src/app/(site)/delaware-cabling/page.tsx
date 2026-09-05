import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { getLocationByPath } from "@/lib/locations-data";
import { SITE_URL } from "@/lib/constants";

const location = getLocationByPath("delaware-cabling")!;

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  keywords: location.keywords,
  openGraph: {
    title: location.metaTitle,
    description: location.metaDescription,
    url: `${SITE_URL}/${location.path}`,
    siteName: "ONPRO IT",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/${location.path}`,
  },
};

export default function DelawareCablingPage() {
  return <LocationPageTemplate location={location} />;
}
