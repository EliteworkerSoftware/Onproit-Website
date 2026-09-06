import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "horizons-cdn.hostinger.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "kvzduxklwnmevzzjswhv.supabase.co" },
    ],
  },
  async redirects() {
    return [
      { source: "/cabling", destination: "/services/cabling", permanent: true },
      { source: "/helpdesk", destination: "/services/it-support", permanent: true },
      { source: "/security", destination: "/services/cybersecurity", permanent: true },
      { source: "/backup", destination: "/services/backup-recovery", permanent: true },
      { source: "/network", destination: "/services/network-wifi", permanent: true },
      { source: "/voip", destination: "/services/voip", permanent: true },
      { source: "/cloud", destination: "/services/cloud", permanent: true },
    ];
  },
};

export default nextConfig;
