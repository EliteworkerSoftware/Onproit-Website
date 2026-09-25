import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isGoogleReviewLink, saveReviewLink } from "@/lib/review-requests";

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { link } = await req.json().catch(() => ({}));
  const value = typeof link === "string" ? link.trim() : "";
  if (!isGoogleReviewLink(value)) {
    return NextResponse.json(
      { error: "That doesn't look like a Google review link — it should start with https://g.page/ or https://search.google.com/" },
      { status: 400 }
    );
  }

  try {
    await saveReviewLink(getSupabaseAdmin(), value);
    return NextResponse.json({ ok: true, link: value });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Save failed" }, { status: 500 });
  }
}
