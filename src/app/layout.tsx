import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ADDRESS, EMAIL, PHONE_HREF, SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Managed IT Services Southern NJ & Philadelphia | ONPRO IT",
    template: "%s",
  },
  description:
    "ONPRO IT provides managed IT services, structured cabling, cybersecurity, and smart home integration for businesses in Southern NJ, Philadelphia, and Delaware.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ca6f4",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ONPRO IT",
  telephone: `+1-${PHONE_HREF.slice(2, 5)}-${PHONE_HREF.slice(5, 8)}-${PHONE_HREF.slice(8)}`,
  email: EMAIL,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.state,
    postalCode: ADDRESS.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 39.8185,
    longitude: -74.9345,
  },
  areaServed: [
    "Southern New Jersey",
    "Philadelphia PA",
    "Delaware",
    "Cherry Hill NJ",
    "Marlton NJ",
    "Voorhees NJ",
    "Mount Laurel NJ",
    "Moorestown NJ",
    "West Berlin NJ",
    "Medford NJ",
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  priceRange: "$$",
  sameAs: [
    "https://www.facebook.com/onproit",
    "https://www.linkedin.com/company/onproit",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
