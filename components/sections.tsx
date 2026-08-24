import Image from "next/image";
import Link from "next/link";
import { DiagonalRibbon } from "@/components/brand";
import { VideoHero } from "@/components/video-hero";
import { CountUp, Reveal } from "@/components/reveal";
import { MechanicGlyph } from "@/components/striker";
import { lgaSlug } from "@/content/lgas";
import { Carousel } from "@/components/carousel";
import { FannedCards } from "@/components/fanned-cards";
import { ZoomImage } from "@/components/zoom-image";
import {
  about,
  board,
  changeMaker,
  championsWin,
  countdown,
  lgaNote,
  lgas,
  mentorPrize,
  news,
  origin,
  overview,
  principalsMeeting,
  prizes,
  scholars,
  scholarsIntro,
  senator,
  showdown,
  sponsors,
  stages,
  statLead,
  stats,
  statsClose,
  statsFinancial,
  statsHeading,
} from "@/content/homepage";

/**
 * The page sections, extracted when the site was split from one long homepage
 * into the structure the Content Guide specifies (§2.1).
 *
 * They live here rather than in any one page because several are needed in
 * two places: the full section on its own page, and a shortened teaser on the
 * homepage that links through. Keeping one implementation means a change to
 * the Showdown, say, cannot drift between /competition and the homepage.
 *
 * Each is a plain section element. Pages compose them; none of them own
 * page-level chrome.
 */

/** Headline where the second half drops to a muted tone. */
export function Split({
  lead,
  trail,
  className = "",
  trailClass = "text-primary/35",
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

/** One frame per stage, chosen so each depicts what that stage actually is. */
export const stageThumbs = [
  "/img/lga-bakassi.jpg",
  "/img/win-school.jpg",
  "/img/lga-akamkpa.jpg",
  "/img/lga-calabar-south.jpg",
  "/img/win-students.jpg",
  "/img/lga-odukpani.jpg",
  "/img/champion-certificate.jpg",
];

export function NumbersSection() {
  /* ── The Championship in Numbers ──
    Rebuilt in Round 3 (item 7). Previously four equal figures in four
    unrelated colours, one of which (green) was not a brand colour at
    all, over a 2×2 grid that left a hole in the middle on desktop.
    Now: one lead figure carries the section, the rest support it on a
    shared rule structure, and everything is navy but the lead. */
  return (
    <section id="numbers" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-4 pt-16 sm:pt-20">
      <Reveal>
        <Split
          lead={statsHeading.title}
          trail={statsHeading.titleTrail}
          className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.05]"
        />
      </Reveal>

      <div className="mt-8 grid gap-x-10 gap-y-8 border-t border-black/10 pt-9 lg:grid-cols-[1.15fr_1fr]">
        {/* Lead figure. Red is the one accent in the block. */}
        <Reveal>
          <div className="font-display text-[clamp(4.5rem,12vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.045em] text-red">
            <CountUp value={statLead.count} suffix={statLead.suffix} />
          </div>
          <div className="mt-4 font-display text-xl font-bold sm:text-2xl">
            {statLead.label}
          </div>
          <div className="mt-1 text-[14px] text-primary/50">{statLead.note}</div>
        </Reveal>

        {/* Supporting figures, rule-separated so they sit on a structure. */}
        <div className="grid grid-cols-2 gap-x-8 self-end">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={140 + i * 90}
              className="border-l border-black/10 pl-6 first:border-l-0 first:pl-0"
            >
              <div className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[0.9] tracking-[-0.035em]">
                <CountUp
                  value={s.count}
                  suffix={"suffix" in s ? s.suffix : ""}
                  delay={140 + i * 140}
                />
              </div>
              <div className="mt-3 text-[14px] font-bold">{s.label}</div>
              <div className="mt-0.5 text-[13px] text-primary/45">{s.note}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Financial figures, sharing the type treatment above at smaller scale,
          alongside the moment the Trust Fund actually began. */}
      <div className="mt-10 grid items-stretch gap-6 border-t border-black/10 py-9 lg:grid-cols-[1fr_0.62fr]">
        {/* content-start keeps the three figures at the top of their column
            rather than stretching them down beside the photograph. */}
        <div className="grid grid-cols-1 content-start gap-y-7 sm:grid-cols-3">
          {statsFinancial.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className="sm:border-l sm:border-black/10 sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <div className="font-display text-[clamp(1.75rem,3.4vw,2.35rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
                {s.display}
              </div>
              <div className="mt-2.5 text-[13px] font-bold">{s.label}</div>
              <div className="mt-0.5 text-[13px] text-primary/45">{s.note}</div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <ZoomImage
            src="/img/origin-cheque.jpg"
            alt="The Scholars in Diaspora cheque presentation at the Grand Patron's office"
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="h-full min-h-[210px] rounded-2xl"
          >
            <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <span className="absolute bottom-4 right-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
              Where the Trust Fund began
            </span>
          </ZoomImage>
        </Reveal>
      </div>

      {/* What was the "1 Champion" cell. A lone numeral 1 read as a
          placeholder; as a sentence it closes the section. */}
      <Reveal className="border-b border-black/10 pb-10">
        <p className="font-display text-[clamp(1.35rem,2.8vw,2rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
          {statsClose.lead}{" "}
          <span className="text-primary/35">{statsClose.trail}</span>
        </p>
      </Reveal>
    </section>
  );
}

export function AboutBlockSection() {
  /* ── About SAEAC + bento grid ── */
  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <Reveal className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Split
            lead={about.title}
            trail={about.titleTrail}
            className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-primary/60 lg:pb-2">
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
              school&rsquo;s name forward.
            </p>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-white p-7 md:p-9">
          <div className="flex items-start gap-5">
            <span className="font-display text-[76px] font-extrabold leading-[0.8] tracking-[-0.04em] text-red sm:text-[92px]">
              7
            </span>
            <div className="pt-1.5">
              <h3 className="font-display text-xl font-bold leading-tight">
                Subject Areas
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary/55">
                Every question drawn from the national curriculum, spread across the
                sciences, the arts, commerce and civic life.
              </p>
            </div>
          </div>
          <ul className="mt-7 border-t border-black/10">
            {overview.subjects.map((s, i) => (
              <li
                key={s}
                className="flex items-baseline gap-4 border-b border-black/[0.07] py-2.5 last:border-b-0"
              >
                <span className="font-mono text-[11px] tabular-nums text-primary/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] text-primary/80">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Two-up: the district reach, and the prize at the end of it */}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="flex flex-col justify-center rounded-2xl bg-white p-7 md:p-9">
          <div>
            <h3 className="font-display text-xl font-bold">Seven Stages, One District</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary/55">
              From school screening to the televised Grand Finale, every stage narrows
              the field, across all seven Local Government Areas of Cross River South.
            </p>
          </div>
        </div>

        {/* Round 3 item 2: was a trophy photograph of a student who did not
            read as Nigerian, on a page about seven Cross River South LGAs.
            Replaced with a Nigerian secondary school student in uniform
            receiving an award. */}
        <ZoomImage
          src="/img/champion-certificate.jpg"
          alt="A Nigerian secondary school student in uniform receiving an award"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="min-h-[260px] rounded-2xl"
        >
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-14">
            <h3 className="font-display text-lg font-bold text-white">
              One Grand Champion
            </h3>
            <p className="mt-1 text-sm text-white/70">Crowned live on television.</p>
          </div>
        </ZoomImage>
      </div>
    </section>
  );
}

export function PatronSection() {
  /* ── Message from the Patron: video left, quote right ── */
  return (
    <section id="patron" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <div className="overflow-hidden rounded-[28px] bg-primary text-white">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-5 sm:p-7 lg:p-8">
            <VideoHero
              loopSrc={senator.video.loop}
              poster={senator.video.loopPoster}
              youTubeId={senator.video.youTubeId}
              title={senator.video.title}
              caption="Watch the film"
              className="aspect-video rounded-2xl"
            />
          </div>

          <div className="flex flex-col justify-center px-7 pb-10 sm:px-9 lg:py-12 lg:pl-2 lg:pr-10">
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
  );
}

export function StagesSection() {
  /* ── Stages: thin rules, number, title, copy, thumbnail right ── */
  return (
    <section id="stages" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Split
          lead="The Road to"
          trail="the Finale"
          className="text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
        />
        <p className="max-w-xs text-[15px] leading-relaxed text-primary/55">
          Seven stages take the whole district down to a single champion.
        </p>
      </div>

      <ol className="mt-12">
        {stages.map((st, i) => (
          <li
            key={st.n}
            className="group grid items-center gap-x-8 gap-y-4 border-t border-black/10 py-6 last:border-b md:grid-cols-[2.5rem_1fr_1.1fr_13.5rem]"
          >
            <span className="font-mono text-[11px] text-primary/35">
              {String(st.n).padStart(2, "0")}
            </span>
            <h3 className="font-display text-[22px] font-bold leading-tight sm:text-2xl">
              {st.name}
            </h3>
            <div>
              <p className="text-sm leading-relaxed text-primary/55">{st.summary}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-primary/40">
                {st.field}
              </p>
            </div>
            <ZoomImage
              src={stageThumbs[i] ?? stageThumbs[0]}
              alt=""
              sizes="(min-width: 768px) 200px, 100vw"
              className="aspect-[3/2] w-full rounded-xl md:w-[200px] md:justify-self-end"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ShowdownSection() {
  /* ── Showdown: the RD deck's own layout — rule-separated rows, italic
    labels with accent strokes, colour-coded description panels ── */
  return (
    <section id="showdown" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <div className="relative overflow-hidden rounded-[28px] bg-white">
        <DiagonalRibbon className="opacity-90" />

        {/* Deck-style intro banner */}
        <div className="bg-primary px-6 py-7 pl-24 text-white sm:px-12 sm:pl-28">
          <p className="max-w-4xl text-[14px] leading-relaxed sm:text-[15px]">
            In the <strong className="font-bold">Grand Finale</strong>, each team&rsquo;s
            three on-stage players are called Strikers, its two substitutes are called
            Assists, and its teacher/mentor is the Coach.
          </p>
        </div>

        <div className="px-6 py-4 sm:px-12">
          {showdown.mechanics.map((m, i) => (
            <Reveal
              key={m.name}
              delay={i * 60}
              className="grid items-center gap-x-8 gap-y-4 border-b border-black/10 py-7 last:border-b-0 md:grid-cols-[13rem_9rem_1fr]"
            >
              {/* Italic display label with the deck's accent underscores */}
              <div>
                <h3 className="font-display text-[26px] font-extrabold italic leading-none tracking-[-0.02em] sm:text-[30px]">
                  {m.name}
                </h3>
                <div className="mt-2 space-y-[3px]">
                  <div className="h-[3px] w-24 bg-gold" />
                  <div className="h-[3px] w-16 bg-primary" />
                </div>
              </div>

              <MechanicGlyph name={m.name} className="h-20 w-full md:h-24" />

              <p
                className={`rounded-xl px-5 py-4 text-[13.5px] leading-relaxed ${
                  {
                    outline: "border border-primary/25 bg-primary/[0.03] text-primary/75",
                    blue: "bg-primary text-white",
                    gold: "bg-gold text-primary",
                    red: "bg-red text-white",
                    "red-outline": "border border-red/40 bg-red/[0.04] text-primary/75",
                    plain: "border border-black/10 bg-black/[0.02] text-primary/75",
                  }[m.accent] ?? "border border-black/10 bg-black/[0.02] text-primary/75"
                }`}
              >
                {m.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LgasSection() {
  /* ── LGAs ── */
  return (
    <section id="lgas" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Split
            lead="Seven LGAs,"
            trail="One District"
            className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-primary/55">{lgaNote}</p>
      </div>

      {/* Photo tiles — each LGA gets a face, not just a row in a table */}
      <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {lgas.map((l) => (
          <Link
            key={l.name}
            href={`/lgas/${lgaSlug(l.name)}`}
            aria-label={`${l.name} Local Government Area`}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <ZoomImage
              src={l.img}
              alt={`Secondary school students in ${l.name}`}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            {l.combined && (
              <span className="absolute left-4 top-4 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                Combined
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
                {l.name}
              </h3>
              <p className="mt-1 text-[13px] text-white/70">{l.schools} schools</p>
              <span className="mt-2 inline-block text-[12px] font-bold text-gold opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                View LGA →
              </span>
            </div>
          </Link>
        ))}

        {/* Eighth tile completes the 4-up grid and carries the total */}
        <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-primary p-5 text-white">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
            Across the District
          </span>
          <div>
            <div className="font-display text-5xl font-extrabold leading-none text-gold">
              250+
            </div>
            <p className="mt-2 text-[13px] text-white/70">
              Secondary schools eligible to enter
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The seven LGAs as the reference's centre-stage carousel, used on the
 * homepage where the four-up grid would be too much page for a teaser. The
 * dedicated /lgas page keeps the grid, which is the better shape when the
 * whole district is the subject.
 */
export function LgasCarouselSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
      {/* Centred header, as the reference sets its section headings. */}
      <Reveal className="mx-auto max-w-2xl text-center">
        <Split
          lead="Seven LGAs,"
          trail="One District"
          className="text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.03]"
        />
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-primary/55">
          {lgaNote}
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-12">
        <Carousel
          items={lgas.map((l) => ({
            img: l.img,
            name: l.name,
            meta: `${l.schools} secondary schools`,
            badge: l.combined ? "Combined slot" : undefined,
          }))}
        />
      </Reveal>
    </section>
  );
}

export function PrincipalsSection() {
  /* ── Latest from Schools: the principals' engagement ── */
  return (
    <section id="principals" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div>
          <Split
            lead={principalsMeeting.title}
            trail={principalsMeeting.titleTrail}
            className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
          <p className="mt-4 text-[13px] font-semibold text-primary/45">
            {principalsMeeting.date} · {principalsMeeting.venue}
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-primary/60">
            {principalsMeeting.body}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
            {principalsMeeting.facts.map((f) => (
              <div key={f.label}>
                <div className="font-display text-2xl font-extrabold sm:text-3xl">{f.value}</div>
                <div className="mt-1 text-[12px] leading-snug text-primary/50">{f.label}</div>
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
              <ZoomImage
                src={im.src}
                alt={im.alt}
                sizes={i === 0 ? "(min-width: 1024px) 52vw, 100vw" : "(min-width: 1024px) 18vw, 33vw"}
                className="absolute inset-0"
              />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function OriginSection() {
  /* ── Origin / Background ── */
  return (
    <section id="origin" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <Split
            lead={origin.title}
            trail={origin.titleTrail}
            className="mt-5 text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
          />
          <p className="mt-6 text-[15px] leading-relaxed text-primary/60">{origin.body}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-primary/60">{origin.body2}</p>

          <figure className="mt-8 border-l-2 border-gold pl-5">
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
          <ZoomImage
            src={origin.images[0].src}
            alt={origin.images[0].alt}
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="aspect-[4/3] rounded-2xl"
          />
          <div className="grid grid-cols-2 gap-3">
            {origin.images.slice(1).map((im) => (
              <ZoomImage
                key={im.src}
                src={im.src}
                alt={im.alt}
                sizes="(min-width: 1024px) 26vw, 50vw"
                className="aspect-[4/3] rounded-2xl"
              />
            ))}
          </div>
          <p className="text-[12px] leading-relaxed text-primary/40">
            The Scholars in Diaspora presentation at the Senator&rsquo;s office, where the
            Diaspora Educational Trust Fund was announced.
          </p>
        </div>
      </div>

      {/* The scholars themselves. The copy above claims sixty scholars now
          qualified as doctors and lawyers; without faces that is an
          assertion, so the people who did it belong inside the story rather
          than in a separate section. Round 3 item 1. */}
      <div className="mt-14 border-t border-black/10 pt-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            The Faces Behind{" "}
            <span className="text-primary/35">the Vision</span>
          </h3>
          <p className="max-w-md text-[14px] leading-relaxed text-primary/50">
            {scholarsIntro.body}
          </p>
        </Reveal>

        <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {scholars.map((s, i) => (
            <Reveal as="li" key={s.name} delay={(i % 6) * 70}>
              <ZoomImage
                src={s.img}
                alt={`${s.name}, Scholars in Diaspora`}
                sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
                className="aspect-square rounded-2xl"
              />
              <div className="mt-3 text-[13px] font-bold leading-snug">{s.name}</div>
              <div className="mt-1 text-[12px] leading-snug text-primary/45">
                {s.detail}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PrizesSection() {
  /* ── Prizes ── */
  return (
    <section id="prizes" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <Reveal className="text-center">
        <Split
          lead="What the"
          trail="Champions Win"
          className="mx-auto mt-5 max-w-3xl text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
        />
      </Reveal>

      {/* School / students / teachers — tall image cards, text over photography */}
      <div className="mt-12 grid gap-3 lg:grid-cols-3">
        {championsWin.map((g, i) => (
          <Reveal key={g.group} delay={i * 110}>
            <ZoomImage
              src={g.img}
              alt={g.alt}
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="aspect-[4/5] rounded-[24px]"
            >
              {/* Scrim keeps the list legible over the photograph */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                <ul className="space-y-2.5">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[14px] text-white/85"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-red"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-5 border-t border-white/20 pt-4 font-display text-2xl font-extrabold text-white">
                  {g.group}
                </h3>
              </div>
            </ZoomImage>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/40">
          Placing &amp; cash awards
        </p>
      </Reveal>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {prizes.map((p, i) => (
          <div
            key={p.tier}
            className={`flex flex-col rounded-2xl p-7 sm:p-9 ${
              i === 0 ? "bg-primary text-white" : "bg-white"
            }`}
          >
            <h3
              className={`font-display text-2xl font-extrabold ${
                i === 0 ? "text-gold" : ""
              }`}
            >
              {p.tier}
            </h3>
            <div className="mt-7 space-y-6 text-sm">
              <div>
                <p
                  className={`mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    i === 0 ? "text-white/45" : "text-primary/40"
                  }`}
                >
                  School
                </p>
                <p className={i === 0 ? "text-white/80" : "text-primary/70"}>{p.school}</p>
              </div>
              <div>
                <p
                  className={`mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    i === 0 ? "text-white/45" : "text-primary/40"
                  }`}
                >
                  Students
                </p>
                <p className={i === 0 ? "text-white/80" : "text-primary/70"}>{p.student}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid items-stretch gap-3 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-white p-7 sm:p-9">
          <h3 className="font-display text-xl font-bold">{mentorPrize.title}</h3>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-primary/55">
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
  );
}

export function NewsSection() {
  /* ── News ── */
  return (
    <section id="news" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Split
          lead="Latest from"
          trail="the Championship"
          className="text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.03]"
        />
        <a
          href="/news"
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
            <ZoomImage
              src={n.img}
              alt=""
              sizes="(min-width: 768px) 33vw, 100vw"
              className="aspect-[16/10]"
            />
            <div className="p-6">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="font-bold uppercase tracking-wider text-primary/45">
                  {n.category}
                </span>
                <span className="text-primary/25">·</span>
                <time className="text-primary/45">
                  {new Date(n.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug">{n.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary/55">{n.excerpt}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function BoardSection() {
  /* ── Board of Directors: Scholars in Diaspora ── */
  return (
    <section id="board" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <Reveal className="overflow-hidden rounded-[28px] bg-white">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="p-8 sm:p-12">
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              {board.name}
            </h2>
            <p className="mt-3 text-[14px] font-semibold text-primary/50">
              {board.strapline}
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                  Our Vision
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-primary/65">
                  {board.vision}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red">
                  Our Mission
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-primary/65">
                  {board.mission}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
              {board.facts.map((f) => (
                <div key={f.label}>
                  <div className="font-display text-2xl font-extrabold">{f.value}</div>
                  <div className="mt-1 text-[12px] leading-snug text-primary/50">
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ZoomImage
            src="/img/board-scholars-uk.jpg"
            alt="Scholars in Diaspora in the United Kingdom with the ₦20,000,000 cheque toward the nomination form"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="min-h-[280px]"
          />
        </div>
      </Reveal>
    </section>
  );
}

export function ChangeMakerSection() {
  /* ── Become a Change Maker ── */
  return (
    <section id="changemaker" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-20">
      <Reveal className="relative grid items-center gap-8 overflow-hidden rounded-[28px] bg-red px-8 py-12 text-white sm:px-12 md:grid-cols-[1.2fr_auto]">
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
        {/* Two routes in: give time, or fund it. */}
        <div className="flex shrink-0 flex-col gap-3 justify-self-start sm:flex-row md:flex-col md:justify-self-end lg:flex-row">
          <a
            href={changeMaker.cta.href}
            className="whitespace-nowrap rounded-full bg-white px-8 py-4 text-center text-[13px] font-bold text-red transition hover:bg-gold hover:text-primary"
          >
            {changeMaker.cta.label}
          </a>
          <a
            href={changeMaker.ctaSecondary.href}
            className="whitespace-nowrap rounded-full border border-white/40 px-8 py-4 text-center text-[13px] font-bold text-white transition hover:bg-white/10"
          >
            {changeMaker.ctaSecondary.label}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function RegisterCtaSection() {
  /* ── Register CTA ── */
  return (
    <section id="register" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-8">
      <div className="relative overflow-hidden rounded-[28px] px-6 py-20 text-center sm:px-12 sm:py-28">
        <Image
          src="/img/students-walking.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-ink/72" />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white">
            Register <span className="text-white/45">Your School</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
            Entry is free, and open to every public and private secondary school in the
            seven LGAs of Cross River South.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="/register"
              className="rounded-full bg-gold px-8 py-4 text-[13px] font-bold text-primary transition hover:bg-white"
            >
              Start Registration
            </a>
            <a
              href="/competition"
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
  );
}

/**
 * Closing band with photographs fanned out either side, from the reference's
 * final call to action. The cards are decoration only, and drop below `lg`
 * where there is no room beside the type.
 *
 * Kept on the cream ground rather than over photography: the fan reads as
 * loose prints on a table, which needs a plain surface behind it.
 */
export function FannedCtaSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:py-28">
      <FannedCards
        left={["/img/meeting-group.jpg", "/img/win-school.jpg", "/img/lga-biase.jpg"]}
        right={[
          "/img/champion-certificate.jpg",
          "/img/students-posing.jpg",
          "/img/outreach-assembly.jpg",
        ]}
      />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <Split
          lead="Who will be"
          trail="the Standard?"
          className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02]"
        />
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-primary/55">
          Entry is free and open to every public and private secondary school across the
          seven Local Government Areas of Cross River South.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-full bg-red px-8 py-4 text-[13px] font-bold text-white transition hover:bg-primary"
          >
            Register Your School
          </Link>
          <Link
            href="/competition"
            className="rounded-full border border-black/15 px-8 py-4 text-[13px] font-bold transition hover:bg-white"
          >
            How It Works
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function SponsorsSection() {
  /* ── Sponsors & Partners ── */
  return (
    <section id="sponsor" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16">
      <Reveal className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/35">
          Sponsors &amp; Partners
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {sponsors.map((s, i) => (
            <span key={`${s}-${i}`} className="text-[13px] font-semibold text-primary/35">
              {s}
            </span>
          ))}
        </div>
        {/* No CTA here. The ask now lives in Become a Change Maker above,
            so this reads as a credits row rather than a second pitch. */}
        <p className="mt-8 text-[12px] text-primary/40">
          Interested in supporting the championship?{" "}
          <Link href="/get-involved" className="font-semibold text-primary/70 underline underline-offset-4 transition hover:text-red">
            Become a Change Maker
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
