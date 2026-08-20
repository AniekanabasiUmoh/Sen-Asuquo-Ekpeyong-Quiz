import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SocialIcon } from "@/components/social-icons";
import { contact } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the SAEAC Organising Committee by email, phone or social media.",
};

/**
 * Contact, per Content Guide §4.19.
 *
 * Details only, no form. A contact form needs somewhere to send to, which
 * means the Phase 2 backend; a form that silently discards what a principal
 * types is worse than no form. The email address is live and works today.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the"
        titleTrail="Committee"
        intro="For registration queries, sponsorship, media requests or anything else about the championship."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em]">
              Organising Committee
            </h2>

            <dl className="mt-8 space-y-7">
              <div className="border-t border-black/10 pt-5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#003090]/35">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-all font-display text-lg font-bold transition hover:text-[#f03018]"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>

              <div className="border-t border-black/10 pt-5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#003090]/35">
                  Phone
                </dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="font-display text-lg font-bold transition hover:text-[#f03018]"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>

              <div className="border-t border-black/10 pt-5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#003090]/35">
                  Follow the championship
                </dt>
                <dd className="mt-3 flex flex-wrap gap-2.5">
                  {contact.socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 text-[#003090]/55 transition hover:border-[#f03018] hover:text-[#f03018]"
                    >
                      <SocialIcon name={s.name} />
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={120} className="rounded-[28px] bg-[#003090] p-8 text-white sm:p-10">
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em]">
              Registering a school?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Entry is free and open to every public and private secondary school in the
              seven Local Government Areas of Cross River South. Start with the
              eligibility criteria, then register.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-full bg-[#f0a800] px-7 py-3.5 text-[13px] font-bold text-[#003090] transition hover:bg-white"
              >
                Register Your School
              </Link>
              <Link
                href="/eligibility"
                className="rounded-full border border-white/30 px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-white/10"
              >
                Check Eligibility
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
