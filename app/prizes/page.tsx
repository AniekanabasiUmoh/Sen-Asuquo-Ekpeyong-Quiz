import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PrizesSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Prizes",
  description:
    "What the champion school, its students and its teachers win at SAEAC, from the Grand Trophy to an ICT/CBT Centre.",
};

/** Prizes, per Content Guide §4.15. */
export default function PrizesPage() {
  return (
    <>
      <PageHero
        eyebrow="Prizes"
        title="What the"
        titleTrail="Champions Win"
        intro="The championship rewards the school, its students and the teachers who prepared them."
        image="/img/win-students.jpg"
        imageAlt="Students competing in class"
      />
      <PrizesSection />
    </>
  );
}
