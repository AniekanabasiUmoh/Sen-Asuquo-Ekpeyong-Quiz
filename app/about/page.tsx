import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import {
  AboutBlockSection,
  BoardSection,
  OriginSection,
  PatronSection,
} from "@/components/sections";
import { about, hero } from "@/content/homepage";

export const metadata: Metadata = {
  title: "About SAEAC",
  description: about.body,
};

/**
 * About SAEAC, per Content Guide §4.2.
 *
 * The guide asks for vision, mission, objectives, background, the Grand
 * Patron's message and the Organising Committee. Everything but the committee
 * is here; that section is still blocked on names, roles and photographs
 * (complaint.md B3) and is deliberately absent rather than stubbed.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About SAEAC"
        title="Building the Future Through"
        titleTrail="Academic Excellence"
        intro={hero.subhead}
        image="/img/students-lecture.jpg"
        imageAlt="Secondary school students in a classroom"
      />
      <AboutBlockSection />
      <PatronSection />
      <OriginSection />
      <BoardSection />
    </>
  );
}
