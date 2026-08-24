import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { lgaBySlug, lgaContent } from "@/content/lgas";
import { createPublicClient } from "@/lib/supabase/server";

/** Hourly, like /schedule: these pages are mostly static prose with a few
 *  live panels, and the audience is on mobile data where a CDN-cached page
 *  matters more than a count being sixty minutes fresh. */
export const revalidate = 3600;

export function generateStaticParams() {
  return lgaContent.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lga = lgaBySlug(slug);
  if (!lga) return { title: "Local Government Area" };

  return {
    title: `${lga.name} LGA`,
    description: `${lga.name} Local Government Area in the Senator Asuquo Ekpenyong Academic Championship — participating schools, qualifier, and results.`,
    alternates: { canonical: `/lgas/${lga.slug}` },
  };
}

/**
 * One page per Local Government Area (Content Guide §4.5).
 *
 * The guide asks for registered schools, venue, schedule, results and gallery
 * per LGA. Only the first of those exists before the competition runs, so the
 * page leads with the area itself — geography, headquarters, where it sits in
 * the qualifying structure — and each live panel states plainly that it fills
 * in as the championship progresses. That is a page a principal can read
 * today; four empty boxes is not.
 *
 * Every live query is scoped by this LGA and goes through the public client,
 * so RLS decides what is visible: approved schools only, published fixtures
 * and results only. Nothing here can leak a draft registration.
 */
export default async function LgaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lga = lgaBySlug(slug);
  if (!lga) notFound();

  const supabase = createPublicClient();

  // Resolve the LGA row first — everything else keys off its id. Null when
  // Supabase is unconfigured, in which case the live panels take their
  // "not yet" state rather than failing the build.
  const { data: lgaRow } = supabase
    ? await supabase
        .from("lgas")
        .select("id, name, slug, qualifier_group, school_count")
        .eq("slug", lga.slug)
        .maybeSingle()
    : { data: null };

  const [{ data: schools }, { data: fixtures }, { data: stages }, { data: venues }] =
    supabase && lgaRow
      ? await Promise.all([
          // RLS exposes approved schools only; the filter is belt and braces.
          supabase
            .from("schools")
            .select("id, name, registration_no, status")
            .eq("lga_id", lgaRow.id)
            .eq("status", "approved")
            .order("name"),
          supabase
            .from("fixtures")
            .select("id, name, stage_id, venue_id, scheduled_at, qualifier_group")
            .eq("qualifier_group", lgaRow.qualifier_group)
            .order("scheduled_at", { ascending: true, nullsFirst: false }),
          supabase.from("stages").select("id, name, ordinal").order("ordinal"),
          supabase.from("venues").select("id, name, address"),
        ])
      : [{ data: null }, { data: null }, { data: null }, { data: null }];

  const stageName = new Map((stages ?? []).map((s) => [s.id, s.name]));
  const venueById = new Map((venues ?? []).map((v) => [v.id, v]));
  const schoolRows = schools ?? [];
  const fixtureRows = fixtures ?? [];

  const partner = lga.combinedWith
    ? lgaContent.find((l) => l.name === lga.combinedWith)
    : undefined;

  const dateFmt = new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  });

  return (
    <>
      <PageHero
        eyebrow={`${lga.name} · Cross River South`}
        title={lga.name}
        titleTrail="LGA"
        intro={lga.intro}
        image={lga.img}
        imageAlt={lga.imgAlt}
        breadcrumb={{ label: "Participating LGAs", href: "/lgas" }}
      />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        {/* ── The area ── */}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              About the area
            </h2>
            <div className="mt-5 space-y-4">
              {lga.body.map((p) => (
                <p key={p.slice(0, 40)} className="text-[15px] leading-relaxed text-primary/70">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <dl className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              {lga.facts.map((f) => (
                <div
                  key={f.label}
                  className="border-b border-black/[0.08] py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/45">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-[15px] font-semibold">{f.value}</dd>
                </div>
              ))}
              <div className="border-t border-black/[0.08] py-3">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/45">
                  Public secondary schools
                </dt>
                <dd className="mt-1 font-display text-3xl font-extrabold leading-none">
                  {lga.schools}
                  <span className="ml-2 align-middle text-[12px] font-semibold text-primary/45">
                    provisional
                  </span>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* ── Combined qualifier note ── */}
        {lga.combined && partner && (
          <Reveal className="mt-12">
            <div className="rounded-2xl border border-gold/40 bg-gold/10 p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-ink">
                Combined qualifier
              </p>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-primary/75">
                Owing to the comparatively low number of secondary schools in{" "}
                {lga.name} and {partner.name}, these two LGAs are merged and
                jointly allocated <strong>one slot</strong> at the Local
                Government Qualifiers stage. Schools from both areas compete
                together for that place in the Group Stage.
              </p>
              <Link
                href={`/lgas/${partner.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-red-ink hover:text-red"
              >
                See {partner.name} LGA →
              </Link>
            </div>
          </Reveal>
        )}

        {/* ── Registered schools ── */}
        <Reveal className="mt-14 border-t border-black/10 pt-10">
          <h2 className="font-display text-[clamp(1.5rem,2.8vw,2rem)] font-extrabold tracking-[-0.02em]">
            Registered schools
          </h2>
          {schoolRows.length > 0 ? (
            <>
              <p className="mt-2 text-[14px] text-primary/55">
                {schoolRows.length} school{schoolRows.length === 1 ? "" : "s"}{" "}
                approved in {lga.name} so far.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {schoolRows.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3"
                  >
                    <p className="text-[14px] font-bold leading-snug">{s.name}</p>
                    {s.registration_no && (
                      <p className="mt-1 font-mono text-[11px] text-primary/45">
                        {s.registration_no}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-black/15 p-6">
              <p className="max-w-2xl text-[15px] leading-relaxed text-primary/60">
                No schools from {lga.name} have been approved yet. Approved
                registrations are listed here as they are confirmed by the
                Organising Committee.
              </p>
              <Link
                href="/register"
                className="mt-4 inline-block rounded-full bg-red px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-primary"
              >
                Register Your School
              </Link>
            </div>
          )}
        </Reveal>

        {/* ── Fixtures ── */}
        <Reveal className="mt-14 border-t border-black/10 pt-10">
          <h2 className="font-display text-[clamp(1.5rem,2.8vw,2rem)] font-extrabold tracking-[-0.02em]">
            Fixtures &amp; venue
          </h2>
          {fixtureRows.length > 0 ? (
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {fixtureRows.map((f) => {
                const v = f.venue_id ? venueById.get(f.venue_id) : undefined;
                return (
                  <li key={f.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/45">
                      {stageName.get(f.stage_id) ?? "Fixture"}
                    </span>
                    <span className="text-[15px] font-bold">{f.name}</span>
                    <span className="ml-auto text-[14px] tabular-nums text-primary/70">
                      {f.scheduled_at
                        ? dateFmt.format(new Date(f.scheduled_at))
                        : "Date to be confirmed"}
                    </span>
                    {v && (
                      <span className="w-full text-[13px] text-primary/50">
                        {v.name}
                        {v.address ? ` — ${v.address}` : ""}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-primary/60">
              Fixtures and the qualifier venue for {lga.name} have not been
              published yet. They appear here — and on the{" "}
              <Link href="/schedule" className="font-bold text-red-ink underline hover:text-red">
                full schedule
              </Link>{" "}
              — once the Organising Committee confirms them. Any later change to
              a date or venue is recorded with its reason.
            </p>
          )}
        </Reveal>

        {/* ── Results ── */}
        <Reveal className="mt-14 border-t border-black/10 pt-10">
          <h2 className="font-display text-[clamp(1.5rem,2.8vw,2rem)] font-extrabold tracking-[-0.02em]">
            Results
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-primary/60">
            Published results for {lga.name} appear on the results portal, where
            they can be filtered by stage and linked to directly.
          </p>
          <Link
            href="/results"
            className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-red-ink hover:text-red"
          >
            Open the results portal →
          </Link>
        </Reveal>

        {/* ── Other LGAs ── */}
        <Reveal className="mt-16 border-t border-black/10 pt-10">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/45">
            The other Local Government Areas
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {lgaContent
              .filter((l) => l.slug !== lga.slug)
              .map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/lgas/${l.slug}`}
                    className="inline-block rounded-full border border-black/12 px-4 py-2 text-[13px] font-semibold transition hover:border-red hover:text-red-ink"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
          </ul>
        </Reveal>
      </div>
    </>
  );
}
