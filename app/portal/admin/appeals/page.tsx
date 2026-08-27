import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { AppealsAdmin } from "./appeals-admin";

export const metadata: Metadata = { title: "Appeals", robots: { index: false } };

export default async function AdminAppealsPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/appeals");
  const supabase = await createClient();
  const [appealsResult, schoolsResult] = await Promise.all([
    supabase.from("appeals").select("*").order("created_at", { ascending: false }),
    supabase.from("schools").select("id, name"),
  ]);
  const schoolNames = Object.fromEntries((schoolsResult.data ?? []).map((school) => [school.id, school.name]));

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">Organising Committee</p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">Appeals &amp; disputes</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">Review school queries and record an accountable response. Closed appeals retain their immutable submission and resolution timestamps in the audit trail.</p>
      {appealsResult.error ? (
        <p role="alert" className="mt-10 max-w-2xl rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-[13px] leading-relaxed text-gold-ink">The appeals workflow is not enabled in this environment yet. Apply the appeals migration before accepting or resolving submissions.</p>
      ) : (
        <div className="mt-10"><AppealsAdmin appeals={appealsResult.data ?? []} schoolNames={schoolNames} /></div>
      )}
    </div>
  );
}
