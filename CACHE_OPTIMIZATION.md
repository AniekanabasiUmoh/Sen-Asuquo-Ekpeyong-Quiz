# Public-page CPU reduction

Gallery, schedule, news, FAQ, downloads and LGA pages use anonymous public data
and a five-minute cache. Published results use a 30-second page cache. Live
scoreboards, overlays, health checks, login and private portal requests remain
dynamic.

Existing query URLs and GET forms still work, including without JavaScript.
The proxy normalizes the allowed filters into a URL-safe internal route key.
Each filtered page can then use ISR instead of reading `searchParams` on every
request. Unknown tracking parameters are excluded from that key. If a filter
is added, update the proxy matcher, allowed keys and the corresponding filtered
page together.

`createPublicClient({ revalidate: 300 })` uses the anonymous Supabase key only.
The normal authenticated and service-role clients are never used for this
shared content cache. Public-content server actions call
`revalidatePublicContent`, which expires the public-data tag and the affected
route subtree immediately after a successful authorized write.

The proxy refreshes sessions on authentication and portal routes. Public
marketing requests no longer construct a session client. Role/step-up checks
in pages and actions are retained.

Validation:

```
node --experimental-strip-types --test tests/public-filters.test.mjs
npm run build -- --webpack
```

Production verification should show repeated public HTML requests as
`x-vercel-cache: HIT`, correct selected filters, and unauthenticated portal
requests redirecting to login with private/no-store responses. Account-wide
CPU savings require a subsequent traffic-adjusted usage comparison; a cache
hit is evidence of avoiding that page render, not a measured billing percentage.
