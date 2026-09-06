import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BLOG_POSTS_FALLBACK } from "@/lib/blog-posts-fallback";
import BlogThumbnail from "@/components/BlogThumbnail";
import ConsultationButton from "@/components/ConsultationButton";
import type { BlogPost } from "@/types";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

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
            <h2 className="text-xl font-bold">Ready to Stop Juggling Vendors?</h2>
            <p className="mt-2 text-sm text-white/90">
              Tell us what you&apos;re building — or what&apos;s broken — and we&apos;ll design,
              install, and manage the fix. Free consultation, no obligation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ConsultationButton href={`tel:${PHONE_HREF}`} variant="accent">
                Call {PHONE_DISPLAY}
              </ConsultationButton>
              <ConsultationButton href="/contact" variant="outline-light">
                Get a Free Quote
              </ConsultationButton>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
