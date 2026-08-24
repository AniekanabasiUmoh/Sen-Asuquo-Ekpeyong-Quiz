import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "LGA groupings",
  robots: { index: false },
};

/**
 * Qualifier groupings.
 *
 * Grouping is by qualifier_group, not by LGA. Akpabuyo and Bakassi share one
 * group because their school numbers are low, so the seven LGAs produce six
 * groups, and six groups of five qualifiers are what make the 30-school Group
 * Stage field.
 */
export default async function AdminLgasPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/lgas");
  const supabase = await createClient();

  const [{ data: rows }, { data: lgas }] = await Promise.all([
    supabase.rpc("lga_registration_counts"),
    supabase.from("lgas").select("*").order("sort_order"),
  ]);

  const counts = rows ?? [];

  // Fold the LGAs into their qualifier groups.
  const groups = new Map<
    string,
    { names: string[]; approved: number; pending: number; schools: number }
  >();
  for (const l of lgas ?? []) {
    const c = counts.find((r) => r.lga_id === l.id);
    const g = groups.get(l.qualifier_group) ?? {
      names: [],
      approved: 0,
      pending: 0,
      schools: 0,
    };
    g.names.push(l.name);
    g.approved += c?.approved ?? 0;
    g.pending += c?.pending ?? 0;
    g.schools += l.school_count;
    groups.set(l.qualifier_group, g);
  }

  const totalApproved = counts.reduce((n, r) => n + r.approved, 0);
  const totalPending = counts.reduce((n, r) => n + r.pending, 0);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        LGA groupings
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#003090]/60">
        Akpabuyo and Bakassi jointly contest one qualifying slot, so the seven
        Local Government Areas form six qualifying groups. Five schools advance
        from each, which is what produces the thirty school Group Stage field.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Qualifying groups" value={groups.size} />
        <Stat label="Schools approved" value={totalApproved} />
        <Stat label="Awaiting review" value={totalPending} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">
          Qualifying groups ({groups.size})
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {[...groups.entries()].map(([key, g]) => (
            <li key={key} className="rounded-[24px] bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold">
                  {g.names.join(" + ")}
                </h3>
                {g.names.length > 1 ? (
                  <span className="rounded-full bg-[#f0a800]/25 px-3 py-1 text-[11px] font-bold text-[#7a5300]">
                    Combined
                  </span>
                ) : null}
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Cell k="Approved" v={g.approved} />
                <Cell k="Pending" v={g.pending} />
                <Cell k="Eligible" v={g.schools} />
              </dl>
              <p className="mt-4 border-t border-black/10 pt-3 text-[12px] text-[#003090]/50">
                5 schools advance to the Group Stage
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold">By Local Government Area</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.12em] text-[#003090]/45">
                <th className="py-3 pr-4 font-bold">LGA</th>
                <th className="py-3 pr-4 font-bold">Qualifying group</th>
                <th className="py-3 pr-4 font-bold">Eligible schools</th>
                <th className="py-3 pr-4 font-bold">Approved</th>
                <th className="py-3 pr-4 font-bold">Pending</th>
              </tr>
            </thead>
            <tbody>
              {(lgas ?? []).map((l) => {
                const c = counts.find((r) => r.lga_id === l.id);
                return (
                  <tr key={l.id} className="border-b border-black/[0.06]">
                    <td className="py-3 pr-4 font-semibold">{l.name}</td>
                    <td className="py-3 pr-4 text-[#003090]/60">
                      {l.qualifier_group.replace(/-/g, " + ")}
                    </td>
                    <td className="py-3 pr-4 tabular-nums text-[#003090]/60">
                      {l.school_count}
                    </td>
                    <td className="py-3 pr-4 tabular-nums text-[#003090]/60">
                      {c?.approved ?? 0}
                    </td>
                    <td className="py-3 pr-4 tabular-nums text-[#003090]/60">
                      {c?.pending ?? 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed text-[#003090]/45">
          Eligible school counts are the provisional public school figures from
          the Principals&rsquo; Meeting Report and total 117. The published
          &ldquo;250+ schools&rdquo; figure includes private schools and
          projected participation.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] bg-white p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#003090]/45">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: number }) {
  return (
    <div className="rounded-2xl bg-[#faf6ee] py-3">
      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#003090]/45">
        {k}
      </dt>
      <dd className="mt-1 font-display text-xl font-extrabold tabular-nums">{v}</dd>
    </div>
  );
}
