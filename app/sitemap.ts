import type { MetadataRoute } from "next";

import { lgaContent } from "@/content/lgas";

const BASE = "https://www.saeac.org";

/**
 * Sitemap for the public site.
 *
 * Listed by hand rather than walked off the filesystem, because the two are
 * not the same set: `app/` also holds the portal, the auth gateway, the OBS
 * overlay and the archived Phase 0 concepts, none of which belong in a search
 * index (see robots.ts). An explicit list also means a page cannot be
 * silently added to the sitemap before its content is ready.
 *
 * `priority` is relative within this site only — it does not affect ranking
 * against anyone else. The ordering reflects what the championship actually
 * wants found: registering a school first, then what the competition is.
 */
type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const pages: Entry[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "register", priority: 0.9, changeFrequency: "monthly" },
  { path: "competition", priority: 0.8, changeFrequency: "monthly" },
  { path: "about", priority: 0.8, changeFrequency: "monthly" },
  { path: "eligibility", priority: 0.8, changeFrequency: "monthly" },
  { path: "prizes", priority: 0.7, changeFrequency: "monthly" },
  { path: "lgas", priority: 0.7, changeFrequency: "monthly" },
  { path: "get-involved", priority: 0.7, changeFrequency: "monthly" },
  // Updated as the competition runs.
  { path: "news", priority: 0.7, changeFrequency: "weekly" },
  { path: "gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "schedule", priority: 0.7, changeFrequency: "weekly" },
  { path: "results", priority: 0.6, changeFrequency: "weekly" },
  { path: "live", priority: 0.6, changeFrequency: "daily" },
  { path: "hall-of-fame", priority: 0.5, changeFrequency: "yearly" },
  { path: "faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "copyright", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // The seven per-LGA pages, derived from the content so a new LGA cannot be
  // added to the site and forgotten here.
  const lgaPages: Entry[] = lgaContent.map((l) => ({
    path: `lgas/${l.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...pages, ...lgaPages].map(({ path, priority, changeFrequency }) => ({
    url: path ? `${BASE}/${path}` : BASE,
    lastModified,
    changeFrequency,
    priority,
  }));
}
