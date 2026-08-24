import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./types";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 *
 * Still the anon key, so RLS applies: this client sees exactly what the signed-in
 * user is allowed to see. Reach for `createAdminClient` only when an operation
 * genuinely must bypass RLS.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Session refresh is handled by middleware, so this is safe to
            // swallow: the request still carries a valid session.
          }
        },
      },
    },
  );
}

/**
 * Service-role client. Bypasses Row Level Security completely.
 *
 * Use only for work no user should be able to do through RLS: issuing
 * registration numbers, writing audit entries on a user's behalf, admin
 * back-office jobs. Never return its rows to a client without filtering them
 * yourself, because no policy will do it for you.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. It is server-only and must never be prefixed NEXT_PUBLIC_.",
    );
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      // No cookie persistence: this client is deliberately not tied to a user
      // session, so it cannot accidentally act as one.
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

/**
 * Anonymous client that reads no cookies.
 *
 * Calling `cookies()` opts a page into dynamic rendering, so a component using
 * the normal server client turns an otherwise static public page into one
 * rendered per request. For public data governed entirely by RLS, and for the
 * anon role specifically, no session is needed. Using this keeps the public
 * pages statically generated and CDN cached, which matters on Nigerian mobile
 * data.
 *
 * Never use this where the answer should depend on who is signed in: with no
 * session it is always the anonymous view.
 */
export function createPublicClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
