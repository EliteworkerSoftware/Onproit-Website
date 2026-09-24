import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getServiceArea, reclassifyKeywords, saveServiceArea } from "@/lib/service-area";
import { parseAreaList } from "@/lib/keyword-region";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const area = await getServiceArea(getSupabaseAdmin());
  return NextResponse.json({ inArea: area.inArea, outOfArea: area.outOfArea });
}

// Save the service area and immediately re-tag every tracked keyword.
export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  if (typeof body.inArea !== "string" || typeof body.outOfArea !== "string") {
    return NextResponse.json({ error: "inArea and outOfArea are required" }, { status: 400 });
  }

  const area = { inArea: parseAreaList(body.inArea), outOfArea: parseAreaList(body.outOfArea) };
  if (area.inArea.length === 0) {
    return NextResponse.json({ error: "List at least one place you serve" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  try {
    await saveServiceArea(supabase, area);
    const reclassified = await reclassifyKeywords(supabase, area);
    return NextResponse.json({ ok: true, reclassified, ...area });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Save failed" }, { status: 500 });
  }
}
