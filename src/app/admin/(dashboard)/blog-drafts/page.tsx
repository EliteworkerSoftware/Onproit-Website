import { redirect } from "next/navigation";

// Blog drafts now live on the combined Content Review page.
export default function BlogDraftsRedirect() {
  redirect("/admin/content-review");
}
