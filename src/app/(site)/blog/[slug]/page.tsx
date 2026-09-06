import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BLOG_POSTS_FALLBACK } from "@/lib/blog-posts-fallback";
import BlogThumbnail from "@/components/BlogThumbnail";
import ConsultationButton from "@/components/ConsultationButton";
import type { BlogPost } from "@/types";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

interface CategoryCta {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

const DEFAULT_CTA: CategoryCta = {
  heading: "Ready to Stop Juggling Vendors?",
  body: "Tell us what you're building — or what's broken — and we'll design, install, and manage the fix. Free consultation, no obligation.",
  ctaLabel: "Get a Free Quote",
  ctaHref: "/contact",
};

const CATEGORY_CTAS: Record<string, CategoryCta> = {
  "Managed Services": {
    heading: "Tired of Guessing What Your IT Actually Costs?",
    body: "Get a flat, predictable quote for managed IT support — no surprise invoices, no vague line items.",
    ctaLabel: "Get a Free Quote",
    ctaHref: "/contact",
  },
  "Managed IT": {
    heading: "One Team for Your Network, Cabling, and Support",
    body: "Stop juggling vendors. We design, install, and manage your IT as a single connected system.",
    ctaLabel: "Get a Free Quote",
    ctaHref: "/contact",
  },
  Infrastructure: {
    heading: "Is Your IT Infrastructure Ready for What's Next?",
    body: "From network hardware to backup power, we'll assess your setup and show you exactly what needs attention.",
    ctaLabel: "Get a Free Assessment",
    ctaHref: "/contact",
  },
  Security: {
    heading: "Don't Wait for a Breach to Take Security Seriously",
    body: "MFA, next-gen firewalls, EDR, employee training — we'll build the right defense for your business.",
    ctaLabel: "Get a Security Review",
    ctaHref: "/services/cybersecurity",
  },
  Network: {
    heading: "Is Outdated Network Hardware Slowing You Down?",
    body: "We'll evaluate your switches, access points, and cabling, and tell you what actually needs replacing.",
    ctaLabel: "Get a Network Assessment",
    ctaHref: "/services/network-wifi",
  },
  Cloud: {
    heading: "Ready to Move to the Cloud the Right Way?",
    body: "We'll help you plan a migration that doesn't disrupt your business — or your budget.",
    ctaLabel: "Get a Cloud Consultation",
    ctaHref: "/services/cloud",
  },
  VoIP: {
    heading: "Still Paying for a Phone System You Don't Love?",
    body: "See what a modern VoIP setup — installed and supported by the same team managing your network — actually costs.",
    ctaLabel: "Get a VoIP Quote",
    ctaHref: "/services/voip",
  },
  Backup: {
    heading: "Could Your Business Survive a Total Data Loss?",
    body: "We'll check your backups against the 3-2-1 rule and close any gaps before disaster strikes.",
    ctaLabel: "Get a Backup Review",
    ctaHref: "/services/backup-recovery",
  },
};

function getCategoryCta(category: string | null): CategoryCta {
  if (!category) return DEFAULT_CTA;
  return CATEGORY_CTAS[category] ?? DEFAULT_CTA;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .single();

    if (!error && data) return data as BlogPost;
  }

  return BLOG_POSTS_FALLBACK.find((post) => post.slug === slug) ?? null;
}

export async function generateStaticParams() {
  if (supabase) {
    const { data } = await supabase
      .from("blog_posts")
      .select("slug")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString());
    if (data && data.length > 0) {
      return data.map((post) => ({ slug: post.slug as string }));
    }
  }

  return BLOG_POSTS_FALLBACK.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found | ONPRO IT" };

  return {
    title: `${post.title} | ONPRO IT Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: "ONPRO IT",
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: ["ONPRO IT Team"],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const cta = getCategoryCta(post.category);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    author: { "@type": "Organization", name: "ONPRO IT" },
    datePublished: post.published_at ?? post.created_at,
    publisher: { "@type": "Organization", name: "ONPRO IT" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {post.category && (
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              {post.category}
            </span>
          )}
          <h1 className="mt-4 text-4xl font-bold text-gray-900">{post.title}</h1>
          {post.published_at && (
            <p className="mt-2 text-sm text-gray-500">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <div className="mt-6 overflow-hidden rounded-xl">
            <BlogThumbnail category={post.category} className="h-72" />
          </div>
          <div
            className="mt-8 max-w-none space-y-4 leading-relaxed text-gray-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/30 [&_a]:underline-offset-2 [&_a]:hover:decoration-brand"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />

          <div className="mt-10 rounded-2xl bg-brand p-8 text-center text-white">
            <h2 className="text-xl font-bold">{cta.heading}</h2>
            <p className="mt-2 text-sm text-white/90">{cta.body}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ConsultationButton href={`tel:${PHONE_HREF}`} variant="accent">
                Call {PHONE_DISPLAY}
              </ConsultationButton>
              <ConsultationButton href={cta.ctaHref} variant="outline-light">
                {cta.ctaLabel}
              </ConsultationButton>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
