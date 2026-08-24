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
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  await supabase.auth.getUser();

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
