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

export const metadata: Metadata = { title: "Variant E · Data-Forward" };

/* Variant E — Data-Forward (reference: Setrex SaaS)
   Black product canvas with a single lime accent. Centred hero over a radial
   glow, a small pill announcement badge, feature-card grids, giant ghost
   numerals behind panels, chip labels, and a bracket/scoreboard treatment.
   Reads like a live competition platform rather than a brochure. */

/** Small pill badge with a leading dot — the reference's announcement chip. */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-start gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-left text-[12px] text-white/70 backdrop-blur">
      <span
        className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c6f24e]"
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

/** Chip label used inside cards, as on the reference's stat tiles. */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-md bg-[#c6f24e]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c6f24e]">
      {children}
    </span>
  );
}

function ArrowCta({
  href,
  children,
  tone = "lime",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "lime" | "ghost";
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[13px] font-semibold transition ${
        tone === "lime"
          ? "bg-[#c6f24e] text-[#0a0a0a] hover:bg-[#d4f76f]"
          : "border border-white/15 text-white hover:bg-white/[0.06]"
      }`}
    >
      {tone === "lime" && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {children}
    </a>
  );
}

/** Simple stroke glyphs for the mechanics grid — no icon dependency. */
function Glyph({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    Strikers: <path d="M10 3v14M4 7l6-4 6 4M4 7v6l6 4 6-4V7" />,
    Assist: <path d="M10 17s-6-3.5-6-8a3.5 3.5 0 016-2.4A3.5 3.5 0 0116 9c0 4.5-6 8-6 8z" />,
    Substitution: <path d="M3 7h11l-3-3M17 13H6l3 3" />,
    VAR: <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5zm8 2a2 2 0 100-4 2 2 0 000 4z" />,
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? <circle cx="10" cy="10" r="6" />}
    </svg>
  );
}

/** The funnel widths, used to draw the bracket bars. */
const funnel = [100, 76, 58, 44, 32, 22, 8];

export default function VariantE() {
  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <Logo variant="white" width={110} className="h-auto w-[80px] shrink-0 sm:w-[96px]" />
          <nav className="hidden items-center gap-7 text-[13px] text-white/65 lg:flex">
            {nav.map((n) => (
              <a key={n.label} href={n.href} className="transition hover:text-white">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#register"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold text-[#0a0a0a] transition hover:bg-white/85"
          >
            Register
          </a>
        </div>
      </header>

      {/* ── Hero: centred over a radial glow ── */}
      <section className="relative overflow-hidden px-5 pb-20 pt-36 text-center sm:pt-44">
        {/* Radial glow + grid, standing in for the reference's planet */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[620px] w-[1100px] -translate-x-1/2 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(198,242,78,0.16), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 60% 60% at 50% 0%, #000, transparent 75%)",
          }}
          aria-hidden="true"
        />

        <Badge>{hero.eyebrow}</Badge>

        <h1 className="mx-auto mt-8 max-w-4xl font-display text-[clamp(2.75rem,6.5vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          Who wins this?
          <br />
          <span className="text-white/35">117 schools. One champion.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-white/50">
          {hero.subhead}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ArrowCta href={hero.primaryCta.href}>{hero.primaryCta.label}</ArrowCta>
          <ArrowCta href={hero.secondaryCta.href} tone="ghost">
            {hero.secondaryCta.label}
          </ArrowCta>
        </div>

        {/* Live scoreboard preview — the platform tell */}
        <div className="mx-auto mt-20 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#101010] text-left shadow-2xl">
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 truncate text-[11px] text-white/35">
              saeac.org / live — Grand Finale, Round 3
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-2 text-[11px] text-[#c6f24e]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c6f24e]" />
              Live
            </span>
          </div>

          <div className="grid gap-px bg-white/[0.07] sm:grid-cols-3">
            {[
              { school: "Hope Waddell Training Institution", lga: "Calabar Municipality", pts: "24.5" },
              { school: "Edgerley Memorial Girls' School", lga: "Calabar South", pts: "22.0" },
              { school: "Government Secondary School, Akamkpa", lga: "Akamkpa", pts: "19.5" },
            ].map((r, i) => (
              <div key={r.school} className="bg-[#101010] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] tabular-nums text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i === 0 && <Chip>Leading</Chip>}
                </div>
                <h3 className="mt-3 text-[14px] font-semibold leading-snug">{r.school}</h3>
                <p className="mt-1 text-[12px] text-white/40">{r.lga}</p>
                <div className="mt-4 flex items-baseline gap-1.5 border-t border-white/[0.07] pt-3">
                  <span
                    className={`font-display text-2xl font-semibold tabular-nums ${
                      i === 0 ? "text-[#c6f24e]" : ""
                    }`}
                  >
                    {r.pts}
                  </span>
                  <span className="text-[11px] text-white/35">pts</span>
                </div>
              </div>
            ))}
          </div>
          <p className="border-t border-white/[0.07] px-5 py-3 text-[11px] text-white/25">
            Illustrative preview — live scoring arrives with the Phase 3 competition module.
          </p>
        </div>
      </section>

      {/* ── Sponsor marquee strip ── */}
      <section className="border-y border-white/[0.07]">
        <p className="py-6 text-center text-[12px] text-white/35">
          Delivered with our sponsors and partners
        </p>
        <div className="grid grid-cols-2 gap-px border-t border-white/[0.07] bg-white/[0.07] sm:grid-cols-3 lg:grid-cols-5">
          {sponsors.map((s, i) => (
            <div
              key={`${s}-${i}`}
              className="flex min-h-[76px] items-center justify-center bg-[#0a0a0a] px-5 py-5 text-center text-[12px] text-white/30"
            >
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats: tiles with chip labels ── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="mx-auto max-w-2xl text-center font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
          The championship in numbers
        </h2>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101010] p-6"
            >
              {/* Giant ghost numeral behind the tile */}
              <span
                className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-[7rem] font-bold leading-none text-white/[0.035]"
                aria-hidden="true"
              >
                {s.value}
              </span>
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                    {s.value}
                  </span>
                  {i === 0 && <Chip>District</Chip>}
                </div>
                <div className="mt-4 text-[13px] font-medium">{s.label}</div>
                <div className="mt-1 text-[12px] text-white/40">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview + subject grid ── */}
      <section id="overview" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Badge>Seven subject areas</Badge>
            <h2 className="mt-7 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
              Built on the national curriculum
            </h2>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/50">
              {overview.body}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {overview.subjects.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101010] px-5 py-4"
              >
                <span className="font-mono text-[11px] tabular-nums text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px]">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stages: bracket / funnel visualisation ── */}
      <section id="stages" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="text-center">
          <Badge>Competition structure</Badge>
          <h2 className="mx-auto mt-7 max-w-2xl font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
            Seven stages, narrowing to one
          </h2>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
          {stages.map((st, i) => (
            <div
              key={st.n}
              className="group grid items-center gap-x-6 gap-y-3 border-b border-white/[0.07] px-6 py-6 transition last:border-b-0 hover:bg-white/[0.02] md:grid-cols-[3rem_1fr_1.1fr_11rem]"
            >
              <span className="font-mono text-[11px] tabular-nums text-white/25">
                {String(st.n).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[16px] font-semibold">{st.name}</h3>
                <p className="mt-1 text-[12px] text-white/35 md:hidden">{st.field}</p>
              </div>
              <p className="text-[13px] leading-relaxed text-white/45">{st.summary}</p>

              {/* Funnel bar — width encodes how much of the field remains */}
              <div className="md:justify-self-end md:text-right">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07] md:w-40">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      i === stages.length - 1 ? "bg-[#c6f24e]" : "bg-white/30"
                    }`}
                    style={{ width: `${funnel[i]}%` }}
                  />
                </div>
                <p className="mt-2 hidden text-[11px] text-white/35 md:block">{st.field}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Showdown: feature-card grid with glyphs ── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="text-center">
          <Badge>Round 3 · Live format</Badge>
          <h2 className="mx-auto mt-7 max-w-2xl font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
            {showdown.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-white/50">
            {showdown.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {showdown.mechanics.map((m) => (
            <div key={m.name} className="rounded-2xl border border-white/10 bg-[#101010] p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6f24e]/12 text-[#c6f24e]">
                <Glyph name={m.name} />
              </span>
              <h3 className="mt-6 text-[16px] font-semibold">{m.name}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/45">{m.body}</p>
            </div>
          ))}
        </div>

        {/* Wide split panel — image left, copy right */}
        <div className="mt-3 grid overflow-hidden rounded-2xl border border-white/10 bg-[#101010] md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-[240px]">
            <Image
              src="/img/students-posing.jpg"
              alt="A school team representing their LGA"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <Chip>Team of five</Chip>
            <p className="mt-5 text-[17px] font-medium leading-relaxed sm:text-[19px]">
              Three Strikers on stage, two Assists on the bench, and a Coach who can
              substitute at any point in Round 3.
            </p>
            <p className="mt-4 text-[13px] text-white/40">
              Every school fields the same structure, from the LGA Qualifiers through to
              the Grand Finale.
            </p>
          </div>
        </div>
      </section>

      {/* ── LGAs: data table ── */}
      <section id="lgas" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <Badge>Cross River South</Badge>
            <h2 className="mt-7 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
              Seven LGAs
            </h2>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/50">{lgaNote}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
            <div className="grid grid-cols-[1fr_auto_7rem] gap-4 border-b border-white/[0.07] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
              <span>Local Government Area</span>
              <span className="text-right">Schools</span>
              <span className="text-right">Share</span>
            </div>
            {lgas.map((l) => (
              <div
                key={l.name}
                className="grid grid-cols-[1fr_auto_7rem] items-center gap-4 border-b border-white/[0.07] px-6 py-4 transition hover:bg-white/[0.02]"
              >
                <span className="flex flex-wrap items-center gap-2.5 text-[14px]">
                  {l.name}
                  {l.combined && (
                    <span className="rounded bg-white/[0.07] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/45">
                      Combined
                    </span>
                  )}
                </span>
                <span className="text-right font-display text-[15px] font-semibold tabular-nums">
                  {l.schools}
                </span>
                <span className="justify-self-end">
                  <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.07]">
                    <span
                      className="block h-full rounded-full bg-[#c6f24e]/70"
                      style={{ width: `${Math.round((l.schools / 24) * 100)}%` }}
                    />
                  </span>
                </span>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_7rem] items-center gap-4 bg-[#c6f24e] px-6 py-4 text-[#0a0a0a]">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em]">Total</span>
              <span className="text-right font-display text-[15px] font-bold tabular-nums">
                117
              </span>
              <span />
            </div>
          </div>
        </div>
      </section>

      {/* ── Prizes: pricing-table treatment, champion filled lime ── */}
      <section id="prizes" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="text-center">
          <Badge>What&rsquo;s at stake</Badge>
          <h2 className="mx-auto mt-7 max-w-2xl font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
            Rewards for the school and the students
          </h2>
        </div>

        <div className="mt-14 grid gap-3 lg:grid-cols-3">
          {prizes.map((p, i) => (
            <div
              key={p.tier}
              className={`flex flex-col rounded-2xl p-7 sm:p-8 ${
                i === 0
                  ? "bg-[#c6f24e] text-[#0a0a0a]"
                  : "border border-white/10 bg-[#101010]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">{p.tier}</h3>
                {i === 0 && (
                  <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-[10px] font-semibold text-[#c6f24e]">
                    Grand Champion
                  </span>
                )}
              </div>

              <div
                className={`mt-7 space-y-5 border-t pt-6 ${
                  i === 0 ? "border-[#0a0a0a]/15" : "border-white/[0.09]"
                }`}
              >
                <div>
                  <p
                    className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      i === 0 ? "text-[#0a0a0a]/55" : "text-white/30"
                    }`}
                  >
                    School
                  </p>
                  <p
                    className={`text-[13px] leading-relaxed ${
                      i === 0 ? "text-[#0a0a0a]/80" : "text-white/55"
                    }`}
                  >
                    {p.school}
                  </p>
                </div>
                <div>
                  <p
                    className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      i === 0 ? "text-[#0a0a0a]/55" : "text-white/30"
                    }`}
                  >
                    Students
                  </p>
                  <p
                    className={`text-[13px] leading-relaxed ${
                      i === 0 ? "text-[#0a0a0a]/80" : "text-white/55"
                    }`}
                  >
                    {p.student}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-white/10 bg-[#101010] p-7">
          <div>
            <h3 className="text-[16px] font-semibold">{mentorPrize.title}</h3>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/45">
              {mentorPrize.body}
            </p>
          </div>
          <Chip>₦1,000,000</Chip>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-5 pb-24">
        <div className="text-center">
          <Badge>Before you enter</Badge>
          <h2 className="mt-7 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
            Frequently asked
          </h2>
        </div>
        <Accordion
          items={faq}
          className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#101010]"
          itemClass="border-b border-white/[0.07] px-6 py-5 last:border-b-0"
          questionClass="text-[15px] font-medium"
          answerClass="pt-3 text-[13px] leading-relaxed text-white/45"
        />
      </section>

      {/* ── News ── */}
      <section id="news" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
            Latest updates
          </h2>
          <ArrowCta href="#news" tone="ghost">
            All updates
          </ArrowCta>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {news.map((n, i) => (
            <article
              key={n.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]"
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
                  className="object-cover opacity-80 transition duration-500 hover:opacity-100"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2.5 text-[11px] text-white/35">
                  <span className="font-semibold uppercase tracking-[0.1em]">{n.category}</span>
                  <span>·</span>
                  <time>
                    {new Date(n.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-3 text-[16px] font-semibold leading-snug">{n.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/45">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Register ── */}
      <section id="register" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#101010] px-6 py-20 text-center sm:px-12">
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[420px] w-[900px] -translate-x-1/2 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(198,242,78,0.18), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <Badge>Entry is free</Badge>
            <h2 className="mx-auto mt-7 max-w-2xl font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
              Register your school
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/50">
              Open to every public and private secondary school in the seven LGAs of Cross
              River South.
            </p>

            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {countdown.label}
              </p>
              <Countdown
                targetIso={countdown.targetIso}
                className="mt-4 justify-center"
                boxClass="text-center"
                valueClass="font-display text-3xl font-semibold tabular-nums text-[#c6f24e] sm:text-4xl"
                labelClass="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/35"
              />
            </div>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ArrowCta href="#register">Start Registration</ArrowCta>
              <ArrowCta href="#stages" tone="ghost">
                How It Works
              </ArrowCta>
            </div>
            <p className="mt-6 text-[11px] text-white/25">{countdown.note}</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.07] pt-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Logo variant="white" width={140} />
              <p className="mt-6 max-w-xs text-[15px] font-medium leading-snug text-white/75">
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[10px] font-semibold uppercase text-white/45 transition hover:border-[#c6f24e] hover:text-[#c6f24e]"
                  >
                    {s.name.slice(0, 2)}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Explore
              </p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {footerLinks.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-white/50 transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Portals
              </p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {portalLinks.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-white/50 transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] py-6 text-[11px] text-white/25">
            <span>
              © 2026 {brand.short}. {brand.edition}.
            </span>
            <span>Phase 0 demo homepage — Variant E</span>
          </div>
        </div>
        <Ribbon />
      </footer>

      <div className="h-14" />
      <VariantSwitcher />
    </div>
  );
}
