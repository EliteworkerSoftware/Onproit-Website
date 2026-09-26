import ContentPrsPanel from "@/components/admin/ContentPrsPanel";
import BlogDraftsPanel from "@/components/admin/BlogDraftsPanel";
import InfoTip from "@/components/admin/InfoTip";

export default function ContentReviewPage() {
  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        Content Review
        <InfoTip text={"The content agent writes pages and blog posts for the keywords you queue on Analytics (it runs every morning). Everything lands here first. Read it, request changes if anything's wrong, then Publish to put it on the live site, or Reject/Delete to throw it out. You get an email when something new is waiting."} />
      </h1>
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
