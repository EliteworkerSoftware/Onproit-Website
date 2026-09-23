import { SITE_URL } from "@/lib/constants";

// Categories the blog already uses — each maps to an icon and tint in
// blog-category-icon.ts and a CTA on the post page.
export const BLOG_CATEGORIES = [
  "Managed IT",
  "Managed Services",
  "Security",
  "Network",
  "Infrastructure",
  "Cloud",
  "Backup",
  "VoIP",
  "Consulting",
] as const;

// Where a draft is reviewed. Also stored as the keyword's content_url while
// the draft is pending, which is how publishing finds the keyword to close.
export function draftReviewUrl(draftId: string) {
  return `${SITE_URL}/admin/content-review#draft-${draftId}`;
}
