import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { eligibility, lgaNote, lgas } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Eligibility",
  description: eligibility.intro,
};

/** Eligibility, per Content Guide §4.4. */
export default function EligibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Eligibility"
        title="Who Can"
        titleTrail="Enter"
        intro={eligibility.intro}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <dl className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {eligibility.criteria.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <dt className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] tabular-nums text-[#003090]/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-bold">{c.title}</span>
              </dt>
              <dd className="mt-3 pl-[2.1rem] text-[15px] leading-relaxed text-[#003090]/60">
                {c.body}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* The seven LGAs, with the shared Akpabuyo–Bakassi slot called out
          because it changes who a school actually competes against. */}
      <section className="mx-auto max-w-7xl px-5 pb-14">
        <Reveal className="rounded-[28px] bg-white p-8 sm:p-10">
          <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em]">
            The Seven Local Government Areas
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {lgas.map((l) => (
              <li key={l.name}>
                <Link
                  href="/lgas"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[13px] font-semibold transition hover:border-[#f03018] hover:text-[#f03018]"
                >
                  {l.name}
                  {l.combined && (
                    <span className="rounded-full bg-[#f0a800]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8a6200]">
                      Combined
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-[14px] leading-relaxed text-[#003090]/55">
            {lgaNote}
          </p>
        </Reveal>
      </section>

      {/* §4.4 explicitly says these must be confirmed before publication.
          Listing them as outstanding is more useful than inventing them. */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <Reveal className="border-t border-black/10 pt-9">
          <h2 className="font-display text-xl font-bold">
            Still to be confirmed
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#003090]/55">
            {eligibility.pendingNote}
          </p>
          <ul className="mt-5 space-y-2">
            {eligibility.pending.map((x) => (
              <li
                key={x}
                className="flex items-baseline gap-3 text-[14px] text-[#003090]/50"
              >
                <span aria-hidden="true" className="text-[#f0a800]">
                  •
                </span>
                {x}
              </li>
            ))}
          </ul>

          <Link
            href="/register"
            className="mt-9 inline-block rounded-full bg-[#f03018] px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-[#003090]"
          >
            Register Your School
          </Link>
        </Reveal>
      </section>
    </>
  );
}
