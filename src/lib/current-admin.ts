import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, readSessionUserId } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

export interface AdminUser {
  id: string;
  email: string;
  display_name: string | null;
}

// cache() dedupes this within a single request's render tree (e.g. the admin
// layout and its page both call it) — it does not persist across separate
// requests, so removing an admin takes effect on their next request.
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  if (!isSupabaseAdminConfigured()) return null;

  const cookieStore = await cookies();
  const userId = readSessionUserId(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (!userId) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, display_name")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as AdminUser;
});
