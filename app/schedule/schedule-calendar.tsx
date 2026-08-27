import Link from "next/link";

type CalendarFixture = {
  id: string;
  name: string;
  stage_id: string;
  venue_id: string | null;
  scheduled_at: string | null;
};

type CalendarStage = { id: string; name: string };
type CalendarVenue = { id: string; name: string };

export function ScheduleCalendar({
  fixtures,
  stages,
  venues,
}: {
  fixtures: CalendarFixture[];
  stages: CalendarStage[];
  venues: CalendarVenue[];
}) {
  const stageName = new Map(stages.map((stage) => [stage.id, stage.name]));
  const venueName = new Map(venues.map((venue) => [venue.id, venue.name]));
  const months = new Map<string, CalendarFixture[]>();
  const unscheduled: CalendarFixture[] = [];

  for (const fixture of fixtures) {
    if (!fixture.scheduled_at) {
      unscheduled.push(fixture);
      continue;
    }
    const date = new Date(fixture.scheduled_at);
    if (Number.isNaN(date.valueOf())) {
      unscheduled.push(fixture);
      continue;
    }
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.set(key, [...(months.get(key) ?? []), fixture]);
  }

  const sortedMonths = [...months.entries()].sort(([a], [b]) => a.localeCompare(b));
  const dayFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
  const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return <div className="space-y-10">
    {sortedMonths.map(([monthKey, monthFixtures]) => {
      const [year, month] = monthKey.split("-").map(Number);
      const first = new Date(year, month - 1, 1);
      const daysInMonth = new Date(year, month, 0).getDate();
      const mondayOffset = (first.getDay() + 6) % 7;
      const cells = Array.from({ length: Math.ceil((mondayOffset + daysInMonth) / 7) * 7 }, (_, index) => {
        const day = index - mondayOffset + 1;
        return day >= 1 && day <= daysInMonth ? day : null;
      });
      const byDay = new Map<number, CalendarFixture[]>();
      for (const fixture of monthFixtures) {
        const day = new Date(fixture.scheduled_at!).getDate();
        byDay.set(day, [...(byDay.get(day) ?? []), fixture]);
      }
      return <section key={monthKey} aria-labelledby={`month-${monthKey}`}>
        <h2 id={`month-${monthKey}`} className="font-display text-xl font-bold">{monthFormatter.format(first)}</h2>
        <div className="mt-5 overflow-x-auto rounded-[24px] bg-white p-3 sm:p-5">
          <div className="grid min-w-[42rem] grid-cols-7" role="grid" aria-label={`${monthFormatter.format(first)} fixtures`}>
            {weekdayLabels.map((label) => <div key={label} className="border-b border-black/10 px-2 py-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-primary/45" role="columnheader">{label}</div>)}
            {cells.map((day, index) => <div key={`${monthKey}-${index}`} className={`min-h-28 border-b border-r border-black/[0.06] p-2 last:border-r-0 ${day ? "bg-white" : "bg-primary/[0.02]"}`} role="gridcell">{day ? <><p className="font-mono text-[11px] font-bold text-primary/45">{dayFormatter.format(new Date(year, month - 1, day))}</p><ul className="mt-2 space-y-1.5">{(byDay.get(day) ?? []).map((fixture) => <li key={fixture.id}><Link href={`/schedule/${fixture.id}/ics`} className="block rounded-lg bg-primary/[0.06] px-2 py-1.5 text-[10px] font-semibold leading-tight text-primary transition hover:bg-primary/15" title={`${fixture.name} · ${stageName.get(fixture.stage_id) ?? "Fixture"}`}>{fixture.name}{fixture.venue_id && venueName.get(fixture.venue_id) ? <span className="mt-0.5 block font-normal text-primary/55">{venueName.get(fixture.venue_id)}</span> : null}</Link></li>)}</ul></> : null}</div>)}
          </div>
        </div>
      </section>;
    })}
    {unscheduled.length ? <section><h2 className="font-display text-xl font-bold">Dates to be confirmed</h2><ul className="mt-5 space-y-3">{unscheduled.map((fixture) => <li key={fixture.id} className="rounded-[20px] bg-white p-5"><p className="font-display text-base font-bold">{fixture.name}</p><p className="mt-1 text-[13px] text-primary/55">{stageName.get(fixture.stage_id) ?? "Fixture"}</p><Link href={`/schedule/${fixture.id}/ics`} className="mt-3 inline-block text-[12px] font-semibold text-primary underline-offset-4 hover:underline">Add to calendar when confirmed</Link></li>)}</ul></section> : null}
    {!sortedMonths.length && !unscheduled.length ? <p className="rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">No fixtures match these filters.</p> : null}
  </div>;
}
