import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/constants";

// The static part of the sitemap — shared with the cron job that pings
// IndexNow/Google so the two never drift apart into two different URL lists.
export const STATIC_PAGES = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/about-us", priority: "0.8", changefreq: "monthly" },
  { url: "/contact", priority: "0.9", changefreq: "monthly" },
  { url: "/services", priority: "0.9", changefreq: "weekly" },
  { url: "/services/managed-it", priority: "0.9", changefreq: "monthly" },
  { url: "/services/it-support", priority: "0.8", changefreq: "monthly" },
  { url: "/services/cybersecurity", priority: "0.8", changefreq: "monthly" },
  { url: "/services/network-wifi", priority: "0.8", changefreq: "monthly" },
  { url: "/services/cloud", priority: "0.8", changefreq: "monthly" },
  { url: "/services/ai-integration", priority: "0.8", changefreq: "monthly" },
  { url: "/services/backup-recovery", priority: "0.8", changefreq: "monthly" },
  { url: "/services/cabling", priority: "0.9", changefreq: "monthly" },
  { url: "/services/av-integration", priority: "0.7", changefreq: "monthly" },
  { url: "/services/security-cameras", priority: "0.7", changefreq: "monthly" },
  { url: "/services/entry-access-control", priority: "0.7", changefreq: "monthly" },
  { url: "/services/consulting", priority: "0.7", changefreq: "monthly" },
  { url: "/services/voip", priority: "0.7", changefreq: "monthly" },
  { url: "/managed-it-services-new-jersey", priority: "0.9", changefreq: "monthly" },
  { url: "/managed-it-services-cherry-hill-nj", priority: "0.8", changefreq: "monthly" },
  { url: "/managed-it-services-west-berlin-nj", priority: "0.8", changefreq: "monthly" },
  { url: "/managed-it-services-mount-laurel-nj", priority: "0.7", changefreq: "monthly" },
  { url: "/managed-it-services-voorhees-nj", priority: "0.7", changefreq: "monthly" },
  { url: "/managed-it-services-marlton-nj", priority: "0.7", changefreq: "monthly" },
  { url: "/managed-it-services-king-of-prussia-pa", priority: "0.7", changefreq: "monthly" },
  { url: "/managed-it-services-wilmington-de", priority: "0.7", changefreq: "monthly" },
  { url: "/new-jersey-cabling", priority: "0.8", changefreq: "monthly" },
  { url: "/pennsylvania-cabling", priority: "0.7", changefreq: "monthly" },
  { url: "/delaware-cabling", priority: "0.7", changefreq: "monthly" },
  { url: "/service-areas", priority: "0.8", changefreq: "weekly" },
  { url: "/blog", priority: "0.7", changefreq: "weekly" },
  { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
];

export async function getBlogPostPaths(): Promise<string[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString());

  return (data ?? []).map((post) => `/blog/${post.slug}`);
}

export async function getAllSiteUrls(): Promise<string[]> {
  const blogPaths = await getBlogPostPaths();
  const paths = [...STATIC_PAGES.map((p) => p.url), ...blogPaths];
  return paths.map((path) => `${SITE_URL}${path}`);
}
