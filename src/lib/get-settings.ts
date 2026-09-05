import "server-only";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { ADDRESS_FULL, HOURS_NOTE, EMAIL, PHONE_DISPLAY } from "@/lib/constants";

export interface SiteSettings {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
  contact_notification_emails: string;
}

export const SETTINGS_KEYS = [
  "contact_email",
  "contact_phone",
  "contact_address",
  "hours_weekdays",
  "hours_saturday",
  "hours_sunday",
  "contact_notification_emails",
] as const;

const FALLBACK: SiteSettings = {
  contact_email: EMAIL,
  contact_phone: PHONE_DISPLAY,
  contact_address: ADDRESS_FULL,
  hours_weekdays: "9:00 AM - 5:00 PM",
  hours_saturday: "Closed",
  hours_sunday: "Closed",
  contact_notification_emails: EMAIL,
};

// Splits the comma-separated contact_notification_emails setting into a
// clean array of addresses, used when sending the lead-notification email.
export function parseNotificationEmails(value: string): string[] {
  return value
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

// app_settings is a real, shared key-value table (44+ rows covering things
// well beyond this site) — only the 6 keys above are this app's concern.
// Falls back to the static brand constants when Supabase isn't configured.
export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseAdminConfigured()) return FALLBACK;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", SETTINGS_KEYS);

    if (error || !data) return FALLBACK;

    const map = Object.fromEntries(data.map((row) => [row.key, row.value])) as Partial<SiteSettings>;
    return { ...FALLBACK, ...map };
  } catch {
    return FALLBACK;
  }
}

export const HOURS_NOTE_TEXT = HOURS_NOTE;
