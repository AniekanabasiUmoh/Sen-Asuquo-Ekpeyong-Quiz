import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

/**
 * Supabase client for Client Components.
 *
 * Uses the anon key, which is compiled into the browser bundle by design. It is
 * safe there only because Row Level Security decides what it can read; the
 * policies in supabase/migrations/*_rls.sql are the security boundary, not this
 * file.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
