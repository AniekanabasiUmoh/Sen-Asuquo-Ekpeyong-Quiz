import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ShowdownSection, StagesSection } from "@/components/sections";
import { overview } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Competition Structure",
  description: overview.body,
};

/**
 * Competition Structure, per Content Guide §4.3.
 *
 * The seven stages from registration to the Grand Finale, followed by the
 * Grand Finale mechanics from the RD deck.
 */
export default function CompetitionPage() {
  return (
    <>
      <PageHero
        eyebrow="Competition Structure"
        title="Seven Stages,"
        titleTrail="One Champion"
        intro={overview.body}
        image="/img/students-exam.jpg"
        imageAlt="Students sitting a written examination"
      />
      <StagesSection />
      <ShowdownSection />
    </>
  );
}
