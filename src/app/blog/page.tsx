import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BLOG_POSTS_FALLBACK } from "@/lib/blog-posts-fallback";
import type { BlogPost } from "@/types";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tech Insights & Resources | ONPRO IT",
  description:
    "Expert guidance on managed IT services, cybersecurity, cloud solutions, and technology best practices for businesses in Southern NJ, Philadelphia, and Delaware.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

async function getPosts(): Promise<BlogPost[]> {
  if (!supabase) return BLOG_POSTS_FALLBACK;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return BLOG_POSTS_FALLBACK;
  return data as BlogPost[];
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">Tech Insights & Resources</h1>
        <p className="mt-4 max-w-2xl text-gray-600">
          Expert guidance on managed IT services, cybersecurity, cloud solutions, and technology
          best practices.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-gray-500">
            New articles are coming soon. Check back shortly, or{" "}
            <Link href="/contact" className="text-brand hover:underline">
              contact us
            </Link>{" "}
            with any questions in the meantime.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col rounded-xl border border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                {post.category && (
                  <span className="mb-2 inline-block w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                    {post.category}
                  </span>
                )}
                <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>}
                {post.published_at && (
                  <p className="mt-4 text-xs text-gray-400">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
