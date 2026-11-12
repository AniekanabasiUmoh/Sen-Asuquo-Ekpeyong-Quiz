import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { NewsSection, PrincipalsSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Announcements, stage reports and school spotlights from the Senator Asuquo Ekpenyong Academic Championship.",
  alternates: { canonical: "/news" },
};

/**
 * News and Updates, per Content Guide §4.12.
 *
 * The public feed is database-backed; cards link to the article detail route.
 */
export default async function NewsPage() {
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
