import ContentPrsPanel from "@/components/admin/ContentPrsPanel";
import BlogDraftsPanel from "@/components/admin/BlogDraftsPanel";

export default function ContentReviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Content Review</h1>
      <p className="mt-1 text-sm text-gray-500">
        Everything the content agent has written for your target keywords. Nothing goes live until you click Publish.
      </p>

      <div className="mt-8 space-y-12">
        <ContentPrsPanel />
        <BlogDraftsPanel />
      </div>
    </div>
  );
}
