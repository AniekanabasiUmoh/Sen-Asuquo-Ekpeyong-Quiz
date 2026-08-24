import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import {
  ScheduleAdmin,
  type ChangeRow,
  type FixtureRow,
  type VenueRow,
} from "./schedule-admin";

export const metadata: Metadata = {
  title: "Schedule",
  robots: { index: false },
};

export default async function AdminSchedulePage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/schedule");
  const supabase = await createClient();

  const [
    { data: fixtures },
    { data: stages },
    { data: venues },
    { data: lgas },
    { data: changes },
  ] = await Promise.all([
    supabase
      .from("fixtures")
      .select("id, name, stage_id, qualifier_group, venue_id, scheduled_at, publish, status")
      .order("scheduled_at", { ascending: true, nullsFirst: false }),
    supabase.from("stages").select("*").order("ordinal"),
    supabase.from("venues").select("id, name, lga_id").order("name"),
    supabase.from("lgas").select("*").order("sort_order"),
    supabase
      .from("fixture_changes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Schedule
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#003090]/60">
        Fixtures, venues and dates. Nothing appears on the public schedule until
        it is published, and every change to a time or venue is logged and shown
        to schools, who plan travel around these dates.
      </p>

      <div className="mt-9">
        <ScheduleAdmin
          fixtures={(fixtures ?? []) as FixtureRow[]}
          stages={stages ?? []}
          venues={(venues ?? []) as VenueRow[]}
          lgas={lgas ?? []}
          changes={(changes ?? []) as ChangeRow[]}
        />
      </div>
    </div>
  );
}
