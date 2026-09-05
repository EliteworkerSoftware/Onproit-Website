import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { SETTINGS_KEYS, type SiteSettings } from "@/lib/get-settings";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("app_settings").select("key, value").in("key", SETTINGS_KEYS);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body: Partial<SiteSettings> = await req.json();
  const supabase = getSupabaseAdmin();

  const updates = SETTINGS_KEYS.filter((key) => body[key] !== undefined).map((key) =>
    supabase
      .from("app_settings")
      .update({ value: body[key], updated_at: new Date().toISOString() })
      .eq("key", key)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
