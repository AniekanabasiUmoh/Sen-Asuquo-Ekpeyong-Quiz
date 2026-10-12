import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every matched request.
 *
 * Named `proxy` in proxy.ts: Next.js 16 renamed the middleware convention.
 *
 * Server Components cannot write cookies, so without this a refreshed token
 * would be discarded and the user silently logged out. Phase 2 route guards
 * (portal redirects) hang off this too.
 *
 * Degrades rather than throws when Supabase is not configured. This ran on
 * every matched request with non-null assertions on both env vars, so the
 * first deploy without them returned 500 for the *entire site* — including
 * /robots.txt and static marketing pages that never touch Supabase. A
 * missing key should cost you the session refresh, not the homepage.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn(
      "[proxy] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. " +
        "Skipping session refresh; anything behind auth will redirect to /login.",
    );
    return response;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Do not remove: this call is what actually performs the refresh.
  // Wrapped for the same reason as the guard above — this is a network call on
  // the path of every page, so a Supabase outage or a timeout must not turn
  // the public site into a 500. A failed refresh just means the session is not
  // renewed on this request.
  try {
    await supabase.auth.getUser();
  } catch (e) {
    console.error("[proxy] session refresh failed:", e);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files, which never need a
     * session and would only add latency.
     */
    "/((?!_next/static|_next/image|favicon.ico|img/|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)",
  ],
};
