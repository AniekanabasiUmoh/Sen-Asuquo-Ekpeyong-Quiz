import Image from "next/image";
import { DiagonalRibbon, Logo, Ribbon } from "@/components/brand";
import { Countdown } from "@/components/countdown";
import { Accordion } from "@/components/accordion";
import { YouTubeEmbed } from "@/components/video";
import { CountUp, Reveal } from "@/components/reveal";
import { StrikerIllustration } from "@/components/striker";
import {
  about,
  board,
  brand,
  changeMaker,
  championsWin,
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
  navCtas,
  news,
  origin,
  overview,
  portalLinks,
  principalsMeeting,
  prizes,
  senator,
  showdown,
  sponsors,
  stages,
  stats,
  statsFinancial,
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
  trailClass = "text-[#003090]/35",
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
      className={`inline-flex items-center rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#003090]/70 ${className}`}
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
    <div className="bg-[#faf6ee] text-[#003090]">
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

          {/* Floating nav — logo and actions on one row, links beneath */}
          <div className="relative z-20 px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="mx-auto max-w-6xl rounded-[26px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl sm:px-5">
              <div className="flex items-center justify-between gap-4">
                <Logo variant="white" width={110} className="h-auto w-[78px] shrink-0 sm:w-[96px]" />
                <div className="flex shrink-0 items-center gap-2.5">
                  <a
                    href={navCtas.secondary.href}
                    className="hidden rounded-full border border-white/30 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-white/10 sm:inline-block"
                  >
                    {navCtas.secondary.label}
                  </a>
                  <a
                    href={navCtas.primary.href}
                    className="rounded-full bg-[#f0a800] px-5 py-2.5 text-[12px] font-bold text-[#003090] transition hover:bg-white"
                  >
                    Register Your School
                  </a>
                </div>
              </div>

              <nav className="mt-3 hidden flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/12 pt-3 text-[12.5px] font-medium text-white/80 lg:flex">
                {nav.map((n) => (
                  <a
                    key={n.label}
                    href={n.href}
                    className="inline-flex items-center gap-1.5 transition hover:text-white"
                  >
                    {n.label}
                    {"soon" in n && n.soon && (
                      <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/70">
                        Soon
                      </span>
                    )}
                  </a>
                ))}
              </nav>
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
                {hero.tagline}
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
                  className="rounded-full bg-[#f0a800] px-7 py-3.5 text-[13px] font-bold text-[#003090] transition hover:bg-white"
                >
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="rounded-full border border-white/30 px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-white/10"
                >
                  {hero.secondaryCta.label}
                </a>
                <a
                  href={hero.tertiaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-bold text-white/85 transition hover:text-white"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden="true">
                      <path d="M8 4.5 0 9V0l8 4.5Z" fill="currentColor" />
                    </svg>
                  </span>
                  {hero.tertiaryCta.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live statistics: counters animate as they scroll into view ── */}
      <section className="mx-auto max-w-7xl px-5 pb-4 pt-16 sm:pt-20">
        <div className="grid grid-cols-2 gap-y-10 border-y border-black/10 py-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className="px-2 md:border-l md:border-black/10 md:first:border-l-0 md:px-8"
            >
              <div
                className="font-display text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl"
                style={{ color: ["#f03018", "#fe6c03", "#2dc653", "#0006eb"][i] }}
              >
                <CountUp value={s.count} suffix={"suffix" in s ? s.suffix : ""} />
              </div>
              <div className="mt-2 text-[13px] font-semibold">{s.label}</div>
              <div className="mt-0.5 text-[13px] text-[#003090]/45">{s.note}</div>
            </Reveal>
          ))}
        </div>

        {/* Supporting financial figures */}
        <div className="grid grid-cols-1 gap-y-8 border-b border-black/10 py-8 sm:grid-cols-3">
          {statsFinancial.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className="px-2 sm:border-l sm:border-black/10 sm:first:border-l-0 sm:px-8"
            >
              <div className="font-display text-3xl font-extrabold tracking-[-0.02em]">
                {s.display}
              </div>
              <div className="mt-1.5 text-[13px] font-semibold">{s.label}</div>
              <div className="mt-0.5 text-[13px] text-[#003090]/45">{s.note}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── About SAEAC + bento grid ── */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <Reveal className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <Split
              lead={about.title}
              trail={about.titleTrail}
              className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
            />
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-[#003090]/60 lg:pb-2">
            {about.body}
          </p>
        </Reveal>

        <span id="overview" className="block scroll-mt-24" aria-hidden="true" />

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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003090]/5 font-display text-lg font-extrabold">
              7
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Seven Subject Areas</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#003090]/55">
                Every question drawn from the national curriculum, spread across the
                sciences, the arts, commerce and civic life.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {overview.subjects.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-black/10 px-3.5 py-1.5 text-[13px] text-[#003090]/75"
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
              <p className="mt-2 text-sm leading-relaxed text-[#003090]/55">{m.body}</p>
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

      {/* ── Message from the Patron: video left, quote right ── */}
      <section id="patron" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="overflow-hidden rounded-[28px] bg-[#003090] text-white">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-5 sm:p-7 lg:p-8">
              <YouTubeEmbed
                id={senator.video.youTubeId}
                title={senator.video.title}
                poster={senator.video.poster}
              />
            </div>

            <div className="flex flex-col justify-center px-7 pb-10 sm:px-9 lg:py-12 lg:pl-2 lg:pr-10">
              <span className="inline-flex w-fit items-center rounded-full border border-white/25 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                {senator.eyebrow}
              </span>

              <blockquote className="mt-6">
                <p className="font-display text-[21px] font-medium leading-[1.35] sm:text-2xl">
                  &ldquo;{senator.quote}&rdquo;
                </p>
              </blockquote>

              <div className="mt-7 flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={senator.portrait}
                    alt={senator.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-[15px] font-bold">{senator.name}</p>
                  <p className="text-[13px] text-white/60">{senator.role}</p>
                </div>
              </div>
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
          <p className="max-w-xs text-[15px] leading-relaxed text-[#003090]/55">
            Seven stages take the whole district down to a single champion.
          </p>
        </div>

        <ol className="mt-12">
          {stages.map((st, i) => (
            <li
              key={st.n}
              className="group grid items-center gap-x-8 gap-y-4 border-t border-black/10 py-6 last:border-b md:grid-cols-[2.5rem_1.1fr_1.2fr_9.5rem]"
            >
              <span className="font-mono text-[11px] text-[#003090]/35">
                {String(st.n).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[22px] font-bold leading-tight sm:text-2xl">
                {st.name}
              </h3>
              <p className="text-sm leading-relaxed text-[#003090]/55">{st.summary}</p>
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
                <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-[#003090]/45 md:text-right">
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
          <DiagonalRibbon className="opacity-90" />
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

            <div className="mt-12 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
              <Reveal className="mx-auto w-40 shrink-0 sm:w-48 lg:mx-0">
                <StrikerIllustration className="w-full" />
                <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#f0a800]">
                  The Striker
                </p>
              </Reveal>

              <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
                {showdown.mechanics.map((m, i) => (
                  <Reveal key={m.name} delay={i * 80} className="border-t border-white/15 pt-5">
                    <h3 className="font-display text-lg font-bold text-[#f0a800]">{m.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{m.body}</p>
                  </Reveal>
                ))}
              </div>
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
          <p className="max-w-sm text-[15px] leading-relaxed text-[#003090]/55">{lgaNote}</p>
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
                <span className="absolute left-4 top-4 rounded-full bg-[#f0a800] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#003090]">
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
          <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-[#003090] p-5 text-white">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
              Across the District
            </span>
            <div>
              <div className="font-display text-5xl font-extrabold leading-none text-[#f0a800]">
                250+
              </div>
              <p className="mt-2 text-[13px] text-white/70">
                Secondary schools eligible to enter
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest from Schools: the principals' engagement ── */}
      <section id="principals" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <Eyebrow>{principalsMeeting.eyebrow}</Eyebrow>
            <Split
              lead={principalsMeeting.title}
              trail={principalsMeeting.titleTrail}
              className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
            />
            <p className="mt-4 text-[13px] font-semibold text-[#003090]/45">
              {principalsMeeting.date} · {principalsMeeting.venue}
            </p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#003090]/60">
              {principalsMeeting.body}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
              {principalsMeeting.facts.map((f) => (
                <div key={f.label}>
                  <div className="font-display text-2xl font-extrabold sm:text-3xl">{f.value}</div>
                  <div className="mt-1 text-[12px] leading-snug text-[#003090]/50">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {principalsMeeting.images.map((im, i) => (
              <Reveal
                key={im.src}
                delay={i * 90}
                className={`relative overflow-hidden rounded-2xl ${
                  i === 0 ? "col-span-3 aspect-[16/9]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={im.src}
                  alt={im.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 52vw, 100vw" : "(min-width: 1024px) 18vw, 33vw"}
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                />
              </Reveal>
            ))}
          </div>
        </Reveal>
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
          <p className="max-w-sm text-[15px] leading-relaxed text-[#003090]/55">
            Schools across all seven LGAs line up for the maiden edition.
          </p>
        </div>

        <div className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSchools.map((s, i) => (
            <Reveal
              key={s.name}
              delay={(i % 3) * 80}
              className="flex items-start justify-between gap-4 rounded-2xl bg-white px-6 py-5 transition hover:shadow-md"
            >
              <h3 className="font-display text-[15px] font-bold leading-snug">{s.name}</h3>
              <span className="shrink-0 rounded-full bg-[#003090]/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#003090]/55">
                {s.lga}
              </span>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-[13px] text-[#003090]/40">
          A sample of eligible schools. The full roster appears here as schools register.
        </p>
      </section>

      {/* ── Origin / Background ── */}
      <section id="origin" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <Eyebrow>{origin.eyebrow}</Eyebrow>
            <Split
              lead={origin.title}
              trail={origin.titleTrail}
              className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
            />
            <p className="mt-6 text-[15px] leading-relaxed text-[#003090]/60">{origin.body}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#003090]/60">{origin.body2}</p>

            <figure className="mt-8 border-l-2 border-[#f0a800] pl-5">
              <blockquote className="font-display text-lg font-bold leading-snug sm:text-xl">
                {origin.pullQuote}
              </blockquote>
            </figure>

            <a
              href={origin.cta.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:bg-white"
            >
              {origin.cta.label}
            </a>
          </div>

          {/* Photo mosaic: the presentation, the team, the forms */}
          <div className="grid gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={origin.images[0].src}
                alt={origin.images[0].alt}
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {origin.images.slice(1).map((im) => (
                <div key={im.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={im.src}
                    alt={im.alt}
                    fill
                    sizes="(min-width: 1024px) 26vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-[12px] leading-relaxed text-[#003090]/40">
              The Scholars in Diaspora presentation at the Senator&rsquo;s office, where the
              Diaspora Educational Trust Fund was announced.
            </p>
          </div>
        </div>
      </section>

      {/* ── Prizes ── */}
      <section id="prizes" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <Reveal className="text-center">
          <Eyebrow>What&rsquo;s at Stake</Eyebrow>
          <Split
            lead="What the"
            trail="Champions Win"
            className="mx-auto mt-5 max-w-3xl text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
        </Reveal>

        {/* School / students / teachers — the client's grouping */}
        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {championsWin.map((g, i) => (
            <Reveal
              key={g.group}
              delay={i * 100}
              className={`rounded-2xl p-7 sm:p-8 ${
                i === 0 ? "bg-[#003090] text-white" : "bg-white"
              }`}
            >
              <h3
                className={`font-display text-xl font-extrabold ${
                  i === 0 ? "text-[#f0a800]" : ""
                }`}
              >
                {g.group}
              </h3>
              <ul className="mt-5 space-y-2.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className={`flex items-start gap-2.5 text-[14px] ${
                      i === 0 ? "text-white/85" : "text-[#003090]/70"
                    }`}
                  >
                    <span
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: i === 0 ? "#f0a800" : "#f03018" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#003090]/40">
            Placing &amp; cash awards
          </p>
        </Reveal>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {prizes.map((p, i) => (
            <div
              key={p.tier}
              className={`flex flex-col rounded-2xl p-7 sm:p-9 ${
                i === 0 ? "bg-[#003090] text-white" : "bg-white"
              }`}
            >
              <h3
                className={`font-display text-2xl font-extrabold ${
                  i === 0 ? "text-[#f0a800]" : ""
                }`}
              >
                {p.tier}
              </h3>
              <div className="mt-7 space-y-6 text-sm">
                <div>
                  <p
                    className={`mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      i === 0 ? "text-white/45" : "text-[#003090]/40"
                    }`}
                  >
                    School
                  </p>
                  <p className={i === 0 ? "text-white/80" : "text-[#003090]/70"}>{p.school}</p>
                </div>
                <div>
                  <p
                    className={`mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      i === 0 ? "text-white/45" : "text-[#003090]/40"
                    }`}
                  >
                    Students
                  </p>
                  <p className={i === 0 ? "text-white/80" : "text-[#003090]/70"}>{p.student}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid items-stretch gap-3 md:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl bg-white p-7 sm:p-9">
            <h3 className="font-display text-xl font-bold">{mentorPrize.title}</h3>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#003090]/55">
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
          answerClass="pt-3 text-sm leading-relaxed text-[#003090]/55"
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
            <Reveal
              key={n.title}
              delay={i * 90}
              as="article"
              className="group overflow-hidden rounded-2xl bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={n.img}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="font-bold uppercase tracking-wider text-[#003090]/45">
                    {n.category}
                  </span>
                  <span className="text-[#003090]/25">·</span>
                  <time className="text-[#003090]/45">
                    {new Date(n.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#003090]/55">{n.excerpt}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Board of Directors: Scholars in Diaspora ── */}
      <section id="board" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <Reveal className="overflow-hidden rounded-[28px] bg-white">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
            <div className="p-8 sm:p-12">
              <Eyebrow>{board.eyebrow}</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                {board.name}
              </h2>
              <p className="mt-3 text-[14px] font-semibold text-[#003090]/50">
                {board.strapline}
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f03018]">
                    Our Vision
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#003090]/65">
                    {board.vision}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f03018]">
                    Our Mission
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#003090]/65">
                    {board.mission}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
                {board.facts.map((f) => (
                  <div key={f.label}>
                    <div className="font-display text-2xl font-extrabold">{f.value}</div>
                    <div className="mt-1 text-[12px] leading-snug text-[#003090]/50">
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[280px]">
              <Image
                src="/img/origin-team.jpg"
                alt="Scholars in Diaspora with the Grand Patron"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Become a Change Maker ── */}
      <section id="changemaker" className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <Reveal className="relative grid items-center gap-8 overflow-hidden rounded-[28px] bg-[#f03018] px-8 py-12 text-white sm:px-12 md:grid-cols-[1.2fr_auto]">
          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-white/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
              {changeMaker.eyebrow}
            </span>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.25rem)] font-extrabold leading-[1.03] tracking-[-0.02em]">
              {changeMaker.title}{" "}
              <span className="text-white/55">{changeMaker.titleTrail}</span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/80">
              {changeMaker.body}
            </p>
          </div>
          <a
            href={changeMaker.cta.href}
            className="shrink-0 justify-self-start rounded-full bg-white px-8 py-4 text-[13px] font-bold text-[#f03018] transition hover:bg-[#f0a800] hover:text-[#003090] md:justify-self-end"
          >
            {changeMaker.cta.label}
          </a>
        </Reveal>
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
                className="rounded-full bg-[#f0a800] px-8 py-4 text-[13px] font-bold text-[#003090] transition hover:bg-white"
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

      {/* ── Sponsors & Partners ── */}
      <section id="sponsor" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#003090]/35">
            Sponsors &amp; Partners
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {sponsors.map((s, i) => (
              <span key={`${s}-${i}`} className="text-[13px] font-semibold text-[#003090]/35">
                {s}
              </span>
            ))}
          </div>
          <a
            href="#sponsor"
            className="mt-9 inline-block rounded-full border border-black/15 px-7 py-3.5 text-[13px] font-semibold transition hover:bg-white"
          >
            Sponsor the Championship
          </a>
        </Reveal>
      </section>

      {/* ── Footer: dark card with the oversized glowing wordmark ── */}
      <footer id="contact" className="px-3 pb-3 sm:px-4 sm:pb-4">
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
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[10px] font-bold text-white/60 transition hover:border-[#f0a800] hover:text-[#f0a800]"
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
