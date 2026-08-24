import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LgasSection } from "@/components/sections";
import { lgaNote } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Participating LGAs",
  description:
    "The seven Local Government Areas of the Cross River South Senatorial District taking part in SAEAC.",
};

/**
 * Participating LGAs, per Content Guide §4.5.
 *
 * This is the landing view; each tile links through to /lgas/[slug]. Those
 * pages lead with the area itself — geography, headquarters, its place in the
 * qualifying structure — and carry live panels for registered schools,
 * fixtures and results that fill in as the competition runs, each stating
 * plainly when it has nothing yet rather than rendering an empty box.
 */
export default function LgasPage() {
  return (
    <>
      <PageHero
        eyebrow="Participating LGAs"
        title="Seven Local"
        titleTrail="Government Areas"
        intro={lgaNote}
        image="/img/lga-calabar-municipality.jpg"
        imageAlt="Students from across the Cross River South district"
      />
      <LgasSection />
    </>
  );
}
