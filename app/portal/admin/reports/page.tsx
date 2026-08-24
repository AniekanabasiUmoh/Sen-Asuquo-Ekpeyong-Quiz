import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reports",
  robots: { index: false },
};

/**
 * Committee reports, Phase 5 sprint 5.2.
 *
 * Registration and participation by LGA, plus the audit summary. Deliberately
 * plain: this is a page someone prints or reads into a meeting, not a
 * dashboard to admire.
 */
export default async function AdminReportsPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/reports");
  const supabase = await createClient();

  const [{ data: report }, { data: counts }, { data: audit }, { data: progression }, { data: attendance }] =
    await Promise.all([
      supabase.rpc("registration_report"),
      supabase.rpc("public_counts"),
      supabase
        .from("audit_log")
        .select("action")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.rpc("progression_report"),
      supabase.rpc("attendance_report"),
    ]);

  const rows = report ?? [];
  const live = counts?.[0];

  const totals = rows.reduce(
    (acc, r) => ({
      eligible: acc.eligible + r.eligible,
      drafts: acc.drafts + r.drafts,
      submitted: acc.submitted + r.submitted,
      approved: acc.approved + r.approved,
      rejected: acc.rejected + r.rejected,
      students: acc.students + r.students,
    }),
    { eligible: 0, drafts: 0, submitted: 0, approved: 0, rejected: 0, students: 0 },
  );

  // Most frequent recorded actions, as a crude activity summary.
  const actionCounts = new Map<string, number>();
  for (const a of audit ?? []) {
    actionCounts.set(a.action, (actionCounts.get(a.action) ?? 0) + 1);
  }
  const topActions = [...actionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Reports
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        Registration and participation across the seven Local Government Areas.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Schools approved" value={live?.approved_schools ?? 0} />
        <Stat label="LGAs represented" value={live?.participating_lgas ?? 0} />
        <Stat label="Students entered" value={live?.registered_students ?? 0} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">Registration by LGA</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.12em] text-primary/45">
                <th className="py-3 pr-4 font-bold">LGA</th>
                <th className="py-3 pr-4 font-bold">Eligible</th>
                <th className="py-3 pr-4 font-bold">Draft</th>
                <th className="py-3 pr-4 font-bold">Submitted</th>
                <th className="py-3 pr-4 font-bold">Approved</th>
                <th className="py-3 pr-4 font-bold">Rejected</th>
                <th className="py-3 pr-4 font-bold">Students</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.lga_name} className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-semibold">{r.lga_name}</td>
                  <Cell v={r.eligible} />
                  <Cell v={r.drafts} />
                  <Cell v={r.submitted} />
                  <Cell v={r.approved} />
                  <Cell v={r.rejected} />
                  <Cell v={r.students} />
                </tr>
              ))}
              <tr className="border-t-2 border-black/15 font-bold">
                <td className="py-3 pr-4">Total</td>
                <Cell v={totals.eligible} />
                <Cell v={totals.drafts} />
                <Cell v={totals.submitted} />
                <Cell v={totals.approved} />
                <Cell v={totals.rejected} />
                <Cell v={totals.students} />
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed text-primary/45">
          Eligible counts are the provisional public school figures from the
          Principals&rsquo; Meeting Report and total 117. The published
          &ldquo;250+ schools&rdquo; figure includes private schools and
          projected participation.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold">Progression</h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-primary/55">
          Schools with a published result at each stage, and how many advanced
          past it. Empty until fixtures have been played and results
          published.
        </p>
        {(progression ?? []).every((p) => p.entered === 0) ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-6 text-center text-[13px] text-primary/45">
            No results published yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-2">
            {(progression ?? []).map((p) => (
              <li
                key={p.stage_ordinal}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3.5"
              >
                <span className="text-[13px] font-semibold">
                  <span className="mr-2 font-mono text-[11px] tabular-nums text-primary/30">
                    {String(p.stage_ordinal).padStart(2, "0")}
                  </span>
                  {p.stage_name}
                </span>
                <span className="text-[13px] tabular-nums text-primary/60">
                  {p.advanced} of {p.entered} advanced
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold">Attendance</h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-primary/55">
          Check-in rate by accreditation type. See{" "}
          <a
            href="/portal/admin/accreditation"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Accreditation
          </a>{" "}
          to issue badges or scan someone in.
        </p>
        {(attendance ?? []).length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-6 text-center text-[13px] text-primary/45">
            No accreditations issued yet.
          </p>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {(attendance ?? []).map((a) => (
              <li key={a.holder_type} className="rounded-2xl bg-white px-5 py-4">
                <p className="text-[13px] font-semibold capitalize">{a.holder_type}s</p>
                <p className="mt-1 font-display text-lg font-extrabold tabular-nums">
                  {a.checked_in} <span className="text-primary/40">/ {a.issued}</span>
                </p>
                {a.revoked > 0 ? (
                  <p className="mt-0.5 text-[11px] text-primary/45">{a.revoked} revoked</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold">Recorded activity</h2>
        <p className="mt-1.5 text-[14px] text-primary/55">
          The most frequent actions in the last 500 audit entries.
        </p>
        {topActions.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-6 text-center text-[13px] text-primary/45">
            Nothing recorded yet.
          </p>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {topActions.map(([action, n]) => (
              <li
                key={action}
                className="flex items-center justify-between rounded-2xl bg-white px-5 py-4"
              >
                <span className="text-[13px] font-semibold">{action}</span>
                <span className="font-display text-lg font-extrabold tabular-nums">
                  {n}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] bg-white p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary/45">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}

function Cell({ v }: { v: number }) {
  return <td className="py-3 pr-4 tabular-nums text-primary/70">{v}</td>;
}
