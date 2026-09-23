"use client";

import { useEffect, useState } from "react";
import { ChevronDown, FileText, Send, Trash2 } from "lucide-react";

interface BlogDraft {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  created_at: string;
}

function wordCount(html: string | null) {
  if (!html) return 0;
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

// Same body styling as the public post page, so the preview is what readers get.
const POST_BODY_CLASSES =
  "space-y-4 leading-relaxed text-gray-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:font-medium [&_a]:text-brand [&_a]:underline";

export default function BlogDraftsPanel() {
  const [drafts, setDrafts] = useState<BlogDraft[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [published, setPublished] = useState<{ title: string; url: string } | null>(null);

  async function fetchDrafts() {
    const res = await fetch("/api/admin/blog-drafts");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load drafts");
    return data.drafts as BlogDraft[];
  }

  async function load() {
    try {
      setDrafts(await fetchDrafts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drafts");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchDrafts();
        if (cancelled) return;
        setDrafts(list);
        // Email links point at #draft-<id> — open that one.
        const hashId = window.location.hash.replace("#draft-", "");
        if (hashId && list.some((d) => d.id === hashId)) setOpenId(hashId);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load drafts");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function publish(draft: BlogDraft) {
    if (!confirm(`Publish "${draft.title}" to the blog now?`)) return;
    setBusyId(draft.id);
    setError("");
    const res = await fetch(`/api/admin/blog-drafts/${draft.id}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setError(data.error || "Failed to publish");
      return;
    }
    setPublished({ title: draft.title, url: data.url });
    load();
  }

  async function remove(draft: BlogDraft) {
    if (!confirm(`Delete the draft "${draft.title}"? Its keyword goes back into the queue.`)) return;
    setBusyId(draft.id);
    await fetch(`/api/admin/blog-drafts/${draft.id}`, { method: "DELETE" });
    setBusyId(null);
    load();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Blog posts</h2>
      <p className="mt-1 text-sm text-gray-500">
        Articles the content agent wrote for question-style keywords. Nothing is on the site until you publish it.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {published && (
        <p className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Published &ldquo;{published.title}&rdquo; &mdash;{" "}
          <a href={published.url} target="_blank" rel="noopener noreferrer" className="font-medium underline">
            view it live
          </a>
          . It can take up to an hour to appear on the blog index.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {!drafts ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : drafts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">No blog drafts waiting</p>
            <p className="mt-1 text-sm text-gray-500">
              When the content agent writes a post for a queued keyword, it shows up here.
            </p>
          </div>
        ) : (
          drafts.map((d) => {
            const open = openId === d.id;
            return (
              <div key={d.id} id={`draft-${d.id}`} className="scroll-mt-6 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-gray-900">{d.title}</p>
                      {d.category && (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                          {d.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      /blog/{d.slug} · {wordCount(d.content).toLocaleString()} words · written{" "}
                      {new Date(d.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    {d.excerpt && <p className="mt-2 text-sm text-gray-600">{d.excerpt}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => publish(d)}
                      disabled={busyId === d.id}
                      className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      Publish
                    </button>
                    <button
                      onClick={() => remove(d)}
                      disabled={busyId === d.id}
                      className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setOpenId(open ? null : d.id)}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                  {open ? "Hide preview" : "Read the full post"}
                </button>

                {open && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    {/* content is sanitized server-side before it's ever stored */}
                    <div className={POST_BODY_CLASSES} dangerouslySetInnerHTML={{ __html: d.content ?? "" }} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
