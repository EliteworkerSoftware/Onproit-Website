import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/constants";
import { STATIC_PAGES } from "@/lib/site-urls";

export const revalidate = 3600;

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

  const allPages = [...STATIC_PAGES.map((p) => ({ ...p, lastmod })), ...blogPages];

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
