import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { ShiftsAndBriefings } from "./shifts";
import { VolunteerRows } from "./volunteer-rows";

export const metadata: Metadata = {
  title: "Change Makers",
  robots: { index: false },
};

export default async function AdminVolunteersPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/volunteers");
  const supabase = await createClient();

  const [{ data: volunteers }, { data: lgas }, { data: shifts }, { data: briefings }] =
    await Promise.all([
      supabase.from("volunteers").select("*").order("created_at", { ascending: false }),
      supabase.from("lgas").select("id, name").order("sort_order"),
      supabase.from("volunteer_shifts").select("*").order("starts_at"),
      supabase.from("volunteer_briefings").select("*").order("created_at", { ascending: false }),
    ]);

  const rows = volunteers ?? [];
  const applied = rows.filter((v) => v.status === "applied");

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Change Makers
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        People who have offered to help at the qualifiers and the Grand Finale.
        {applied.length > 0
          ? ` ${applied.length} awaiting a decision.`
          : " Nothing is awaiting a decision."}
      </p>

      <div className="mt-9">
        <VolunteerRows
          volunteers={rows}
          lgaNames={Object.fromEntries((lgas ?? []).map((l) => [l.id, l.name]))}
          shifts={shifts ?? []}
        />
      </div>

      <section className="mt-14 border-t border-black/10 pt-10">
        <h2 className="font-display text-xl font-bold">Shifts &amp; briefings</h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-primary/55">
          What accepted Change Makers see on their own dashboard once assigned.
        </p>
        <div className="mt-7">
          <ShiftsAndBriefings shifts={shifts ?? []} briefings={briefings ?? []} />
        </div>
      </section>
    </div>
  );
}
