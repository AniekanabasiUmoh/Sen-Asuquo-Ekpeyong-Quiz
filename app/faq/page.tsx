import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/accordion";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { faq } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers on eligibility, team size, subjects and how schools enter the Senator Asuquo Ekpenyong Academic Championship.",
};

/**
 * FAQ, per Content Guide §4.16.
 *
 * The client asked for this section to come off the homepage in Round 1, and
 * it did. It belongs on its own page, which is where the guide always had it.
 */
export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Frequently Asked Questions"
        title="Questions,"
        titleTrail="Answered"
        intro="The things schools ask most often. If your question is not here, the Organising Committee will answer it directly."
      />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
        <Reveal>
          <Accordion items={faq.map((f) => ({ q: f.q, a: f.a }))} />
        </Reveal>

        <Reveal className="mt-12 rounded-[24px] bg-white p-8 text-center">
          <h2 className="font-display text-xl font-bold">Still need an answer?</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#003090]/55">
            The Organising Committee responds to schools directly.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-[#003090] px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-[#f03018]"
          >
            Contact the Committee
          </Link>
        </Reveal>
      </section>
    </>
  );
}
