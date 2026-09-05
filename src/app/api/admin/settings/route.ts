import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { contact_email, contact_phone, contact_address, hours_weekdays, hours_saturday, hours_sunday } =
    await req.json();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("settings")
    .update({
      contact_email,
      contact_phone,
      contact_address,
      hours_weekdays,
      hours_saturday,
      hours_sunday,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
