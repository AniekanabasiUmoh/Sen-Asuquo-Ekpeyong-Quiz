import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { AppealForm } from "./appeals-form";

export const metadata: Metadata = { title: "Appeals", robots: { index: false } };

export default async function SchoolAppealsPage() {
  const user = await requireUser("/portal/school/appeals");
  const supabase = await createClient();
  let { data: school } = await supabase.from("schools").select("id, name").eq("owner_id", user.id).maybeSingle();

  if (!school && user.roles.includes("coach")) {
    const { data: assignment } = await supabase.from("coaches").select("school_id").eq("user_id", user.id).maybeSingle();
    if (assignment) {
      const result = await supabase.from("schools").select("id, name").eq("id", assignment.school_id).maybeSingle();
      school = result.data;
    }
  }

  const appealsResult = school
    ? await supabase.from("appeals").select("*").eq("school_id", school.id).order("created_at", { ascending: false })
    : { data: [], error: null };

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">School workspace</p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">Appeals &amp; queries</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-primary/60">Submit a registration, result, schedule or other competition query. The committee will record its response and resolution here.</p>
      {appealsResult.error ? (
        <p role="alert" className="mt-10 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-[13px] leading-relaxed text-gold-ink">The appeals workflow is not enabled in this environment yet. The committee must apply the appeals migration before submissions can be accepted.</p>
      ) : (
        <>
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">Your submissions ({appealsResult.data?.length ?? 0})</h2>
            {appealsResult.data?.length ? (
              <ul className="mt-5 space-y-3">
                {appealsResult.data.map((appeal) => (
                  <li key={appeal.id} className="rounded-[24px] bg-white p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-base font-bold">{appeal.subject}</h3>
                        <p className="mt-1 text-[12px] capitalize text-primary/50">{appeal.kind} · {new Date(appeal.created_at).toLocaleDateString("en-GB")}</p>
                      </div>
                      <span className="rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/60">{appeal.status.replace("_", " ")}</span>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-[14px] leading-relaxed text-primary/65">{appeal.details}</p>
                    {appeal.resolution ? <p className="mt-4 border-t border-black/10 pt-4 text-[14px] leading-relaxed text-primary/70"><strong>Committee response: </strong>{appeal.resolution}</p> : null}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-[13px] text-primary/45">No appeals submitted.</p>}
          </section>
          <section className="mt-12"><h2 className="font-display text-xl font-bold">Submit a new appeal</h2><AppealForm /></section>
        </>
      )}
    </div>
  );
}
