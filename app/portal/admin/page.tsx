import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { RegistrationStatus } from "@/lib/supabase/types";

import { ReviewPanel } from "./review-panel";

export const metadata: Metadata = {
  title: "Registrations",
  robots: { index: false },
};

const QUEUE: RegistrationStatus[] = ["submitted", "under_review"];

export default async function AdminRegistrationsPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin");
  const supabase = await createClient();

  const [{ data: schools }, { data: lgas }] = await Promise.all([
    supabase.from("schools").select("*").order("submitted_at", { ascending: true }),
    supabase.from("lgas").select("*").order("sort_order"),
  ]);

  const rows = schools ?? [];
  const lgaName = new Map((lgas ?? []).map((l) => [l.id, l.name]));

  const pending = rows.filter((s) => QUEUE.includes(s.status));
  const settled = rows.filter((s) => !QUEUE.includes(s.status));

  const counts = {
    pending: pending.length,
    approved: rows.filter((s) => s.status === "approved").length,
    draft: rows.filter((s) => s.status === "draft").length,
  };

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        School registrations
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Awaiting review" value={counts.pending} />
        <Stat label="Approved" value={counts.approved} />
        <Stat label="Started, not submitted" value={counts.draft} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">
          Awaiting review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-[14px] text-[#003090]/55">
            Nothing is waiting for review.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {pending.map((s) => (
              <li key={s.id} className="rounded-[24px] bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{s.name}</h3>
                    <p className="mt-1 text-[13px] text-[#003090]/55">
                      {lgaName.get(s.lga_id) ?? "Unknown LGA"} ·{" "}
                      {s.is_private ? "Private" : "Public"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f0a800]/25 px-3.5 py-1.5 text-[11px] font-bold text-[#7a5300]">
                    {s.status === "submitted" ? "Submitted" : "Under review"}
                  </span>
                </div>

                <dl className="mt-4 grid gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2">
                  <Row k="Principal" v={s.principal_name} />
                  <Row k="Coordinator" v={s.contact_name} />
                  <Row k="Email" v={s.contact_email} />
                  <Row k="Phone" v={s.contact_phone} />
                  <Row k="Address" v={s.address} />
                  <Row
                    k="Submitted"
                    v={
                      s.submitted_at
                        ? new Date(s.submitted_at).toLocaleString("en-GB")
                        : null
                    }
                  />
                </dl>

                <ReviewPanel schoolId={s.id} schoolName={s.name} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold">
          All registrations ({settled.length})
        </h2>
        {settled.length === 0 ? (
          <p className="mt-3 text-[14px] text-[#003090]/55">
            No other registrations yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.12em] text-[#003090]/45">
                  <th className="py-3 pr-4 font-bold">School</th>
                  <th className="py-3 pr-4 font-bold">LGA</th>
                  <th className="py-3 pr-4 font-bold">Status</th>
                  <th className="py-3 pr-4 font-bold">Registration no.</th>
                </tr>
              </thead>
              <tbody>
                {settled.map((s) => (
                  <tr key={s.id} className="border-b border-black/[0.06]">
                    <td className="py-3 pr-4 font-semibold">{s.name}</td>
                    <td className="py-3 pr-4 text-[#003090]/60">
                      {lgaName.get(s.lga_id) ?? "-"}
                    </td>
                    <td className="py-3 pr-4 text-[#003090]/60">{s.status}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums text-[#003090]/60">
                      {s.registration_no ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="flex gap-3">
      <dt className="min-w-[6.5rem] font-semibold text-[#003090]/50">{k}</dt>
      <dd className="text-[#003090]/80">{v || "Not given"}</dd>
    </div>
  );
}
