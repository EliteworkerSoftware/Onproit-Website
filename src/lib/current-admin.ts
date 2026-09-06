import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
}

// cache() dedupes this within a single request's render tree (e.g. the admin
// layout and its page both call it) — it does not persist across separate
// requests, so removing an admin's profile row takes effect on their next
// request even though their Supabase Auth session is still technically valid.
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  if (!isSupabaseAdminConfigured()) return null;

  const supabaseAuth = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) return null;

  // Looked up with the service-role client (not the user's own session)
  // rather than relying on a same-row RLS policy existing on `profiles`.
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data as AdminUser;
});
