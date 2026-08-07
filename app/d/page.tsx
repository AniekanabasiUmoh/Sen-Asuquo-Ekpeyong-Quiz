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

export const metadata: Metadata = { title: "Variant D · Warm Community" };

/* Variant D — Warm Community (reference: Safeer)
   A top nav with the wordmark in a centred notched tab, a full-bleed rounded
   hero, and a fanned row of tilted cards overlapping the hero's base.
   Parenthesised section labels, alternating card-and-image mosaics, and
   circular arrow buttons. Approachable — aimed at parents, teachers, schools. */

/** "(Section Label)" — the reference's quiet parenthesised eyebrow. */
function Paren({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-[#1b1b1b]/45">({children})</p>
  );
}

function ArrowBtn({
  href,
  label,
  tone = "dark",
}: {
  href: string;
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <a href={href} className="group inline-flex items-center gap-2" aria-label={label}>
      <span
        className={`rounded-full px-6 py-3.5 text-[14px] font-medium transition ${
          tone === "dark"
            ? "bg-[#141414] text-white group-hover:bg-[#2b2b2b]"
            : "bg-white text-[#141414] group-hover:bg-white/85"
        }`}
      >
        {label}
      </span>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full transition group-hover:rotate-45 ${
          tone === "dark" ? "bg-[#141414] text-white" : "bg-white text-[#141414]"
        }`}
        aria-hidden="true"
      >
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
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

/** Small circular arrow used inside mosaic cards. */
function MiniArrow({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition group-hover:rotate-45 ${
        dark ? "bg-white text-[#141414]" : "bg-[#141414] text-white"
      }`}
      aria-hidden="true"
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 11L11 3M11 3H4.5M11 3V9.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** The fanned card row that overlaps the hero base. */
const fanned = [
  { src: "/img/students-walking.jpg", rot: "-rotate-6", y: "translate-y-5" },
  { src: "/img/students-exam.jpg", rot: "-rotate-3", y: "translate-y-1.5" },
  { src: "/img/students-posing.jpg", rot: "rotate-0", y: "-translate-y-2" },
  { src: "/img/girls-classroom.jpg", rot: "rotate-3", y: "translate-y-1.5" },
  { src: "/img/trophy-teen.jpg", rot: "rotate-6", y: "translate-y-5" },
];

export default function VariantD() {
  return (
    <div className="bg-[#f7f6f4] text-[#1b1b1b]">
      {/* ── Hero ── */}
      <section className="px-3 pt-3">
        <div className="relative overflow-hidden rounded-[26px]">
          <Image
            src="/img/students-hero.jpg"
            alt="Secondary school students in uniform"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_28%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-[#0a0a0a]/85" />

          {/* Top nav with the centred notched wordmark tab */}
          <div className="relative z-20 flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
            <nav className="hidden items-center gap-8 text-[13px] font-medium text-white/80 lg:flex">
              {nav.slice(0, 3).map((n) => (
                <a key={n.label} href={n.href} className="transition hover:text-white">
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="rounded-b-2xl bg-[#f7f6f4] px-7 py-3 lg:absolute lg:left-1/2 lg:top-0 lg:-translate-x-1/2">
              <Logo variant="blue" width={110} className="h-auto w-[84px] sm:w-[104px]" />
            </div>

            <div className="flex items-center gap-6">
              <nav className="hidden items-center gap-8 text-[13px] font-medium text-white/80 lg:flex">
                {nav.slice(3).map((n) => (
                  <a key={n.label} href={n.href} className="transition hover:text-white">
                    {n.label}
                  </a>
                ))}
              </nav>
              <a
                href="#register"
                className="whitespace-nowrap text-[13px] font-medium text-white transition hover:opacity-70"
              >
                Register ↗
              </a>
            </div>
          </div>

          <div className="relative z-10 px-6 pb-6 pt-24 text-center sm:pt-32">
            <h1 className="mx-auto max-w-4xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
              Who Wins This?
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/70">
              {hero.subhead}
            </p>
            <div className="mt-9 flex justify-center">
              <ArrowBtn href={hero.primaryCta.href} label={hero.primaryCta.label} tone="light" />
            </div>

            {/* Fanned card row */}
            <div className="mt-16 flex items-end justify-center gap-2 sm:gap-3">
              {fanned.map((c, i) => (
                <div
                  key={c.src}
                  className={`relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl shadow-2xl transition duration-500 hover:!rotate-0 hover:!translate-y-0 sm:w-32 lg:w-40 ${c.rot} ${c.y} ${
                    i > 2 ? "hidden sm:block" : ""
                  }`}
                >
                  <Image
                    src={c.src}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority={i < 3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About: rating-style stat left, statement right ── */}
      <section id="overview" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Paren>About the Championship</Paren>
        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="font-display text-6xl font-medium tracking-[-0.03em] sm:text-7xl">
              117
            </div>
            <div className="mt-3 flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span key={i} className="h-1.5 w-6 rounded-full bg-[#f4a300]" />
              ))}
            </div>
            <p className="mt-4 text-[14px] font-medium">Schools across seven LGAs</p>
            <div className="mt-5 flex items-center">
              {["/img/schoolgirl-portrait.jpg", "/img/nigerian-girls.jpg", "/img/students-posing.jpg"].map(
                (src, i) => (
                  <div
                    key={src}
                    className={`relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#f7f6f4] ${
                      i > 0 ? "-ml-3" : ""
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                ),
              )}
              <span className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f7f6f4] bg-[#141414] text-[11px] font-bold text-white">
                585
              </span>
            </div>
          </div>

          <div>
            <p className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-snug tracking-[-0.02em]">
              Beyond examinations. Connecting schools, celebrating teachers, and putting
              Cross River South on a national stage.
            </p>
            <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-[#1b1b1b]/55">
              {overview.body}
            </p>
            <div className="mt-8">
              <ArrowBtn href="#stages" label="How It Works" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stages: dark panel with the card + image mosaic ── */}
      <section id="stages" className="px-3">
        <div className="rounded-[26px] bg-[#0f0f0f] px-5 py-16 text-white sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="text-[13px] text-white/40">(The Road to the Finale)</p>
            <ArrowBtn href="#stages" label="All Stages" tone="light" />
          </div>

          {/* Mosaic: info card, image, image — alternating direction each row */}
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {stages.map((st, i) => {
              const isCard = i % 3 === 0 || i % 3 === 2;
              if (!isCard) {
                return (
                  <div
                    key={st.n}
                    className="relative min-h-[240px] overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={
                        ["/img/classroom-diverse.jpg", "/img/students-outdoors.jpg", "/img/graduates.jpg"][
                          Math.floor(i / 3)
                        ] ?? "/img/students-lecture.jpg"
                      }
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-14">
                      <h3 className="font-display text-lg font-medium">{st.name}</h3>
                      <p className="mt-1 text-[12px] text-white/60">{st.field}</p>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={st.n}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161616] p-6"
                >
                  <div>
                    <h3 className="font-display text-xl font-medium">{st.name}</h3>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-white/50">
                      {st.summary}
                    </p>
                  </div>
                  <div className="mt-7 border-t border-white/10 pt-4">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                      Field
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <p className="text-[13px] font-medium">{st.field}</p>
                      <span className="text-[11px] tabular-nums text-white/30">
                        Stage {String(st.n).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Explore: LGA tiles with arrow buttons ── */}
      <section id="lgas" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="text-center">
          <Paren>Explore the District</Paren>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.025em]">
            Seven Local Government Areas, one championship
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-[#1b1b1b]/55">
            {lgaNote}
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lgas.map((l, i) => (
            <div
              key={l.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={
                  [
                    "/img/students-walking.jpg",
                    "/img/classroom-diverse.jpg",
                    "/img/girls-classroom.jpg",
                    "/img/students-outdoors.jpg",
                    "/img/students-lecture.jpg",
                    "/img/nigerian-girls.jpg",
                    "/img/students-posing.jpg",
                  ][i] ?? "/img/students-hero.jpg"
                }
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16">
                <div>
                  <h3 className="font-display text-lg font-medium leading-tight text-white">
                    {l.name}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-white/65">
                    {l.schools} schools
                    {l.combined && " · Combined"}
                  </p>
                </div>
                <MiniArrow dark />
              </div>
            </div>
          ))}

          <div className="flex flex-col items-start justify-between rounded-2xl bg-[#141414] p-6 text-white">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
              Total Schools
            </p>
            <div>
              <div className="font-display text-5xl font-medium tracking-[-0.03em]">117</div>
              <p className="mt-2 text-[12px] text-white/50">Across the district</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Showdown ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:pb-28">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/img/students-posing.jpg"
              alt="A school team on stage"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <Paren>Round 3 · Live Format</Paren>
            <h2 className="mt-5 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.025em]">
              {showdown.title}
            </h2>
            <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-[#1b1b1b]/55">
              {showdown.intro}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {showdown.mechanics.map((m) => (
                <div key={m.name} className="rounded-2xl bg-white p-5">
                  <h3 className="font-display text-base font-semibold">{m.name}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#1b1b1b]/55">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:pb-28">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statsAll.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white px-6 py-8">
              <div className="font-display text-5xl font-medium tracking-[-0.03em]">
                {s.display}
              </div>
              <div className="mt-3 text-[13px] font-medium">{s.label}</div>
              <div className="mt-0.5 text-[12px] text-[#1b1b1b]/45">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prizes ── */}
      <section id="prizes" className="mx-auto max-w-6xl px-5 pb-20 sm:pb-28">
        <div className="text-center">
          <Paren>What&rsquo;s at Stake</Paren>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.025em]">
            Prizes shared between the school and its students
          </h2>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {prizes.map((p, i) => (
            <div
              key={p.tier}
              className={`rounded-2xl p-7 ${i === 0 ? "bg-[#141414] text-white" : "bg-white"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-xl font-semibold">{p.tier}</h3>
                {i === 0 && (
                  <span className="rounded-full bg-[#f4a300] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#141414]">
                    Top Prize
                  </span>
                )}
              </div>
              <div
                className={`mt-6 space-y-5 border-t pt-5 ${
                  i === 0 ? "border-white/12" : "border-[#1b1b1b]/10"
                }`}
              >
                <div>
                  <p
                    className={`mb-1.5 text-[10px] uppercase tracking-[0.16em] ${
                      i === 0 ? "text-white/40" : "text-[#1b1b1b]/40"
                    }`}
                  >
                    School
                  </p>
                  <p
                    className={`text-[13px] leading-relaxed ${
                      i === 0 ? "text-white/70" : "text-[#1b1b1b]/60"
                    }`}
                  >
                    {p.school}
                  </p>
                </div>
                <div>
                  <p
                    className={`mb-1.5 text-[10px] uppercase tracking-[0.16em] ${
                      i === 0 ? "text-white/40" : "text-[#1b1b1b]/40"
                    }`}
                  >
                    Students
                  </p>
                  <p
                    className={`text-[13px] leading-relaxed ${
                      i === 0 ? "text-white/70" : "text-[#1b1b1b]/60"
                    }`}
                  >
                    {p.student}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl bg-white p-7">
          <h3 className="font-display text-lg font-semibold">{mentorPrize.title}</h3>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-[#1b1b1b]/55">
            {mentorPrize.body}
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:pb-28">
        <div className="text-center">
          <Paren>Common Questions</Paren>
          <h2 className="mt-5 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.025em]">
            Everything a school needs to know
          </h2>
        </div>
        <Accordion
          items={faq}
          className="mt-10 space-y-3"
          itemClass="rounded-2xl bg-white px-6 py-5"
          questionClass="text-[15px] font-medium"
          answerClass="pt-3 text-[13px] leading-relaxed text-[#1b1b1b]/55"
        />
      </section>

      {/* ── News ── */}
      <section id="news" className="mx-auto max-w-6xl px-5 pb-20 sm:pb-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Paren>Latest Updates</Paren>
            <h2 className="mt-5 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.025em]">
              News from the championship
            </h2>
          </div>
          <ArrowBtn href="#news" label="All Updates" />
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {news.map((n, i) => (
            <article key={n.title} className="group overflow-hidden rounded-2xl bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src={
                    ["/img/nigerian-girls.jpg", "/img/students-lecture.jpg", "/img/schoolgirl-portrait.jpg"][i] ??
                    "/img/students-walking.jpg"
                  }
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2.5 text-[11px] text-[#1b1b1b]/45">
                  <span className="font-semibold uppercase tracking-[0.12em]">{n.category}</span>
                  <span>·</span>
                  <time>
                    {new Date(n.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
                  {n.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#1b1b1b]/55">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Register ── */}
      <section id="register" className="px-3 pb-3">
        <div className="relative overflow-hidden rounded-[26px] px-6 py-20 text-center sm:py-28">
          <Image
            src="/img/graduates.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0a0a0a]/72" />
          <div className="relative">
            <p className="text-[13px] text-white/50">(Entry is free)</p>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
              Register your school today
            </h2>

            <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                {countdown.label}
              </p>
              <Countdown
                targetIso={countdown.targetIso}
                className="mt-4 justify-center"
                boxClass="text-center"
                valueClass="font-display text-3xl font-medium text-white sm:text-4xl"
                labelClass="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/45"
              />
            </div>

            <div className="mt-9 flex justify-center">
              <ArrowBtn href="#register" label="Start Registration" tone="light" />
            </div>
            <p className="mt-6 text-[11px] text-white/40">{countdown.note}</p>
          </div>
        </div>
      </section>

      {/* ── Sponsors ── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Paren>Sponsors &amp; Partners</Paren>
        <div className="mt-7 flex flex-wrap items-center gap-x-10 gap-y-4">
          {sponsors.map((s, i) => (
            <span key={`${s}-${i}`} className="text-[13px] text-[#1b1b1b]/35">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-3 pb-3">
        <div className="rounded-[26px] bg-[#0f0f0f] px-6 pt-14 text-white sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Logo variant="white" width={140} />
              <p className="mt-6 max-w-xs font-display text-xl font-medium leading-snug">
                {brand.tagline}
              </p>
              <p className="mt-6 text-[13px] leading-relaxed text-white/45">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold uppercase text-white/60 transition hover:bg-white hover:text-[#0f0f0f]"
                  >
                    {s.name.slice(0, 2)}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[13px] text-white/35">(Explore)</p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {footerLinks.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-white/60 transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[13px] text-white/35">(Portals)</p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {portalLinks.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-white/60 transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[11px] text-white/35">
            <span>
              © 2026 {brand.short}. {brand.edition}.
            </span>
            <span>Phase 0 demo homepage · Variant D</span>
          </div>
          <Ribbon className="rounded-full" />
          <div className="h-4" />
        </div>
      </footer>

      <div className="h-14" />
      <VariantSwitcher />
    </div>
  );
}
