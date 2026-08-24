import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hall of Fame",
  description:
    "Champions, top students and mentors of the Senator Asuquo Ekpenyong Academic Championship.",
};

const KIND_LABEL: Record<string, string> = {
  champion: "Champion School",
  runner_up: "Runner Up",
  third_place: "Third Place",
  top_student: "Top Student",
  best_coach: "Best Coach",
  best_lga: "Best Local Government Area",
  consolation: "Consolation",
  special: "Special Award",
};

/**
 * Hall of Fame, Content Guide §4.13 and Phase 5 sprint 5.1.
 *
 * Grouped by season from the start: this is meant to become an archive across
 * editions rather than a page that is overwritten each year.
 */
export default async function HallOfFamePage() {
  const supabase = createPublicClient();

  const [{ data: seasons }, { data: awards }, { data: schools }, { data: legacy }] =
    await Promise.all([
      supabase.from("seasons").select("*").order("year", { ascending: false }),
      supabase.from("awards").select("*"),
      supabase.from("schools").select("id, name"),
      supabase.from("legacy_projects").select("*"),
    ]);

  const schoolName = new Map((schools ?? []).map((s) => [s.id, s.name]));
  const bySeason = new Map<string, typeof awards>();
  for (const a of awards ?? []) {
    const list = bySeason.get(a.season_id) ?? [];
    list.push(a);
    bySeason.set(a.season_id, list);
  }

  const hasAny = (awards ?? []).length > 0;

  return (
    <>
      <PageHero
        eyebrow="Hall of Fame"
        title="Champions of the"
        titleTrail="Championship"
        intro="The schools, students and mentors who set the standard."
        image="/img/students-posing.jpg"
        imageAlt="Students celebrating with the championship trophy"
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        {!hasAny ? (
          <Reveal>
            <div className="rounded-[28px] bg-white p-10 text-center">
              <h2 className="font-display text-xl font-bold">
                The first champions are yet to be crowned
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#003090]/60">
                The maiden edition is under way. This page will carry the
                champion school, the top student and the best mentor, and will
                keep them for every edition that follows.
              </p>
            </div>
          </Reveal>
        ) : (
          (seasons ?? [])
            .filter((s) => bySeason.has(s.id))
            .map((season) => (
              <div key={season.id} className="mb-14 last:mb-0">
                <h2 className="font-display text-2xl font-extrabold">{season.name}</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(bySeason.get(season.id) ?? []).map((a) => (
                    <li key={a.id} className="rounded-[24px] bg-white p-7">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#003090]/45">
                        {KIND_LABEL[a.kind] ?? a.kind}
                      </p>
                      <h3 className="mt-2 font-display text-lg font-bold">
                        {a.school_id ? schoolName.get(a.school_id) ?? a.title : a.title}
                      </h3>
                      {a.description ? (
                        <p className="mt-2 text-[13px] leading-relaxed text-[#003090]/55">
                          {a.description}
                        </p>
                      ) : null}
                      {a.prize_note ? (
                        <p className="mt-3 border-t border-black/10 pt-3 text-[12px] font-semibold text-[#003090]/60">
                          {a.prize_note}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))
        )}

        {(legacy ?? []).length > 0 ? (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-extrabold">Legacy projects</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#003090]/60">
              What the championship leaves behind in the district.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {(legacy ?? []).map((p) => (
                <li key={p.id} className="rounded-[24px] bg-white p-7">
                  <h3 className="font-display text-lg font-bold">{p.title}</h3>
                  {p.description ? (
                    <p className="mt-2 text-[14px] leading-relaxed text-[#003090]/60">
                      {p.description}
                    </p>
                  ) : null}
                  <p className="mt-3 text-[12px] font-semibold text-[#003090]/50">
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </>
  );
}
