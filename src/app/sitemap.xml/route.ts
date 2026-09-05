import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

const pages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/about-us", priority: "0.8", changefreq: "monthly" },
  { url: "/contact", priority: "0.9", changefreq: "monthly" },
  { url: "/services", priority: "0.9", changefreq: "weekly" },
  { url: "/services/managed-it", priority: "0.9", changefreq: "monthly" },
  { url: "/services/it-support", priority: "0.8", changefreq: "monthly" },
  { url: "/services/cybersecurity", priority: "0.8", changefreq: "monthly" },
  { url: "/services/network-wifi", priority: "0.8", changefreq: "monthly" },
  { url: "/services/cloud", priority: "0.8", changefreq: "monthly" },
  { url: "/services/backup-recovery", priority: "0.8", changefreq: "monthly" },
  { url: "/services/cabling", priority: "0.9", changefreq: "monthly" },
  { url: "/services/av-integration", priority: "0.7", changefreq: "monthly" },
  { url: "/services/security-cameras-access-control", priority: "0.7", changefreq: "monthly" },
  { url: "/services/consulting", priority: "0.7", changefreq: "monthly" },
  { url: "/services/voip", priority: "0.7", changefreq: "monthly" },
  { url: "/managed-it-services-new-jersey", priority: "0.9", changefreq: "monthly" },
  { url: "/managed-it-services-cherry-hill-nj", priority: "0.8", changefreq: "monthly" },
  { url: "/managed-it-services-west-berlin-nj", priority: "0.8", changefreq: "monthly" },
  { url: "/new-jersey-cabling", priority: "0.8", changefreq: "monthly" },
  { url: "/pennsylvania-cabling", priority: "0.7", changefreq: "monthly" },
  { url: "/delaware-cabling", priority: "0.7", changefreq: "monthly" },
  { url: "/blog", priority: "0.7", changefreq: "weekly" },
  { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
];

export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  let blogPages: { url: string; priority: string; changefreq: string; lastmod: string }[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString());

    if (data) {
      blogPages = data.map((post) => ({
        url: `/blog/${post.slug}`,
        priority: "0.6",
        changefreq: "monthly",
        lastmod: (post.updated_at ?? post.published_at ?? lastmod).split("T")[0],
      }));
    }
  }

  const allPages = [...pages.map((p) => ({ ...p, lastmod })), ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${p.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
