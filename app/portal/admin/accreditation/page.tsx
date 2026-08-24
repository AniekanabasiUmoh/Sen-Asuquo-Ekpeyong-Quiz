import type { Metadata } from "next";
import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { AccreditationScanner } from "./scanner";
import { AccreditationSummary } from "./summary";

export const metadata: Metadata = {
  title: "Accreditation",
  robots: { index: false },
};

/**
 * Event-day check-in, Phase 4 sprint 4.3.
 *
 * Two independent tools on one page: a live camera scanner for the gate, and
 * a summary/issue panel for preparing badges beforehand. A committee member
 * on their own phone opens this page and scans; nothing here needs a
 * dedicated device.
 */
export default async function AccreditationPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/accreditation");
  const supabase = await createClient();

  const { data: accreditations } = await supabase
    .from("accreditations")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = accreditations ?? [];
  const ids = {
    student: rows.filter((a) => a.holder_type === "student").map((a) => a.holder_id),
    coach: rows.filter((a) => a.holder_type === "coach").map((a) => a.holder_id),
    volunteer: rows.filter((a) => a.holder_type === "volunteer").map((a) => a.holder_id),
    judge: rows.filter((a) => a.holder_type === "judge").map((a) => a.holder_id),
  };

  const [{ data: students }, { data: coaches }, { data: volunteers }, { data: judges }] =
    await Promise.all([
      ids.student.length
        ? supabase.from("students").select("id, full_name").in("id", ids.student)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
      ids.coach.length
        ? supabase.from("coaches").select("id, full_name").in("id", ids.coach)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
      ids.volunteer.length
        ? supabase.from("volunteers").select("id, full_name").in("id", ids.volunteer)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
      ids.judge.length
        ? supabase.from("judges").select("id, full_name").in("id", ids.judge)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
    ]);

  const names: Record<string, string> = {};
  for (const s of students ?? []) names[`student:${s.id}`] = s.full_name;
  for (const c of coaches ?? []) names[`coach:${c.id}`] = c.full_name;
  for (const v of volunteers ?? []) names[`volunteer:${v.id}`] = v.full_name;
  for (const j of judges ?? []) names[`judge:${j.id}`] = j.full_name;

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Accreditation
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#003090]/60">
        Check students, Coaches, Change Makers and judges in at the gate by
        scanning their accreditation code, and see who has arrived.
      </p>

      <Link
        href="/portal/admin/accreditation/badges"
        className="mt-5 inline-block text-[13px] font-semibold text-[#003090] underline-offset-4 hover:underline"
      >
        View and print badges &rarr;
      </Link>

      <div className="mt-9 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <h2 className="font-display text-xl font-bold">Scan a code</h2>
          <div className="mt-5">
            <AccreditationScanner />
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold">Overview</h2>
          <div className="mt-5">
            <AccreditationSummary accreditations={rows} names={names} />
          </div>
        </div>
      </div>
    </div>
  );
}
