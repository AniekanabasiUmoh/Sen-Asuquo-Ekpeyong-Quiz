import type { Metadata } from "next";
import Link from "next/link";
import { HeadlineReveal } from "@/components/headline-reveal";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { Reveal } from "@/components/reveal";
import {
  FannedCtaSection,
  LgasCarouselSection,
  NumbersSection,
} from "@/components/sections";
import { Teaser } from "@/components/teaser";
import { board, hero, principalsMeeting } from "@/content/homepage";
import { createPublicClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    absolute: "SÆAC · Senator Asuquo Ekpenyong Academic Championship",
  },
};

/**
 * The SAEAC homepage.
 *
 * Bold Editorial (reference: Caladan). Light, image-led, generous whitespace.
 * A full-bleed photographic hero, then a soft off-white body carrying bento
 * grids, rule-separated lists and a two-tone headline treatment.
 *
 * This used to be the entire site: sixteen sections on one page, which is
 * what prompted "the home page is long". The Phase 1 split moved each section
 * to the page the Content Guide always specified for it (§2.1), and what
 * stays here is the hero, the headline figures, one teaser per destination,
 * and the registration call to action.
 *
 * Teasers rather than nothing: a homepage that moved every section out
 * wholesale would be a hero and a button. Each teaser says what is on the
 * page behind it and gets out of the way.
 */
export default async function HomePage() {
  const supabase = createPublicClient({ revalidate: 300 });
  const { data: latest } = supabase
    ? await supabase.from("news").select("title, slug, excerpt, image_path").eq("status", "published").order("published_at", { ascending: false, nullsFirst: false }).limit(1).maybeSingle()
    : { data: null };
  return (
    <>
      {/* ── Hero: full-bleed photography, headline low-left ── */}
      {/* The header pill floats over this card, so the section is pulled up by
          the full height of the header and its top padding. The card keeps its
          inset on all four sides, which is what lets the pill sit on the
          photograph with cream showing around it. */}
      <section className="relative isolate -mt-[94px] min-h-[92svh] overflow-hidden px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="relative flex min-h-[92svh] flex-col overflow-hidden rounded-[28px]">
          {/* Cross-fades through five student photographs; see
              components/hero-slideshow.tsx */}
          <HeroSlideshow />
          {/* Legibility scrim: dark at the foot where the type sits, clear at the top */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/45 via-55% to-ink/10" />
          <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-black/50 to-transparent" />

          {/* Headline block, anchored bottom-left */}
          <div className="relative z-10 mt-auto px-6 pb-8 pt-28 sm:px-10 sm:pb-10">
            <div className="max-w-4xl">
              <h1 className="max-w-[15ch] font-display text-[clamp(2.5rem,7.2vw,6.25rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
                <HeadlineReveal
                  lines={[
                    hero.headlineLead,
                    <span key="t" className="text-white/45">
                      {hero.headlineTrail}
                    </span>,
                  ]}
                />
              </h1>
              <Reveal delay={420}>
                <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/75 sm:text-base">
                  {hero.tagline}
                </p>
              </Reveal>
            </div>
          </div>

          {/* Action bar: countdown left, calls to action right */}
          <div className="relative z-10 px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="flex flex-col gap-5 rounded-[20px] border border-white/12 bg-white/10 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-8">
              <div>
                <p className="font-display text-xl font-bold text-white">Follow the Championship</p>
                <div className="mt-2 flex gap-5 text-sm font-semibold text-white"><Link href="/schedule" className="underline underline-offset-4">Schedule</Link><Link href="/results" className="underline underline-offset-4">Results</Link></div>
              </div>
              {/* Stacked full-width on phones so nothing wraps to uneven
                  heights; side by side from sm upward. */}
              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3 [&>a]:w-full [&>a]:justify-center [&>a]:text-center sm:[&>a]:w-auto">
                <Link
                  href="/register"
                  className="rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary transition hover:bg-white"
                >
                  Register Now
                </Link>
                <Link
                  href="/volunteer/register"
                  className="rounded-full border border-white/30 px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-white/10"
                >
                  Volunteer Registration
                </Link>
                <Link
                  href="/about#patron"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-bold text-white/85 transition hover:text-white"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden="true">
                      <path d="M8 4.5 0 9V0l8 4.5Z" fill="currentColor" />
                    </svg>
                  </span>
                  Watch Promo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NumbersSection />

      <Teaser
        eyebrow="About SAEAC"
        title="Building the Future Through"
        titleTrail="Academic Excellence"
        body="More than an academic competition. A platform for discovering talent, rewarding excellence and investing in the future of education, structured like a championship tournament."
        href="/about"
        cta="About the championship"
        image="/img/students-lecture.jpg"
        imageAlt="Secondary school students in a classroom"
      />

      <Teaser
        eyebrow="Competition Structure"
        title="Seven Stages,"
        titleTrail="One Champion"
        body="From school screening to the televised Grand Finale, every stage narrows the field across all seven Local Government Areas of Cross River South."
        href="/competition"
        cta="See how it works"
        image="/img/students-exam.jpg"
        imageAlt="Students sitting a written examination"
        reverse
      />

      <LgasCarouselSection />

      <Teaser
        eyebrow="Prizes"
        title="What the"
        titleTrail="Champions Win"
        body="The SAEAC Grand Trophy, an ICT/CBT Centre for the winning school's Local Government Area, cash awards and laptops for finalists, and recognition for the teachers who prepared them."
        href="/prizes"
        cta="See the prizes"
        image="/img/champion-certificate.jpg"
        imageAlt="A Nigerian secondary school student in uniform receiving an award"
        reverse
      />

      <Teaser
        eyebrow="Latest from Schools"
        title={latest?.title ?? "Principals Across the District"}
        titleTrail={latest ? "" : "Back the Championship"}
        body={latest?.excerpt ?? principalsMeeting.body}
        href={latest ? `/news/${latest.slug}` : "/news"}
        cta="Read the latest"
        image={latest?.image_path || "/img/meeting-group.jpg"}
        imageAlt={latest ? latest.title : "Principals and the SAEAC Planning Committee at Axari Hotel, Calabar"}
        facts={latest ? undefined : principalsMeeting.facts}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-2 sm:py-20">
        <div>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05]">Watch the SAEAC story</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-primary/70">Watch the championship launch trailer and follow the journey across Cross River South.</p>
          <Link href="/news" className="mt-6 inline-flex rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold hover:bg-white">Explore championship updates</Link>
        </div>
        <video controls preload="none" poster="/news-media/municipality-cover.jpg" className="aspect-video w-full rounded-2xl bg-primary object-contain" aria-label="SAEAC championship launch trailer">
          <source src="/news-media/saeac-launch.mp4" type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-14 sm:pb-20" aria-label="More SAEAC videos">
        <div className="grid gap-6 md:grid-cols-2">
          <figure><video controls preload="none" className="aspect-video w-full rounded-2xl bg-primary object-contain" aria-label="Commissioner of Education endorsement"><source src="/news-media/education-endorsement.mp4" type="video/mp4" />Your browser does not support video playback.</video><figcaption className="mt-3 font-semibold">Commissioner of Education endorsement</figcaption></figure>
          <figure><video controls preload="none" className="aspect-video w-full rounded-2xl bg-primary object-contain" aria-label="Be the next standard"><source src="/news-media/be-the-next-standard.mp4" type="video/mp4" />Your browser does not support video playback.</video><figcaption className="mt-3 font-semibold">Be the next standard</figcaption></figure>
        </div>
      </section>

      <Teaser
        eyebrow="Get Involved"
        title="Become a"
        titleTrail="Change Maker"
        body="Change Makers power the championship, on the ground and behind it. Volunteer at the LGA qualifiers and the Grand Finale, or back the Trust Fund that puts students through school."
        href="/get-involved"
        cta="Get involved"
        image="/img/board-scholars-uk.jpg"
        imageAlt={board.name}
        reverse
      />

      <FannedCtaSection />
    </>
  );
}
