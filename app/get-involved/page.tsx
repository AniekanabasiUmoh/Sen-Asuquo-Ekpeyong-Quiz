import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ChangeMakerSection, SponsorsSection } from "@/components/sections";
import { changeMaker } from "@/content/homepage";
import { createPublicClient } from "@/lib/supabase/server";

import { VolunteerForm } from "./volunteer-form";

export const metadata: Metadata = {
  title: "Get Involved",
  description: changeMaker.body,
};

/** Get Involved, per Content Guide §3.1 and §4.17. */
export default async function GetInvolvedPage() {
  const supabase = createPublicClient();
  const { data: lgas } = await supabase.from("lgas").select("id, name").order("sort_order");

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

      <section id="changemaker" className="mx-auto max-w-3xl px-5 pb-4">
        <VolunteerForm lgas={lgas ?? []} />
      </section>

      <SponsorsSection />
    </>
  );
}
