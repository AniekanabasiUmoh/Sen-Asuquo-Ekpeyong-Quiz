import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { createPublicClient } from "@/lib/supabase/server";
import { ScheduleCalendar } from "./schedule-calendar";

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
export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; group?: string; lga?: string; view?: string }>;
}) {
  const { stage, group, lga, view } = await searchParams;
  const calendarView = view === "calendar";
  // Null when Supabase is not configured; the page renders its "schedule is
  // being finalised" state rather than failing the build. See
  // createPublicClient().
  const supabase = createPublicClient();

  const [{ data: fixtures }, { data: stages }, { data: lgas }, { data: venues }, { data: changes }] = supabase
    ? await Promise.all([
        supabase
          .from("fixtures")
          .select("id, name, stage_id, venue_id, scheduled_at, qualifier_group")
          .order("scheduled_at", { ascending: true, nullsFirst: false }),
        supabase.from("stages").select("*").order("ordinal"),
        supabase.from("lgas").select("id, name, qualifier_group, is_combined").order("sort_order"),
        supabase.from("venues").select("id, name, address"),
        supabase
          .from("fixture_changes")
          .select("fixture_id, field, new_value, reason, created_at")
          .order("created_at", { ascending: false }),
      ])
    : [{ data: null }, { data: null }, { data: null }, { data: null }, { data: null }];

  const selectedLga = lga ? (lgas ?? []).find((entry) => entry.id === lga) : null;
  const rows = (fixtures ?? []).filter((fixture) =>
    (!stage || fixture.stage_id === stage) &&
    (!group || fixture.qualifier_group === group) &&
    (!selectedLga || fixture.qualifier_group === selectedLga.qualifier_group),
  );
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

  const viewParams = new URLSearchParams();
  if (stage) viewParams.set("stage", stage);
  if (group) viewParams.set("group", group);
  if (lga) viewParams.set("lga", lga);
  const listHref = `/schedule${viewParams.toString() ? `?${viewParams}` : ""}`;
  viewParams.set("view", "calendar");
  const calendarHref = `/schedule?${viewParams}`;

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
        <form className="mb-10 flex flex-wrap items-end gap-4" aria-label="Filter schedule">
          <label className="text-[13px] font-semibold text-primary">Stage<select name="stage" defaultValue={stage ?? ""} className="mt-2 block rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]"><option value="">All stages</option>{(stages ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <label className="text-[13px] font-semibold text-primary">LGA<select name="lga" defaultValue={lga ?? ""} className="mt-2 block rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]"><option value="">All LGAs</option>{(lgas ?? []).map((entry) => <option key={entry.id} value={entry.id}>{entry.name}{entry.is_combined ? " (combined group)" : ""}</option>)}</select></label>
          <label className="text-[13px] font-semibold text-primary">Qualifier group<select name="group" defaultValue={group ?? ""} className="mt-2 block rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]"><option value="">All groups</option>{[...new Set((fixtures ?? []).map((f) => f.qualifier_group).filter(Boolean))].map((g) => <option key={g} value={g!}>{g!.replace(/-/g, " + ")}</option>)}</select></label>
          <button type="submit" className="rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white">Filter</button>
        </form>
        <div className="mb-10 flex flex-wrap items-center gap-2" aria-label="Schedule view">
          <span className="mr-2 text-[12px] font-semibold text-primary/50">View</span>
          <a href={listHref} aria-current={!calendarView ? "page" : undefined} className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${!calendarView ? "bg-primary text-white" : "bg-white text-primary/60 hover:bg-primary/10"}`}>List</a>
          <a href={calendarHref} aria-current={calendarView ? "page" : undefined} className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${calendarView ? "bg-primary text-white" : "bg-white text-primary/60 hover:bg-primary/10"}`}>Month calendar</a>
        </div>
        {calendarView ? (
          <ScheduleCalendar fixtures={rows} stages={(stages ?? []).map((entry) => ({ id: entry.id, name: entry.name }))} venues={(venues ?? []).map((entry) => ({ id: entry.id, name: entry.name }))} />
        ) : rows.length === 0 ? (
          <Reveal>
            <div className="rounded-[28px] bg-white p-10 text-center">
              <h2 className="font-display text-xl font-bold">
                The schedule is being finalised
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-primary/60">
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
                  <span className="font-mono text-[13px] tabular-nums text-primary/30">
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
                            <p className="mt-1 text-[13px] text-primary/55">
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
                              <p className="mt-0.5 text-[13px] text-primary/45">
                                {v.name}
                                {v.address ? `, ${v.address}` : ""}
                              </p>
                            ) : null}
                          </div>
                          {changed ? (
                            <span className="rounded-full bg-gold/25 px-3.5 py-1.5 text-[11px] font-bold text-gold-ink">
                              Changed
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/10 pt-3">
                          <a href={`/schedule/${f.id}/ics`} className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream">Add to calendar</a>
                        </div>
                        {changed?.reason ? (
                          <p className="mt-3 border-t border-black/10 pt-3 text-[13px] leading-relaxed text-primary/55">
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
