import "server-only";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { ADDRESS_FULL, HOURS, HOURS_NOTE, EMAIL, PHONE_DISPLAY } from "@/lib/constants";

export interface SiteSettings {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
}

const FALLBACK: SiteSettings = {
  contact_email: EMAIL,
  contact_phone: PHONE_DISPLAY,
  contact_address: ADDRESS_FULL,
  hours_weekdays: HOURS.replace("Mon–Fri ", ""),
  hours_saturday: "Closed",
  hours_sunday: "Closed",
};

// Used by public pages (Contact, Footer) — falls back to the static brand
// constants when Supabase isn't configured yet, same graceful-degradation
// pattern as the blog fallback.
export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseAdminConfigured()) return FALLBACK;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error || !data) return FALLBACK;
    return data as SiteSettings;
  } catch {
    return FALLBACK;
  }
}

export const HOURS_NOTE_TEXT = HOURS_NOTE;
