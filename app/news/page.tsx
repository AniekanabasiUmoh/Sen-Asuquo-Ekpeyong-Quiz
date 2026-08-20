import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { NewsSection, PrincipalsSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Announcements, stage reports and school spotlights from the Senator Asuquo Ekpenyong Academic Championship.",
};

/**
 * News and Updates, per Content Guide §4.12.
 *
 * The guide specifies category filters and a monthly archive. Both wait for a
 * real feed; with three articles a filter bar would be furniture. They arrive
 * with the CMS in Phase 2.
 */
export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Updates"
        title="Latest from"
        titleTrail="the Championship"
        intro="Announcements, stage reports and news from schools across the district."
      />
      <NewsSection />
      <PrincipalsSection />
    </>
  );
}
