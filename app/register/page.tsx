import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Countdown } from "@/components/countdown";
import { Reveal } from "@/components/reveal";
import { contact, countdown, eligibility } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Register Your School",
  description: eligibility.intro,
};

/**
 * School Registration, per Content Guide §4.6.
 *
 * The real five-step wizard (school details, LGA and streams, contact person,
 * review, confirmation) needs accounts, file upload and an approval queue,
 * which is Phase 2 sprint 2.2. Until then this page does the honest thing: it
 * sets out the five steps so a principal knows what will be asked, shows the
 * deadline, and gives a route that works today, which is emailing the
 * committee.
 *
 * It exists now because the header CTA points here on every page, and a
 * primary call to action that 404s is worse than one that explains itself.
 */
const steps = [
  {
    title: "School details",
    body: "Create an account using the school's core institutional details: name, type, address and approximate student population.",
  },
  {
    title: "LGA and streams",
    body: "Confirm your Local Government Area and which of the Science, Art and Commercial streams the school will enter.",
  },
  {
    title: "Contact person",
    body: "Nominate the member of staff who will coordinate the school's participation, with their email and phone number.",
  },
  {
    title: "Review and submit",
    body: "Check the details and submit them to the Organising Committee for verification.",
  },
  {
    title: "Confirmation",
    body: "The school receives an email confirming registration, carrying a unique registration number.",
  },
];

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="School Registration"
        title="Register"
        titleTrail="Your School"
        intro={eligibility.intro}
        image="/img/students-posing.jpg"
        imageAlt="Secondary school students in uniform outside their school"
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              How registration works
            </h2>
            <ol className="mt-9">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-black/10 py-6"
                >
                  <span className="font-mono text-[11px] tabular-nums text-[#003090]/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{s.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-[#003090]/55">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={120} className="rounded-[28px] bg-[#003090] p-8 text-white sm:p-9">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                {countdown.label}
              </p>
              <Countdown
                targetIso={countdown.targetIso}
                className="mt-3 gap-5"
                boxClass="!min-w-0 !flex-none text-left"
                valueClass="font-display text-3xl font-extrabold text-white"
                labelClass="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45"
              />
              <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/35">
                {countdown.note}
              </p>

              <div className="mt-8 border-t border-white/15 pt-7">
                <h3 className="font-display text-lg font-bold">
                  The online portal opens shortly
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/65">
                  Registration is being finalised with the Organising Committee. To
                  register your school now, or to be told the moment the portal opens,
                  email the committee directly.
                </p>
                <a
                  href={`mailto:${contact.email}?subject=SAEAC%20School%20Registration`}
                  className="mt-6 block rounded-full bg-[#f0a800] px-6 py-3.5 text-center text-[13px] font-bold text-[#003090] transition hover:bg-white"
                >
                  Email the Committee
                </a>
                <p className="mt-4 text-center text-[13px] text-white/45">
                  or call{" "}
                  <a href={`tel:${contact.phone}`} className="font-semibold text-white/75">
                    {contact.phone}
                  </a>
                </p>
              </div>
            </Reveal>

            <Reveal delay={200} className="mt-4 rounded-[24px] bg-white p-7">
              <h3 className="font-display text-base font-bold">Before you register</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#003090]/55">
                Check that your school meets the eligibility criteria and confirm which
                streams you intend to enter.
              </p>
              <Link
                href="/eligibility"
                className="mt-5 inline-block rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:bg-[#faf6ee]"
              >
                Read the eligibility criteria
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
