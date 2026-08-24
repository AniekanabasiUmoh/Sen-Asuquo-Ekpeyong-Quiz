import type { MetadataRoute } from "next";

/**
 * robots.txt.
 *
 * Everything public is crawlable. The portal, the auth gateway and the OBS
 * overlay are disallowed — not as a security measure (RLS is the boundary,
 * and a crawler is anonymous anyway) but because they are useless in a search
 * result: a signed-out crawler sees a login redirect, and indexing those URLs
 * would only dilute the pages that should rank.
 *
 * The archived Phase 0 concepts at /b–/e and /directions are excluded for the
 * same reason: they are an internal design record, not site content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/portal/",
        "/login",
        "/signup",
        "/forgot-password",
        "/overlay/",
        "/b",
        "/c",
        "/d",
        "/e",
        "/directions",
      ],
    },
    sitemap: "https://www.saeac.org/sitemap.xml",
  };
}
