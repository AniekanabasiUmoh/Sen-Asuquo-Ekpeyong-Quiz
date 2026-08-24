import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { createPublicClient } from "@/lib/supabase/server";

/** Revalidate hourly: the schedule changes rarely, and staying static keeps
 * the page CDN cached for mobile visitors. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Competition Schedule",
  description:
    "Fixtures, dates and venues for the Senator Asuquo Ekpenyong Academic Championship across the seven LGAs of Cross River South.",
};

/**
 * Public schedule, Content Guide §4.12.
 *
 * Only published fixtures are visible; RLS enforces that, not this page. A
 * fixture that has moved carries its change note, because schools plan travel
 * around these dates and a silently amended time is worse than a late one.
 */
export default async function SchedulePage() {
  // Null when Supabase is not configured; the page renders its "schedule is
  // being finalised" state rather than failing the build. See
  // createPublicClient().
  const supabase = createPublicClient();

  const [{ data: fixtures }, { data: stages }, { data: venues }, { data: changes }] = supabase
    ? await Promise.all([
        supabase
          .from("fixtures")
          .select("id, name, stage_id, venue_id, scheduled_at, qualifier_group")
          .order("scheduled_at", { ascending: true, nullsFirst: false }),
        supabase.from("stages").select("*").order("ordinal"),
        supabase.from("venues").select("id, name, address"),
        supabase
          .from("fixture_changes")
          .select("fixture_id, field, new_value, reason, created_at")
          .order("created_at", { ascending: false }),
      ])
    : [{ data: null }, { data: null }, { data: null }, { data: null }];

  const rows = fixtures ?? [];
  const stageName = new Map((stages ?? []).map((s) => [s.id, s.name]));
  const venue = new Map((venues ?? []).map((v) => [v.id, v]));

  const latestChange = new Map<string, (typeof changes extends null ? never : NonNullable<typeof changes>[number])>();
  for (const ch of changes ?? []) {
    if (!latestChange.has(ch.fixture_id)) latestChange.set(ch.fixture_id, ch);
  }

  // Group by stage so the page reads as the competition does, in order.
  const byStage = new Map<string, typeof rows>();
  for (const f of rows) {
    const list = byStage.get(f.stage_id) ?? [];
    list.push(f);
    byStage.set(f.stage_id, list);
  }

  return (
    <>
      <PageHero
        eyebrow="Competition Schedule"
        title="Fixtures"
        titleTrail="and Venues"
        intro="Dates, times and venues for every stage of the championship. Schools are notified of any change, and changes are shown here."
        image="/img/lga-calabar-municipality.jpg"
        imageAlt="Students competing at a quiz podium"
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        {rows.length === 0 ? (
          <Reveal>
            <div className="rounded-[28px] bg-white p-10 text-center">
              <h2 className="font-display text-xl font-bold">
                The schedule is being finalised
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#003090]/60">
                Fixtures are published here as the Organising Committee confirms
                them with each Local Government Area. Registered schools are
                notified directly.
              </p>
            </div>
          </Reveal>
        ) : (
          (stages ?? [])
            .filter((s) => byStage.has(s.id))
            .map((s) => (
              <div key={s.id} className="mb-12 last:mb-0">
                <h2 className="font-display text-xl font-bold">
                  <span className="font-mono text-[13px] tabular-nums text-[#003090]/30">
                    {String(s.ordinal).padStart(2, "0")}
                  </span>
                  <span className="ml-3">{stageName.get(s.id)}</span>
                </h2>
                <ul className="mt-5 space-y-3">
                  {(byStage.get(s.id) ?? []).map((f) => {
                    const v = f.venue_id ? venue.get(f.venue_id) : null;
                    const changed = latestChange.get(f.id);
                    return (
                      <li key={f.id} className="rounded-[24px] bg-white p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="font-display text-lg font-bold">{f.name}</h3>
                            <p className="mt-1 text-[13px] text-[#003090]/55">
                              {f.scheduled_at
                                ? new Date(f.scheduled_at).toLocaleString("en-GB", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Date to be confirmed"}
                            </p>
                            {v ? (
                              <p className="mt-0.5 text-[13px] text-[#003090]/45">
                                {v.name}
                                {v.address ? `, ${v.address}` : ""}
                              </p>
                            ) : null}
                          </div>
                          {changed ? (
                            <span className="rounded-full bg-[#f0a800]/25 px-3.5 py-1.5 text-[11px] font-bold text-[#7a5300]">
                              Changed
                            </span>
                          ) : null}
                        </div>
                        {changed?.reason ? (
                          <p className="mt-3 border-t border-black/10 pt-3 text-[13px] leading-relaxed text-[#003090]/55">
                            <strong className="font-semibold">Note: </strong>
                            {changed.reason}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
        )}
      </section>
    </>
  );
}
