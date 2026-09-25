import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { getReviewLink } from "@/lib/review-requests";
import { SITE_URL } from "@/lib/constants";

// The button in a review request email lands here: record the first click
// (so the admin can see who opened the review page), then send them on to
// Google. Unknown tokens still go to Google — a customer should never hit a
// dead end just because a request was deleted.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  if (!isSupabaseAdminConfigured()) return NextResponse.redirect(SITE_URL);

  const { token } = await params;
  const supabase = getSupabaseAdmin();

  if (/^[0-9a-f-]{36}$/i.test(token)) {
    // Business mail filters (e.g. Microsoft 365 Safe Links) open every link
    // within seconds of delivery to scan it — ignore clicks that soon after
    // a send so a scanner doesn't show up as a real customer click.
    const scannerCutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    await supabase
      .from("review_requests")
      .update({ clicked_at: new Date().toISOString() })
      .eq("token", token)
      .is("clicked_at", null)
      .lt("created_at", scannerCutoff)
      .or(`reminder_sent_at.is.null,reminder_sent_at.lt.${scannerCutoff}`);
  }

  const link = await getReviewLink(supabase);
  return NextResponse.redirect(link || SITE_URL, 302);
}
