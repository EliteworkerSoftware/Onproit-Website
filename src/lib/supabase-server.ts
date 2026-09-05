import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Auth-aware Supabase client bound to the request's cookies — used for
// sign-in/sign-out and session verification. Uses the anon key (not the
// service role key): Supabase Auth itself enforces who a token belongs to,
// this client is only ever asked "who is the current user", never used to
// read/write arbitrary tables.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component render (not a Route Handler) —
            // there's no response to attach cookies to. Harmless as long as
            // middleware or a Route Handler refreshes the session elsewhere.
          }
        },
      },
    }
  );
}
