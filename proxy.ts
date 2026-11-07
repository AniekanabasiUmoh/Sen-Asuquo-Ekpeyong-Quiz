import { encodeFilterKey } from "@/lib/public-filters";
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
  const filtered = publicFilterResponse(request);
  if (filtered) return filtered;
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

  const supabase = createServerClient(url, anonKey, {
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
  });

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

const PUBLIC_FILTERS: Record<string, readonly string[]> = {
  "/gallery": ["lga", "stage", "content_type"],
  "/schedule": ["stage", "group", "lga", "view"],
  "/news": ["category"],
  "/results": ["q", "stage", "lga"],
};

function publicFilterResponse(request: NextRequest) {
  const allowed = PUBLIC_FILTERS[request.nextUrl.pathname];
  if (!allowed) return null;
  const key = encodeFilterKey(request.nextUrl.searchParams, allowed);
  if (!key) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname += "/filtered/" + key;
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  // Public anonymous pages need no session refresh. Authentication and
  // protected portal routes retain the existing verified refresh flow.
  matcher: [
    "/portal/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
    "/register",
    "/volunteer/register",
    {
      source: "/gallery",
      has: [
        {
          type: "query",
          key: "lga",
        },
      ],
    },
    {
      source: "/gallery",
      has: [
        {
          type: "query",
          key: "stage",
        },
      ],
    },
    {
      source: "/gallery",
      has: [
        {
          type: "query",
          key: "content_type",
        },
      ],
    },
    {
      source: "/schedule",
      has: [
        {
          type: "query",
          key: "stage",
        },
      ],
    },
    {
      source: "/schedule",
      has: [
        {
          type: "query",
          key: "group",
        },
      ],
    },
    {
      source: "/schedule",
      has: [
        {
          type: "query",
          key: "lga",
        },
      ],
    },
    {
      source: "/schedule",
      has: [
        {
          type: "query",
          key: "view",
        },
      ],
    },
    {
      source: "/news",
      has: [
        {
          type: "query",
          key: "category",
        },
      ],
    },
    {
      source: "/results",
      has: [
        {
          type: "query",
          key: "q",
        },
      ],
    },
    {
      source: "/results",
      has: [
        {
          type: "query",
          key: "stage",
        },
      ],
    },
    {
      source: "/results",
      has: [
        {
          type: "query",
          key: "lga",
        },
      ],
    },
  ],
};
