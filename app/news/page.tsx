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
 * The public feed is database-backed; cards link to the article detail route.
 * Category filtering is URL-driven so a filtered feed can be shared directly.
 */
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="News & Updates"
        title="Latest from"
        titleTrail="the Championship"
        intro="Announcements, stage reports and news from schools across the district."
      />
      <NewsSection category={category} />
      <PrincipalsSection />
    </>
  );
}
