import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { createPublicClient } from "@/lib/supabase/server";

import { VolunteerForm } from "../../get-involved/volunteer-form";

export const metadata: Metadata = {
  title: "Volunteer Registration",
  description:
    "Register as a Change Maker for the Senator Asuquo Ekpenyong Academic Championship. No account is needed.",
};

/** Shareable, public volunteer application. Registration never creates an account. */
export default async function VolunteerRegistrationPage() {
  const supabase = createPublicClient();
  const { data: lgas } = supabase
    ? await supabase.from("lgas").select("id, name").order("sort_order")
    : { data: null };

  return (
    <>
      <PageHero
        eyebrow="Volunteer Registration"
        title="Join the"
        titleTrail="Change Makers"
        intro="Help deliver the qualifiers and Grand Finale. Complete this form to register. You do not need to create an account."
        image="/img/meeting-group-wide.jpg"
        imageAlt="The SAEAC planning committee with school principals"
        breadcrumb={{ label: "Get Involved", href: "/get-involved" }}
      />
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:pb-20">
        <VolunteerForm lgas={lgas ?? []} />
      </section>
    </>
  );
}
