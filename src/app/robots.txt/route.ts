import { SITE_URL } from "@/lib/constants";

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /company-dashboard/
Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
