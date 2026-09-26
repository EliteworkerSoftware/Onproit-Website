import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { revisionChanges, type Revision } from "@/lib/content-revisions";

// Exactly what one "Request changes" revision changed, as readable
// removed/added lines, for the "See what changed" link on Content Review.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { data, error } = await getSupabaseAdmin().from("content_revisions").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Revision not found" }, { status: 404 });

  try {
    return NextResponse.json({ changes: await revisionChanges(data as Revision) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Couldn't load the changes" }, { status: 502 });
  }
}
