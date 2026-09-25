import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getBudget, isDataForSeoConfigured } from "@/lib/dataforseo";

// Everything DataForSEO has done: this month's spend against the cap, the
// market volumes are measured in, and every request (newest first).
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isDataForSeoConfigured()) return NextResponse.json({ configured: false });

  const supabase = getSupabaseAdmin();
  const [budget, { data: calls, error }, { data: market }] = await Promise.all([
    getBudget(supabase),
    supabase
      .from("dataforseo_calls")
      .select("id, created_at, kind, trigger, market, keywords_sent, results, cost_usd, ok, detail, sample")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("app_settings").select("value").eq("key", "dataforseo_market").maybeSingle(),
  ]);

  let marketName = "Philadelphia metro (looked up on the next request)";
  try {
    if (market?.value) marketName = JSON.parse(market.value).name;
  } catch {
    // keep the default label
  }

  return NextResponse.json({
    configured: true,
    budget,
    market: marketName,
    calls: error ? [] : calls,
    logMissing: Boolean(error),
  });
}
