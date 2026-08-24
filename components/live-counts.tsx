import { createPublicClient } from "@/lib/supabase/server";

/**
 * Live registration figures.
 *
 * Deliberately SEPARATE from the `stats` block in content/homepage.ts. Those
 * are the client's approved projections (250+ schools, 10,000+ students) and
 * are not to be replaced by live counts; see the note above `stats` there. This
 * says something different: how many schools have actually registered so far.
 *
 * It renders nothing until at least one school is approved, because "0 schools
 * registered" on the public homepage reads as a failing campaign rather than an
 * early one.
 *
 * Cached for an hour rather than read per request. Without this the whole
 * homepage turns dynamic, and the primary audience is on Nigerian mobile data
 * where a CDN-cached page is the difference between fast and unusable. A
 * registration count an hour stale costs nothing.
 */
export async function LiveCounts() {
  const supabase = createPublicClient();
  const { data } = await supabase.rpc("public_counts");
  const counts = data?.[0];

  if (!counts || counts.approved_schools === 0) return null;

  const cells = [
    { value: counts.approved_schools, label: "Schools registered" },
    { value: counts.participating_lgas, label: "LGAs represented" },
    { value: counts.registered_students, label: "Students entered" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        Registration so far
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cells.map((c) => (
          <div key={c.label} className="rounded-[24px] bg-white p-7">
            <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-none tabular-nums">
              {c.value.toLocaleString("en-GB")}
            </p>
            <p className="mt-2.5 text-[13px] font-semibold text-[#003090]/55">
              {c.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
