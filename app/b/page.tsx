import Image from "next/image";
import type { Metadata } from "next";
import { Logo, Ribbon } from "@/components/brand";
import { Countdown } from "@/components/countdown";
import { Accordion } from "@/components/accordion";
import { VariantSwitcher } from "@/components/switcher";
import {
  brand,
  contact,
  countdown,
  faq,
  footerLinks,
  hero,
  lgaNote,
  lgas,
  mentorPrize,
  nav,
  news,
  overview,
  portalLinks,
  prizes,
  showdown,
  sponsors,
  stages,
  statsAll,
} from "@/content/homepage";

export const metadata: Metadata = { title: "Variant B · Minimal Institutional" };

/* Variant B — Minimal Institutional (reference: Origin Studio)
   Near-black canvas, centred composition, oversized light-weight display type.
   A floating pill nav, a thumbnail strip beneath the hero wordmark, vertical
   side-rail labels, and offset overlapping cards. Restrained and prestigious —
   colour appears only in small, deliberate doses. */

const stripThumbs = [
  "/img/students-walking.jpg",
  "/img/students-exam.jpg",
  "/img/classroom-diverse.jpg",
  "/img/girls-classroom.jpg",
  "/img/students-lecture.jpg",
  "/img/champion-certificate.jpg",
];

/** Vertical micro-label pinned to the page edge — the reference's side rails. */
function SideRail({
  children,
  side = "left",
}: {
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <span
      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/30 xl:block ${
        side === "left"
          ? "left-8 rotate-180 [writing-mode:vertical-rl]"
          : "right-8 [writing-mode:vertical-rl]"
      }`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

/** Centred section heading in the reference's light display weight. */
function Head({
  lead,
  trail,
  className = "",
}: {
  lead: string;
  trail?: string;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-[clamp(2rem,4.4vw,3.75rem)] font-light leading-[1.08] tracking-[-0.025em] text-white ${className}`}
    >
      {lead}
      {trail && <span className="text-white/35"> {trail}</span>}
    </h2>
  );
}

export default function VariantB() {
  return (
    <div className="overflow-x-clip bg-[#070707] text-white">
      {/* Floating pill nav, centred — persists across the page */}
      <header className="fixed inset-x-0 top-5 z-50 px-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Logo variant="white" width={100} className="h-auto w-[72px] shrink-0 sm:w-[88px]" />
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 backdrop-blur-xl lg:flex">
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.12em] text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#register"
            className="shrink-0 rounded-full border border-white/25 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition hover:bg-white hover:text-[#070707]"
          >
            Register
          </a>
        </div>
      </header>

      {/* ── Hero: centred wordmark, thumbnail strip, countdown ticker ── */}
      <section className="relative flex min-h-svh flex-col items-center justify-center px-5 pb-16 pt-32">
        <SideRail side="left">Cross River South · 2026</SideRail>
        <SideRail side="right">Ig / X / Fb</SideRail>

        <p className="text-[10px] uppercase tracking-[0.32em] text-white/40">Maiden Edition</p>

        <h1 className="mt-8 text-center font-display text-[clamp(3.25rem,12vw,10rem)] font-light leading-[0.9] tracking-[-0.045em]">
          Who Wins <span className="text-white/30">This?</span>
        </h1>

        <p className="mt-8 max-w-xl text-center text-[15px] leading-relaxed text-white/50">
          {hero.subhead}
        </p>

        {/* Thumbnail strip, echoing the reference's row of work tiles */}
        <div className="mt-14 flex w-full max-w-3xl items-center justify-center gap-2.5">
          {stripThumbs.map((src, i) => (
            <div
              key={src}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-36 ${
                i > 3 ? "hidden sm:block" : ""
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="144px"
                className="object-cover opacity-70 transition duration-500 hover:opacity-100"
                priority={i < 3}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a
            href={hero.primaryCta.href}
            className="rounded-full bg-white px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#070707] transition hover:bg-white/85"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="rounded-full border border-white/20 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:bg-white/10"
          >
            {hero.secondaryCta.label}
          </a>
        </div>

        <div className="mt-14 w-full border-y border-white/10 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/35">
              {countdown.label}
            </span>
            <Countdown
              targetIso={countdown.targetIso}
              className="gap-6"
              boxClass="!min-w-0 !flex-none flex items-baseline gap-1.5"
              valueClass="font-display text-xl font-light tabular-nums"
              labelClass="text-[10px] uppercase tracking-[0.14em] text-white/35"
            />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {statsAll.map((s) => (
            <div key={s.label} className="bg-[#0b0b0b] px-6 py-10 text-center">
              <div className="font-display text-5xl font-light tracking-[-0.03em] sm:text-6xl">
                {s.display}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-white/70">
                {s.label}
              </div>
              <div className="mt-1.5 text-[12px] text-white/30">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview: centred statement, offset supporting copy ── */}
      <section id="overview" className="relative mx-auto max-w-6xl px-5 py-24">
        <SideRail side="left">The Championship</SideRail>
        <Head
          lead="An academic contest for every secondary school"
          trail="in Cross River South."
          className="mx-auto max-w-4xl text-center"
        />
        <p className="mx-auto mt-10 max-w-2xl text-center text-[14px] leading-relaxed text-white/45">
          {overview.body}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {overview.subjects.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/12 px-4 py-2 text-[13px] text-white/55 transition hover:border-white/30 hover:text-white"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ── Stages: rule-separated rows, the reference's service list ── */}
      <section id="stages" className="mx-auto max-w-5xl px-5 py-24">
        <Head lead="Seven stages," trail="one champion." className="text-center" />
        <div className="mt-16">
          {stages.map((st) => (
            <div
              key={st.n}
              className="group grid gap-x-10 gap-y-3 border-t border-white/10 py-8 last:border-b md:grid-cols-[3rem_1fr_1.25fr]"
            >
              <span className="text-[11px] tabular-nums text-white/25">
                {String(st.n).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl font-light tracking-[-0.02em] transition group-hover:translate-x-1 sm:text-3xl">
                {st.name}
              </h3>
              <div>
                <p className="text-[14px] leading-relaxed text-white/45">{st.summary}</p>
                <p className="mt-2.5 text-[10px] uppercase tracking-[0.16em] text-white/30">
                  {st.field}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Showdown: offset, overlapping cards over a photo ── */}
      <section className="relative mx-auto max-w-6xl px-5 py-24">
        <Head lead={showdown.title} trail="live on stage." className="max-w-3xl" />
        <p className="mt-6 max-w-xl text-[14px] leading-relaxed text-white/45">
          {showdown.intro}
        </p>

        <div className="relative mt-16">
          <div className="relative mx-auto h-64 w-full max-w-2xl overflow-hidden rounded-2xl sm:h-80">
            <Image
              src="/img/students-posing.jpg"
              alt="Students representing their school"
              fill
              sizes="(min-width: 640px) 42rem, 100vw"
              className="object-cover object-top opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/40" />
          </div>

          <div className="relative -mt-12 grid items-start gap-4 sm:grid-cols-2 lg:-mt-16 lg:grid-cols-4">
            {showdown.mechanics.map((m, i) => (
              <div
                key={m.name}
                className={`rounded-2xl border border-white/10 bg-[#0d0d0d]/90 p-6 backdrop-blur-xl ${
                  ["lg:mt-0", "lg:mt-8", "lg:mt-2", "lg:mt-10"][i]
                }`}
              >
                <h3 className="font-display text-lg font-normal">{m.name}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/45">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LGAs ── */}
      <section id="lgas" className="mx-auto max-w-5xl px-5 py-24">
        <Head lead="Seven LGAs," trail="one district." className="text-center" />
        <p className="mx-auto mt-6 max-w-xl text-center text-[14px] leading-relaxed text-white/45">
          {lgaNote}
        </p>

        <div className="mt-14 overflow-hidden rounded-2xl border border-white/10">
          {lgas.map((l) => (
            <div
              key={l.name}
              className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-6 py-5 transition hover:bg-white/[0.03]"
            >
              <span className="flex flex-wrap items-center gap-3 text-[15px] font-light">
                {l.name}
                {l.combined && (
                  <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/40">
                    Combined
                  </span>
                )}
              </span>
              <span className="font-display text-xl font-light tabular-nums">{l.schools}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 bg-white px-6 py-5 text-[#070707]">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Total</span>
            <span className="font-display text-xl font-medium tabular-nums">117</span>
          </div>
        </div>
      </section>

      {/* ── Prizes ── */}
      <section id="prizes" className="mx-auto max-w-6xl px-5 py-24">
        <Head lead="What's at stake," trail="for school and student." className="text-center" />

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {prizes.map((p, i) => (
            <div
              key={p.tier}
              className={`rounded-2xl border p-8 ${
                i === 0 ? "border-white/25 bg-white/[0.06]" : "border-white/10 bg-[#0b0b0b]"
              } ${["lg:mt-0", "lg:mt-8", "lg:mt-16"][i]}`}
            >
              <h3 className="font-display text-2xl font-light">{p.tier}</h3>
              <div className="mt-8 space-y-6">
                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-white/30">School</p>
                  <p className="text-[13px] leading-relaxed text-white/60">{p.school}</p>
                </div>
                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    Students
                  </p>
                  <p className="text-[13px] leading-relaxed text-white/60">{p.student}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">
          <h3 className="font-display text-xl font-light">{mentorPrize.title}</h3>
          <p className="mt-2.5 max-w-3xl text-[13px] leading-relaxed text-white/50">
            {mentorPrize.body}
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-5 py-24">
        <Head lead="Your questions," trail="answered." className="text-center" />
        <Accordion
          items={faq}
          className="mt-14 overflow-hidden rounded-2xl border border-white/10"
          itemClass="border-b border-white/[0.07] px-6 py-5 last:border-b-0"
          questionClass="text-[15px] font-light"
          answerClass="pt-3 text-[13px] leading-relaxed text-white/45"
        />
      </section>

      {/* ── News ── */}
      <section id="news" className="mx-auto max-w-6xl px-5 py-24">
        <Head lead="Latest" trail="updates." className="text-center" />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {news.map((n, i) => (
            <article
              key={n.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={
                    ["/img/nigerian-girls.jpg", "/img/students-lecture.jpg", "/img/schoolgirl-portrait.jpg"][i] ??
                    "/img/students-walking.jpg"
                  }
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover opacity-75 transition duration-500 hover:opacity-100"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.14em] text-white/30">
                  <span>{n.category}</span>
                  <span>·</span>
                  <time>
                    {new Date(n.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-3 font-display text-lg font-light leading-snug">{n.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/45">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Register ── */}
      <section id="register" className="relative mx-auto max-w-4xl px-5 py-28 text-center">
        <SideRail side="right">Entry is free</SideRail>
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">Registration open</p>
        <h2 className="mt-7 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.95] tracking-[-0.04em]">
          Register <span className="text-white/30">your school.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-white/45">
          Open to every public and private secondary school in the seven LGAs of Cross River
          South.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="#register"
            className="rounded-full bg-white px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#070707] transition hover:bg-white/85"
          >
            Start Registration
          </a>
          <a
            href="#stages"
            className="rounded-full border border-white/20 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:bg-white/10"
          >
            How It Works
          </a>
        </div>
        <p className="mt-7 text-[10px] uppercase tracking-[0.18em] text-white/25">
          {countdown.note}
        </p>
      </section>

      {/* ── Sponsors ── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <p className="text-center text-[10px] uppercase tracking-[0.28em] text-white/25">
          Sponsors &amp; Partners
        </p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-5">
          {sponsors.map((s, i) => (
            <div
              key={`${s}-${i}`}
              className="flex min-h-24 items-center justify-center bg-[#0b0b0b] px-5 py-7 text-center text-[12px] text-white/35"
            >
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 pt-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Logo variant="white" width={140} />
              <p className="mt-6 max-w-xs font-display text-lg font-light leading-snug text-white/70">
                {brand.tagline}
              </p>
              <p className="mt-6 text-[13px] leading-relaxed text-white/35">
                {contact.email}
                <br />
                {contact.phone}
              </p>
              <div className="mt-6 flex gap-2.5">
                {contact.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-[10px] uppercase text-white/45 transition hover:border-white hover:text-white"
                  >
                    {s.name.slice(0, 2)}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/25">Explore</p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {footerLinks.map((l) => (
                  <li key={l.label}>
                    <a href="#" className="text-white/50 transition hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/25">Portals</p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {portalLinks.map((l) => (
                  <li key={l.label}>
                    <a href="#" className="text-white/50 transition hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[11px] text-white/25">
            <span>
              © 2026 {brand.short}. {brand.edition}.
            </span>
            <span>Phase 0 demo homepage · Variant B</span>
          </div>
        </div>

        <div
          className="select-none px-4 text-center font-display text-[clamp(4rem,18vw,16rem)] font-light leading-[0.78] tracking-[-0.05em] text-white/[0.05]"
          aria-hidden="true"
        >
          SAEAC
        </div>
        <Ribbon />
      </footer>

      <div className="h-14" />
      <VariantSwitcher />
    </div>
  );
}
