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
  stats,
} from "@/content/homepage";

export const metadata: Metadata = { title: "Variant C · Editorial Contrast" };

/* Variant C — Editorial Contrast (reference: People Work)
   Warm bone ground, an editorial serif with italic emphasis words, a full-width
   portrait row, and dark forest-green rounded panels that alternate against the
   cream. CTAs are lime pills with a circular arrow. Storytelling-led: the
   students carry the page. */

/** Serif headline with one italicised emphasis word — the reference's signature. */
function Serif({
  before,
  em,
  after,
  className = "",
}: {
  before?: string;
  em: string;
  after?: string;
  className?: string;
}) {
  return (
    <h2 className={`font-serif font-normal leading-[1.08] tracking-[-0.01em] ${className}`}>
      {before && <>{before} </>}
      <em className="italic">{em}</em>
      {after && <> {after}</>}
    </h2>
  );
}

/** Lime pill CTA with the circular arrow token. */
function ArrowPill({
  href,
  children,
  tone = "light",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "lime";
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2.5 rounded-full py-1.5 pl-6 pr-1.5 text-[14px] font-medium transition ${
        tone === "lime"
          ? "bg-[#d8f651] text-[#1e2b23] hover:bg-[#c9ea3a]"
          : "bg-white text-[#1e2b23] hover:bg-white/85"
      }`}
    >
      {children}
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition group-hover:rotate-45 ${
          tone === "lime" ? "bg-[#1e2b23] text-[#d8f651]" : "bg-[#d8f651] text-[#1e2b23]"
        }`}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 11L11 3M11 3H4.5M11 3V9.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e2b23]/60">
      {children}
    </span>
  );
}

const portraits = [
  "/img/schoolgirl-portrait.jpg",
  "/img/students-posing.jpg",
  "/img/nigerian-girls.jpg",
  "/img/students-walking.jpg",
  "/img/girls-classroom.jpg",
];

export default function VariantC() {
  return (
    <div className="bg-[#ece9e2] text-[#1e2b23]">
      {/* ── Hero: centred serif statement over the cream, portrait row beneath ── */}
      <section className="relative">
        {/* Floating pill nav */}
        <div className="px-4 pt-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full bg-[#f6f4ef] px-3 py-2 pl-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <Logo variant="blue" width={100} className="h-auto w-[74px] shrink-0 sm:w-[88px]" />
            <nav className="hidden items-center gap-6 text-[13px] font-medium text-[#1e2b23]/70 lg:flex">
              {nav.map((n) => (
                <a key={n.label} href={n.href} className="transition hover:text-[#1e2b23]">
                  {n.label}
                </a>
              ))}
            </nav>
            <a
              href="#register"
              className="shrink-0 rounded-full bg-[#d8f651] px-5 py-2.5 text-[12px] font-bold text-[#1e2b23] transition hover:bg-[#c9ea3a]"
            >
              Register
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-5 pb-14 pt-20 text-center sm:pt-28">
          <Serif
            before="Who wins"
            em="this"
            after="?"
            className="text-[clamp(3rem,8vw,6.5rem)]"
          />
          <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-[#1e2b23]/60">
            {hero.subhead}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ArrowPill href={hero.primaryCta.href} tone="lime">
              {hero.primaryCta.label}
            </ArrowPill>
            <a
              href={hero.secondaryCta.href}
              className="rounded-full bg-white px-6 py-3.5 text-[14px] font-medium transition hover:bg-white/70"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* Full-width portrait row, edge-bleeding both sides */}
        <div className="flex gap-3 overflow-hidden px-3 pb-16">
          {portraits.map((src, i) => (
            <div
              key={src}
              className={`relative aspect-[3/4] flex-1 shrink-0 overflow-hidden rounded-2xl ${
                i > 2 ? "hidden lg:block" : i > 1 ? "hidden sm:block" : ""
              } ${i === 3 ? "" : ""}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className={`object-cover transition duration-700 ${
                  i === 3 ? "" : "grayscale hover:grayscale-0"
                }`}
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Dark panel: the championship, with two feature image cards ── */}
      <section id="overview" className="px-3 pb-3">
        <div className="rounded-[28px] bg-[#1e2b23] px-6 py-20 text-[#ece9e2] sm:px-10 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Serif
              before="Designed for every school"
              em="beyond"
              after="the classroom"
              className="text-[clamp(2rem,4.6vw,3.5rem)]"
            />
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[#ece9e2]/55">
              {overview.body}
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
            {[
              {
                src: "/img/students-exam.jpg",
                title: "School Screening",
                note: "Three examinations, one day, top five advance.",
              },
              {
                src: "/img/trophy-teen.jpg",
                title: "The Grand Finale",
                note: "Ten schools, four rounds, one champion — televised.",
              },
            ].map((c) => (
              <div key={c.title} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={c.src}
                  alt={c.title}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
                  <div>
                    <h3 className="font-serif text-2xl text-white">{c.title}</h3>
                    <p className="mt-1 text-[13px] text-white/65">{c.note}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-[#d8f651] group-hover:text-[#1e2b23]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 11L11 3M11 3H4.5M11 3V9.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sponsor row inside the dark panel, as the reference does */}
          <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {sponsors.map((s, i) => (
              <span key={`${s}-${i}`} className="text-[13px] text-[#ece9e2]/30">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats on the cream ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white px-6 py-8 text-center">
              <div className="font-serif text-5xl sm:text-6xl">{s.display}</div>
              <div className="mt-3 text-[13px] font-medium">{s.label}</div>
              <div className="mt-1 text-[12px] text-[#1e2b23]/45">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stages: portrait left, stacked list-menu right (the reference's block) ── */}
      <section id="stages" className="px-3 pb-3">
        <div className="rounded-[28px] bg-[#1e2b23] p-3 text-[#ece9e2] sm:p-4">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[380px] overflow-hidden rounded-2xl lg:min-h-[560px]">
              <Image
                src="/img/students-lecture.jpg"
                alt="Students in a lesson"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                <p className="max-w-xs text-[13px] leading-relaxed text-white/75">
                  Seven stages take 117 schools across the district down to a single
                  champion, broadcast live from the Grand Finale.
                </p>
              </div>
            </div>

            <div className="px-3 py-8 sm:px-8 lg:py-12">
              <span className="inline-flex items-center rounded-full bg-[#ece9e2]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ece9e2]/60">
                The Road to the Finale
              </span>
              <div className="mt-8">
                {stages.map((st) => (
                  <div
                    key={st.n}
                    className="group border-b border-[#ece9e2]/12 py-5 last:border-b-0"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-[26px] leading-tight transition group-hover:translate-x-1 sm:text-3xl">
                        {st.name}
                      </h3>
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-[#ece9e2]/35">
                        {st.field}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-[#ece9e2]/45">
                      {st.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Showdown: principle cards on the cream ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <Tag>Round 3 · Live Format</Tag>
          <Serif
            before="The Grand Finale"
            em="Showdown"
            className="mx-auto mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)]"
          />
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#1e2b23]/60">
            {showdown.intro}
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {showdown.mechanics.map((m, i) => (
            <div key={m.name} className="flex h-full flex-col rounded-2xl bg-white p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8f651] font-serif text-[15px] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 font-serif text-2xl">{m.name}</h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-[#1e2b23]/55">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LGAs ── */}
      <section id="lgas" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Tag>Cross River South</Tag>
            <Serif
              before="Seven LGAs,"
              em="one"
              after="district"
              className="mt-6 text-[clamp(2rem,4.6vw,3.5rem)]"
            />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#1e2b23]/60">
              {lgaNote}
            </p>
            <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src="/img/students-outdoors.jpg"
                alt="Students outside their school"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-3 sm:p-5">
            {lgas.map((l) => (
              <div
                key={l.name}
                className="flex items-baseline justify-between gap-4 border-b border-[#1e2b23]/[0.08] px-3 py-5 last:border-b-0"
              >
                <span className="flex flex-wrap items-center gap-2.5 text-[15px]">
                  {l.name}
                  {l.combined && (
                    <span className="rounded-full bg-[#d8f651] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">
                      Combined
                    </span>
                  )}
                </span>
                <span className="font-serif text-2xl">{l.schools}</span>
              </div>
            ))}
            <div className="mt-3 flex items-baseline justify-between gap-4 rounded-xl bg-[#1e2b23] px-5 py-5 text-[#ece9e2]">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ece9e2]/60">
                Total Schools
              </span>
              <span className="font-serif text-2xl">117</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prizes ── */}
      <section id="prizes" className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <Tag>What&rsquo;s at Stake</Tag>
          <Serif
            before="Rewards that outlive"
            em="the"
            after="competition"
            className="mx-auto mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)]"
          />
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {prizes.map((p, i) => (
            <div
              key={p.tier}
              className={`rounded-2xl p-8 ${
                i === 0 ? "bg-[#1e2b23] text-[#ece9e2]" : "bg-white"
              }`}
            >
              <h3 className="font-serif text-3xl">{p.tier}</h3>
              <div className="mt-7 space-y-6">
                <div>
                  <p
                    className={`mb-2 text-[9px] font-bold uppercase tracking-[0.18em] ${
                      i === 0 ? "text-[#d8f651]" : "text-[#1e2b23]/40"
                    }`}
                  >
                    School
                  </p>
                  <p
                    className={`text-[13px] leading-relaxed ${
                      i === 0 ? "text-[#ece9e2]/70" : "text-[#1e2b23]/65"
                    }`}
                  >
                    {p.school}
                  </p>
                </div>
                <div>
                  <p
                    className={`mb-2 text-[9px] font-bold uppercase tracking-[0.18em] ${
                      i === 0 ? "text-[#d8f651]" : "text-[#1e2b23]/40"
                    }`}
                  >
                    Students
                  </p>
                  <p
                    className={`text-[13px] leading-relaxed ${
                      i === 0 ? "text-[#ece9e2]/70" : "text-[#1e2b23]/65"
                    }`}
                  >
                    {p.student}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl bg-white p-8">
            <h3 className="font-serif text-2xl">{mentorPrize.title}</h3>
            <p className="mt-2.5 max-w-2xl text-[13px] leading-relaxed text-[#1e2b23]/60">
              {mentorPrize.body}
            </p>
          </div>
          <div className="relative min-h-[200px] overflow-hidden rounded-2xl">
            <Image
              src="/img/graduates.jpg"
              alt="Graduating students celebrating"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <div className="text-center">
          <Tag>Before You Enter</Tag>
          <Serif
            before="Your questions,"
            em="answered"
            className="mt-6 text-[clamp(2rem,4.6vw,3.5rem)]"
          />
        </div>
        <Accordion
          items={faq}
          className="mt-10 space-y-3"
          itemClass="rounded-2xl bg-white px-6 py-5"
          questionClass="text-[15px] font-medium"
          answerClass="pt-3 text-[13px] leading-relaxed text-[#1e2b23]/60"
        />
      </section>

      {/* ── News ── */}
      <section id="news" className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Serif
            before="Latest from"
            em="the"
            after="championship"
            className="max-w-xl text-[clamp(2rem,4.6vw,3.25rem)]"
          />
          <ArrowPill href="#news">All updates</ArrowPill>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {news.map((n, i) => (
            <article key={n.title} className="overflow-hidden rounded-2xl bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src={
                    ["/img/nigerian-girls.jpg", "/img/classroom-diverse.jpg", "/img/schoolgirl-portrait.jpg"][i] ??
                    "/img/students-walking.jpg"
                  }
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2.5 text-[11px] text-[#1e2b23]/45">
                  <span className="font-bold uppercase tracking-[0.12em]">{n.category}</span>
                  <span>·</span>
                  <time>
                    {new Date(n.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-3 font-serif text-xl leading-snug">{n.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#1e2b23]/55">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Register: dark panel with countdown ── */}
      <section id="register" className="px-3 pb-3">
        <div className="relative overflow-hidden rounded-[28px] bg-[#1e2b23] px-6 py-20 text-center text-[#ece9e2] sm:px-12 sm:py-24">
          <Image
            src="/img/students-walking.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_35%] opacity-[0.16]"
          />
          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-[#ece9e2]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ece9e2]/65">
              Entry is free
            </span>
            <Serif
              before="Register"
              em="your"
              after="school"
              className="mx-auto mt-7 max-w-3xl text-[clamp(2.5rem,6vw,5rem)]"
            />
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[#ece9e2]/60">
              Open to every public and private secondary school in the seven LGAs of Cross
              River South.
            </p>

            <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-[#ece9e2]/12 p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ece9e2]/45">
                {countdown.label}
              </p>
              <Countdown
                targetIso={countdown.targetIso}
                className="mt-4 justify-center"
                boxClass="text-center"
                valueClass="font-serif text-3xl sm:text-4xl"
                labelClass="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#ece9e2]/40"
              />
            </div>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ArrowPill href="#register" tone="lime">
                Start Registration
              </ArrowPill>
              <a
                href="#stages"
                className="rounded-full border border-[#ece9e2]/25 px-6 py-3.5 text-[14px] font-medium transition hover:bg-[#ece9e2]/10"
              >
                How It Works
              </a>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-[#ece9e2]/30">
              {countdown.note}
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mx-auto max-w-6xl px-5 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo variant="blue" width={140} />
            <p className="mt-6 max-w-xs font-serif text-2xl leading-snug">{brand.tagline}</p>
            <p className="mt-6 text-[13px] leading-relaxed text-[#1e2b23]/50">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[10px] font-bold uppercase text-[#1e2b23]/60 transition hover:bg-[#d8f651] hover:text-[#1e2b23]"
                >
                  {s.name.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1e2b23]/40">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-[13px]">
              {footerLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[#1e2b23]/60 transition hover:text-[#1e2b23]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1e2b23]/40">
              Portals
            </p>
            <ul className="mt-5 space-y-3 text-[13px]">
              {portalLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[#1e2b23]/60 transition hover:text-[#1e2b23]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#1e2b23]/12 py-6 text-[11px] text-[#1e2b23]/40">
          <span>
            © 2026 {brand.short}. {brand.edition}.
          </span>
          <span>Phase 0 demo homepage — Variant C</span>
        </div>
        <Ribbon className="rounded-full" />
      </footer>

      <div className="h-14" />
      <VariantSwitcher />
    </div>
  );
}
