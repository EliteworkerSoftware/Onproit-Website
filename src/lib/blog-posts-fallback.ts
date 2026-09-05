import type { BlogPost } from "@/types";

// Emergency fallback only, used if Supabase is unreachable or misconfigured.
// The real onproit Supabase project already has these 9 posts live under
// their real slugs — this is just a safety net so the blog page never shows
// completely empty if the connection fails.
export const BLOG_POSTS_FALLBACK: BlogPost[] = [
  {
    id: "fallback-1",
    title: "Top 5 Benefits of Managed IT Services for Growing Companies",
    slug: "benefits-managed-it-services-small-business",
    excerpt:
      "Why struggle with tech issues when you can focus on your business? Explore how Managed IT Services provide cost savings, 24/7 support, and proactive security for small businesses.",
    content:
      "<p>Why struggle with tech issues when you can focus on your business? Explore how Managed IT Services provide cost savings, 24/7 support, and proactive security for small businesses.</p>",
    category: "Managed Services",
    image_url: null,
    published_at: "2025-12-21T00:00:00Z",
    created_at: "2025-12-21T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-2",
    title: "Essential Cybersecurity Solutions Every Small Business Needs Now",
    slug: "small-business-cybersecurity-solutions",
    excerpt:
      "Cyberattacks on small businesses are rising. Learn about the critical cybersecurity solutions—from MFA to Next-Gen Firewalls—that can protect your sensitive data and reputation.",
    content:
      "<p>Cyberattacks on small businesses are rising. Learn about the critical cybersecurity solutions—from MFA to Next-Gen Firewalls—that can protect your sensitive data and reputation.</p>",
    category: "Security",
    image_url: null,
    published_at: "2025-12-21T00:00:00Z",
    created_at: "2025-12-21T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-3",
    title: "The Ultimate IT Infrastructure Checklist for Small Businesses in 2026",
    slug: "it-infrastructure-checklist-2026",
    excerpt:
      "Is your small business ready for the future? Use this comprehensive checklist to evaluate your IT infrastructure, security, and scalability for 2026 and beyond.",
    content:
      "<p>Is your small business ready for the future? Use this comprehensive checklist to evaluate your IT infrastructure, security, and scalability for 2026 and beyond.</p>",
    category: "Infrastructure",
    image_url: null,
    published_at: "2025-12-21T00:00:00Z",
    created_at: "2025-12-21T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-4",
    title: "Why Cyber Insurance is a Must-Have for Small Businesses in 2026",
    slug: "why-cyber-insurance-is-must-have-2026",
    excerpt:
      "As cyber threats evolve, having a robust defense is not enough. Learn why cyber insurance is becoming a critical safety net for modern businesses.",
    content:
      "<p>As cyber threats evolve, having a robust defense is not enough. Learn why cyber insurance is becoming a critical safety net for modern businesses.</p>",
    category: "Security",
    image_url: null,
    published_at: "2025-12-18T00:00:00Z",
    created_at: "2025-12-18T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-5",
    title: "Top 5 Signs Your Network Infrastructure Needs an Upgrade",
    slug: "top-5-signs-network-needs-upgrade",
    excerpt:
      "Slow internet speeds and frequent disconnects are just the tip of the iceberg. Discover the subtle signs that your network hardware is holding your business back.",
    content:
      "<p>Slow internet speeds and frequent disconnects are just the tip of the iceberg. Discover the subtle signs that your network hardware is holding your business back.</p>",
    category: "Network",
    image_url: null,
    published_at: "2025-12-07T00:00:00Z",
    created_at: "2025-12-07T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-6",
    title: "Cloud Migration: A Step-by-Step Guide for Growing Companies",
    slug: "cloud-migration-guide-growing-companies",
    excerpt:
      "Moving to the cloud doesn't have to be daunting. We break down the migration process into manageable steps for seamless digital transformation.",
    content:
      "<p>Moving to the cloud doesn't have to be daunting. We break down the migration process into manageable steps for seamless digital transformation.</p>",
    category: "Cloud",
    image_url: null,
    published_at: "2025-11-19T00:00:00Z",
    created_at: "2025-11-19T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-7",
    title: "VoIP vs. Traditional Landlines: What's Best for Your Office?",
    slug: "voip-vs-landlines-whats-best",
    excerpt:
      "Still relying on copper wires? Compare the features, costs, and flexibility of VoIP systems against traditional landline setups.",
    content:
      "<p>Still relying on copper wires? Compare the features, costs, and flexibility of VoIP systems against traditional landline setups.</p>",
    category: "VoIP",
    image_url: null,
    published_at: "2025-11-06T00:00:00Z",
    created_at: "2025-11-06T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-8",
    title: "The Hidden Costs of Downtime: How Managed IT Pays for Itself",
    slug: "hidden-costs-of-downtime",
    excerpt:
      "Downtime isn't just about lost sales. It impacts reputation, employee morale, and future opportunities. Learn the true ROI of proactive IT management.",
    content:
      "<p>Downtime isn't just about lost sales. It impacts reputation, employee morale, and future opportunities. Learn the true ROI of proactive IT management.</p>",
    category: "Managed IT",
    image_url: null,
    published_at: "2025-10-22T00:00:00Z",
    created_at: "2025-10-22T00:00:00Z",
    updated_at: null,
  },
  {
    id: "fallback-9",
    title: "Understanding Data Backup: The 3-2-1 Rule Explained",
    slug: "understanding-data-backup-3-2-1",
    excerpt:
      "Data loss can bankrupt a small business. Implement the industry-standard 3-2-1 backup strategy to ensure your data is always recoverable.",
    content:
      "<p>Data loss can bankrupt a small business. Implement the industry-standard 3-2-1 backup strategy to ensure your data is always recoverable.</p>",
    category: "Backup",
    image_url: null,
    published_at: "2025-10-04T00:00:00Z",
    created_at: "2025-10-04T00:00:00Z",
    updated_at: null,
  },
];
