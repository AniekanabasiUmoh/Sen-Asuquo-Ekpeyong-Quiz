import Image from "next/image";
import { Logo, Ribbon } from "@/components/brand";
import { Countdown } from "@/components/countdown";
import { Accordion } from "@/components/accordion";
import {
  brand,
  contact,
  countdown,
  faq,
  featuredSchools,
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

/* The SAEAC homepage. Chosen from the Phase 0 review as the site's design
   direction; the other four concepts remain at /b–/e, indexed at /directions.

   Bold Editorial (reference: Caladan)
   Light, image-led, generous whitespace. Floating pill nav over a full-bleed
   photographic hero; a soft off-white body carrying bento grids, rule-separated
   lists with thumbnails, and a two-tone headline treatment. Navy and gold are
   used as accents, not as the entire surface. */

/** Headline where the second half drops to a muted tone — the reference's
    signature two-tone treatment. */
function Split({
  lead,
  trail,
  className = "",
  trailClass = "text-[#0d2270]/35",
}: {
  lead: string;
  trail: string;
  className?: string;
  trailClass?: string;
}) {
  return (
    <h2 className={`font-display font-extrabold tracking-[-0.02em] ${className}`}>
      {lead} <span className={trailClass}>{trail}</span>
    </h2>
  );
}

function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0d2270]/70 ${className}`}
    >
      {children}
    </span>
  );
}

const stageThumbs = [
  "/img/students-walking.jpg",
  "/img/students-exam.jpg",
  "/img/classroom-diverse.jpg",
  "/img/students-lecture.jpg",
  "/img/girls-classroom.jpg",
  "/img/students-posing.jpg",
  "/img/trophy-teen.jpg",
];

export default function VariantA() {
  return (
    <div className="bg-[#faf6ee] text-[#0d2270]">
      {/* ── Hero: full-bleed photograph, floating pill nav, headline low-left ── */}
      <section className="relative isolate min-h-[92svh] overflow-hidden px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="relative flex min-h-[calc(92svh-1.5rem)] flex-col overflow-hidden rounded-[28px]">
          <Image
            src="/img/students-hero.jpg"
            alt="Secondary school students in uniform"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-[center_30%]"
          />
          {/* Legibility scrim — dark at the foot where the type sits, clear at the top */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06122f] via-[#06122f]/25 via-45% to-transparent" />
          <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/35 to-transparent" />

          {/* Floating pill nav */}
          <div className="relative z-20 px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-full border border-white/15 bg-white/10 px-3 py-2 pl-5 backdrop-blur-xl">
              <Logo variant="white" width={110} className="h-auto w-[78px] shrink-0 sm:w-[96px]" />
              <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/85 lg:flex">
                {nav.map((n) => (
                  <a key={n.label} href={n.href} className="transition hover:text-white">
                    {n.label}
                  </a>
                ))}
              </nav>
              <a
                href="#register"
                className="shrink-0 rounded-full bg-[#ffe169] px-5 py-2.5 text-[12px] font-bold text-[#0d2270] transition hover:bg-white"
              >
                Register
              </a>
            </div>
          </div>

          {/* Headline block, anchored bottom-left */}
          <div className="relative z-10 mt-auto px-6 pb-8 sm:px-10 sm:pb-10">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/85 backdrop-blur sm:text-[10px] sm:tracking-[0.18em]">
                {hero.eyebrow}
              </span>
              <h1 className="mt-6 font-display text-[clamp(3rem,8.5vw,7.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-white">
                Who Wins <span className="text-white/45">This?</span>
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/75 sm:text-base">
                {hero.subhead}
              </p>
            </div>
          </div>

          {/* Inline action bar — the reference's booking strip, re-purposed */}
          <div className="relative z-10 px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="flex flex-col gap-5 rounded-[20px] border border-white/12 bg-white/10 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                  {countdown.label}
                </p>
                <Countdown
                  targetIso={countdown.targetIso}
                  className="mt-2.5 gap-5 sm:gap-7"
                  boxClass="!min-w-0 !flex-none text-left"
                  valueClass="font-display text-3xl font-extrabold text-white sm:text-4xl"
                  labelClass="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/50"
                />
              </div>
              <div className="flex shrink-0 flex-wrap gap-3 [&>a]:flex-1 [&>a]:text-center md:[&>a]:flex-none">
                <a
                  href={hero.primaryCta.href}
                  className="rounded-full bg-[#ffe169] px-7 py-3.5 text-[13px] font-bold text-[#0d2270] transition hover:bg-white"
                >
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="rounded-full border border-white/30 px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-white/10"
                >
                  {hero.secondaryCta.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats: quiet rule-separated row on the light ground ── */}
      <section className="mx-auto max-w-7xl px-5 pb-4 pt-16 sm:pt-20">
        <div className="grid grid-cols-2 gap-y-10 border-y border-black/10 py-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="px-2 md:border-l md:border-black/10 md:first:border-l-0 md:px-8">
              <div
                className="font-display text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl"
                style={{ color: ["#f44423", "#fe6c03", "#2dc653", "#0006eb"][i] }}
              >
                {s.value}
              </div>
              <div className="mt-2 text-[13px] font-semibold">{s.label}</div>
              <div className="mt-0.5 text-[13px] text-[#0d2270]/45">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview + bento grid ── */}
      <section id="overview" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow>Academic Excellence</Eyebrow>
            <Split
              lead="The Championship,"
              trail="End to End"
              className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
            />
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-[#0d2270]/60 lg:pb-2">
            {overview.body}
          </p>
        </div>

        {/* Bento: large image + card, then card + card + image */}
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-[420px]">
            <Image
              src="/img/students-exam.jpg"
              alt="Students sitting a written examination"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-16">
              <h3 className="font-display text-xl font-bold text-white">
                Screened in Every School
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-white/70">
                Three examinations on a single day. The top five students carry the
                school's name forward.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-2xl bg-white p-7 md:p-9">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d2270]/5 font-display text-lg font-extrabold">
              7
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Seven Subject Areas</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#0d2270]/55">
                Every question drawn from the national curriculum, spread across the
                sciences, the arts, commerce and civic life.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {overview.subjects.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-black/10 px-3.5 py-1.5 text-[13px] text-[#0d2270]/75"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {showdown.mechanics.slice(0, 2).map((m) => (
            <div key={m.name} className="rounded-2xl bg-white p-7 md:p-9">
              <h3 className="font-display text-lg font-bold">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#0d2270]/55">{m.body}</p>
            </div>
          ))}
          <div className="relative min-h-[240px] overflow-hidden rounded-2xl">
            <Image
              src="/img/trophy-teen.jpg"
              alt="A student holding a trophy"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-14">
              <h3 className="font-display text-lg font-bold text-white">
                One Grand Champion
              </h3>
              <p className="mt-1 text-sm text-white/70">Crowned live on television.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stages: thin rules, number, title, copy, thumbnail right ── */}
      <section id="stages" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Split
            lead="The Road to"
            trail="the Finale"
            className="text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
          <p className="max-w-xs text-[15px] leading-relaxed text-[#0d2270]/55">
            Seven stages take 117 schools down to a single champion.
          </p>
        </div>

        <ol className="mt-12">
          {stages.map((st, i) => (
            <li
              key={st.n}
              className="group grid items-center gap-x-8 gap-y-4 border-t border-black/10 py-6 last:border-b md:grid-cols-[2.5rem_1.1fr_1.2fr_9.5rem]"
            >
              <span className="font-mono text-[11px] text-[#0d2270]/35">
                {String(st.n).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[22px] font-bold leading-tight sm:text-2xl">
                {st.name}
              </h3>
              <p className="text-sm leading-relaxed text-[#0d2270]/55">{st.summary}</p>
              <div className="flex flex-col items-start gap-2.5 md:items-end md:justify-self-end">
                <div className="relative h-28 w-full overflow-hidden rounded-xl md:h-[76px] md:w-[136px]">
                  <Image
                    src={stageThumbs[i] ?? stageThumbs[0]}
                    alt=""
                    fill
                    sizes="136px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-[#0d2270]/45 md:text-right">
                  {st.field}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Showdown: dark inset panel, the one heavy moment on the page ── */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="relative overflow-hidden rounded-[28px] bg-[#06122f] px-6 py-16 text-white sm:px-12 sm:py-20">
          <Image
            src="/img/students-posing.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-[0.14]"
          />
          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-white/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
              Round 3 · Live Format
            </span>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,4.6vw,3.5rem)] font-extrabold leading-[1.03] tracking-[-0.02em]">
              {showdown.title} <span className="text-white/40">Live on Stage</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60">
              {showdown.intro}
            </p>

            <div className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {showdown.mechanics.map((m) => (
                <div key={m.name} className="border-t border-white/15 pt-5">
                  <h3 className="font-display text-lg font-bold text-[#ffe169]">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LGAs ── */}
      <section id="lgas" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Cross River South</Eyebrow>
            <Split
              lead="Seven LGAs,"
              trail="One District"
              className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
            />
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-[#0d2270]/55">{lgaNote}</p>
        </div>

        {/* Photo tiles — each LGA gets a face, not just a row in a table */}
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {lgas.map((l) => (
            <div
              key={l.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={l.img}
                alt={`Secondary school students in ${l.name}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              {l.combined && (
                <span className="absolute left-4 top-4 rounded-full bg-[#ffe169] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0d2270]">
                  Combined
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
                  {l.name}
                </h3>
                <p className="mt-1 text-[13px] text-white/70">{l.schools} schools</p>
              </div>
            </div>
          ))}

          {/* Eighth tile completes the 4-up grid and carries the total */}
          <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-[#0d2270] p-5 text-white">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
              Across the District
            </span>
            <div>
              <div className="font-display text-6xl font-extrabold leading-none text-[#ffe169]">
                117
              </div>
              <p className="mt-2 text-[13px] text-white/70">
                Secondary schools eligible to enter
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Schools of the District ── */}
      <section id="schools" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Who&rsquo;s Competing</Eyebrow>
            <Split
              lead="Schools of"
              trail="the District"
              className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
            />
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-[#0d2270]/55">
            From Creek Town to Akamkpa, schools across all seven LGAs line up for the
            maiden edition. A few of them below.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSchools.map((s) => (
            <article
              key={s.name}
              className="group overflow-hidden rounded-2xl bg-white transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={s.img}
                  alt={`Students of ${s.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0d2270] backdrop-blur">
                  {s.lga}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[17px] font-bold leading-snug">{s.name}</h3>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-[13px] text-[#0d2270]/40">
          Every registered school appears here once registration opens.
        </p>
      </section>

      {/* ── Prizes ── */}
      <section id="prizes" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="text-center">
          <Eyebrow>What's at Stake</Eyebrow>
          <Split
            lead="The Prizes,"
            trail="Shared"
            className="mx-auto mt-5 max-w-3xl text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#0d2270]/55">
            Every award is split between the winning school and the students who earned
            it — so the investment outlives the competition.
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {prizes.map((p, i) => (
            <div
              key={p.tier}
              className={`flex flex-col rounded-2xl p-7 sm:p-9 ${
                i === 0 ? "bg-[#0d2270] text-white" : "bg-white"
              }`}
            >
              <h3
                className={`font-display text-2xl font-extrabold ${
                  i === 0 ? "text-[#ffe169]" : ""
                }`}
              >
                {p.tier}
              </h3>
              <div className="mt-7 space-y-6 text-sm">
                <div>
                  <p
                    className={`mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      i === 0 ? "text-white/45" : "text-[#0d2270]/40"
                    }`}
                  >
                    School
                  </p>
                  <p className={i === 0 ? "text-white/80" : "text-[#0d2270]/70"}>{p.school}</p>
                </div>
                <div>
                  <p
                    className={`mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      i === 0 ? "text-white/45" : "text-[#0d2270]/40"
                    }`}
                  >
                    Students
                  </p>
                  <p className={i === 0 ? "text-white/80" : "text-[#0d2270]/70"}>{p.student}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid items-stretch gap-3 md:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl bg-white p-7 sm:p-9">
            <h3 className="font-display text-xl font-bold">{mentorPrize.title}</h3>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#0d2270]/55">
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
      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="text-center">
          <Eyebrow>Before You Enter</Eyebrow>
          <Split
            lead="Your Questions,"
            trail="Answered"
            className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
        </div>
        <Accordion
          items={faq}
          className="mt-10 space-y-2.5"
          itemClass="rounded-2xl bg-white px-6 py-5"
          questionClass="text-[15px] font-semibold"
          answerClass="pt-3 text-sm leading-relaxed text-[#0d2270]/55"
        />
      </section>

      {/* ── News ── */}
      <section id="news" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Split
            lead="Latest from"
            trail="the Championship"
            className="text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
          <a
            href="#news"
            className="rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:bg-white"
          >
            All updates
          </a>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {news.map((n, i) => (
            <article key={n.title} className="overflow-hidden rounded-2xl bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src={
                    ["/img/nigerian-girls.jpg", "/img/students-lecture.jpg", "/img/schoolgirl-portrait.jpg"][i] ??
                    "/img/students-walking.jpg"
                  }
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="font-bold uppercase tracking-wider text-[#0d2270]/45">
                    {n.category}
                  </span>
                  <span className="text-[#0d2270]/25">·</span>
                  <time className="text-[#0d2270]/45">
                    {new Date(n.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#0d2270]/55">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Register CTA ── */}
      <section id="register" className="mx-auto max-w-7xl px-5 py-8">
        <div className="relative overflow-hidden rounded-[28px] px-6 py-20 text-center sm:px-12 sm:py-28">
          <Image
            src="/img/students-walking.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-[#06122f]/72" />
          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-white/25 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
              Entry is free
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white">
              Register <span className="text-white/45">Your School</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
              Open to every public and private secondary school in the seven LGAs of
              Cross River South.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="#register"
                className="rounded-full bg-[#ffe169] px-8 py-4 text-[13px] font-bold text-[#0d2270] transition hover:bg-white"
              >
                Start Registration
              </a>
              <a
                href="#stages"
                className="rounded-full border border-white/30 px-8 py-4 text-[13px] font-bold text-white transition hover:bg-white/10"
              >
                How It Works
              </a>
            </div>
            <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-white/40">
              {countdown.note}
            </p>
          </div>
        </div>
      </section>

      {/* ── Sponsors ── */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#0d2270]/35">
          Sponsors &amp; Partners
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {sponsors.map((s, i) => (
            <span
              key={`${s}-${i}`}
              className="text-[13px] font-semibold text-[#0d2270]/35"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ── Footer: dark card with the oversized glowing wordmark ── */}
      <footer className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-[28px] bg-[#06122f] pt-14 text-white">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
              <div>
                <Logo variant="white" width={150} />
                <p className="mt-6 max-w-xs font-display text-xl font-bold leading-snug">
                  {brand.tagline}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-white/45">
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
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[10px] font-bold text-white/60 transition hover:border-[#ffe169] hover:text-[#ffe169]"
                    >
                      {s.name.slice(0, 2)}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                  Explore
                </p>
                <ul className="mt-5 space-y-3 text-sm">
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
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                  Portals
                </p>
                <ul className="mt-5 space-y-3 text-sm">
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

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[12px] text-white/35">
              <span>
                © 2026 {brand.short}. {brand.edition}.
              </span>
              <span>Phase 0 demo homepage — Variant A</span>
            </div>
          </div>

          {/* Oversized wordmark, bleeding off the bottom edge */}
          <div
            className="select-none px-4 text-center font-display text-[clamp(4rem,17vw,15rem)] font-extrabold leading-[0.78] tracking-[-0.045em] text-white/[0.07]"
            aria-hidden="true"
          >
            SAEAC
          </div>
          <Ribbon />
        </div>
      </footer>
    </div>
  );
}
