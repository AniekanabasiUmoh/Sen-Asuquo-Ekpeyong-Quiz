import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Results",
  description:
    "Published results for the Senator Asuquo Ekpenyong Academic Championship, by stage and Local Government Area.",
};

/**
 * Public results portal, Content Guide §4.10.
 *
 * Only published results appear; RLS enforces that, so an unpublished score
 * cannot leak through a query written here. Searching and filtering are done in
 * the URL rather than client state so a result can be linked to directly, which
 * is what people actually do with these pages.
 */
export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stage?: string }>;
}) {
  const { q, stage } = await searchParams;
  // Null when Supabase is not configured; the page renders its empty state
  // rather than erroring. See createPublicClient().
  const supabase = createPublicClient();

  const [{ data: results }, { data: stages }, { data: fixtures }, { data: schools }] = supabase
    ? await Promise.all([
        supabase
          .from("results")
          .select("id, fixture_id, school_id, score, position, advanced, published_at")
          .order("position"),
        supabase.from("stages").select("*").order("ordinal"),
        supabase.from("fixtures").select("id, name, stage_id"),
        supabase.from("schools").select("id, name, lga_id"),
      ])
    : [{ data: null }, { data: null }, { data: null }, { data: null }];

  const schoolName = new Map((schools ?? []).map((s) => [s.id, s.name]));
  const fixture = new Map((fixtures ?? []).map((f) => [f.id, f]));
  const stageName = new Map((stages ?? []).map((s) => [s.id, s.name]));

  let rows = results ?? [];
  if (stage) {
    rows = rows.filter((r) => fixture.get(r.fixture_id)?.stage_id === stage);
  }
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((r) =>
      (schoolName.get(r.school_id) ?? "").toLowerCase().includes(needle),
    );
  }

  // Group by fixture so each result table reads as one contest.
  const byFixture = new Map<string, typeof rows>();
  for (const r of rows) {
    const list = byFixture.get(r.fixture_id) ?? [];
    list.push(r);
    byFixture.set(r.fixture_id, list);
  }

  return (
    <>
      <PageHero
        eyebrow="Results"
        title="Published"
        titleTrail="Results"
        intro="Results are published by the Organising Committee once each stage is complete and verified."
        image="/img/students-posing.jpg"
        imageAlt="Students celebrating at the championship"
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <form className="flex flex-wrap items-end gap-4">
          <label className="min-w-[14rem] flex-1 text-[13px] font-semibold text-primary">
            Search by school
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="School name"
              className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-primary"
            />
          </label>
          <label className="text-[13px] font-semibold text-primary">
            Stage
            <select
              name="stage"
              defaultValue={stage ?? ""}
              className="mt-2 block rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-primary"
            >
              <option value="">All stages</option>
              {(stages ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            Search
          </button>
        </form>

        <div className="mt-10">
          {byFixture.size === 0 ? (
            <Reveal>
              <div className="rounded-[28px] bg-white p-10 text-center">
                <h2 className="font-display text-xl font-bold">
                  {rows.length === 0 && (q || stage)
                    ? "Nothing matched that search"
                    : "No results published yet"}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-primary/60">
                  {rows.length === 0 && (q || stage)
                    ? "Try a different school name or stage."
                    : "Results appear here as each stage is completed and verified by the Organising Committee."}
                </p>
              </div>
            </Reveal>
          ) : (
            [...byFixture.entries()].map(([fixtureId, list]) => {
              const f = fixture.get(fixtureId);
              return (
                <div key={fixtureId} className="mb-10 last:mb-0">
                  <h2 className="font-display text-xl font-bold">{f?.name}</h2>
                  <p className="mt-1 text-[13px] text-primary/50">
                    {f ? stageName.get(f.stage_id) : ""}
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[34rem] border-collapse text-left text-[14px]">
                      <thead>
                        <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.12em] text-primary/45">
                          <th className="py-3 pr-4 font-bold">Position</th>
                          <th className="py-3 pr-4 font-bold">School</th>
                          <th className="py-3 pr-4 font-bold">Score</th>
                          <th className="py-3 pr-4 font-bold">Advanced</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((r) => (
                          <tr key={r.id} className="border-b border-black/[0.06]">
                            <td className="py-3 pr-4 font-mono tabular-nums text-primary/60">
                              {r.position ?? "-"}
                            </td>
                            <td className="py-3 pr-4 font-semibold">
                              {schoolName.get(r.school_id) ?? "Unknown school"}
                            </td>
                            <td className="py-3 pr-4 font-mono tabular-nums">
                              {Number(r.score).toFixed(1)}
                            </td>
                            <td className="py-3 pr-4 text-primary/60">
                              {r.advanced ? "Yes" : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
