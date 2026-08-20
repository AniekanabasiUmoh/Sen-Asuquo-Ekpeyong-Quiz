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
 * The guide asks for a dedicated page per LGA carrying registered schools,
 * venue, schedule, results and gallery. Four of those five need competition
 * data that does not exist yet, so the individual pages wait for Phase 2/3
 * rather than shipping as four empty panels each. This index is the landing
 * view; the per-LGA pages follow once there is something to put on them.
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
