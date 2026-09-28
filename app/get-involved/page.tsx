import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ChangeMakerSection, SponsorsSection } from "@/components/sections";
import { changeMaker } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Get Involved",
  description: changeMaker.body,
};

/** Get Involved, per Content Guide §3.1 and §4.17. */
export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Become a"
        titleTrail="Change Maker"
        intro={changeMaker.body}
        image="/img/meeting-group-wide.jpg"
        imageAlt="The SAEAC planning committee with school principals"
      />
      <ChangeMakerSection />
      <SponsorsSection />
    </>
  );
}
