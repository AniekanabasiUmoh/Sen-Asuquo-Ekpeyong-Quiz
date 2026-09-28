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

  const [{ data: volunteers }, { data: lgas }, { data: shifts }, { data: briefings }, { data: messages }] =
    await Promise.all([
      supabase.from("volunteers").select("*").order("created_at", { ascending: false }),
      supabase.from("lgas").select("id, name").order("sort_order"),
      supabase.from("volunteer_shifts").select("*").order("starts_at"),
      supabase.from("volunteer_briefings").select("*").order("created_at", { ascending: false }),
      supabase.from("volunteer_messages").select("*").order("created_at", { ascending: false }),
    ]);

  const rows = volunteers ?? [];
  const applied = rows.filter((v) => v.status === "applied");
  const accepted = rows.filter((v) => v.status === "accepted");

  // Headshots are held in a private bucket. Sign them briefly only after the
  // page's committee-role check, then pass the links to this admin-only UI.
  const photoUrls: Record<string, string> = {};
  const withPhotos = rows.filter((v) => v.photo_path);
  if (withPhotos.length > 0) {
    const { data: signed } = await supabase.storage
      .from("volunteer-photos")
      .createSignedUrls(withPhotos.map((v) => v.photo_path as string), 3600);
    signed?.forEach((entry, index) => {
      if (entry.signedUrl) photoUrls[withPhotos[index].id] = entry.signedUrl;
    });
  }

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

      <dl className="mt-7 grid gap-3 sm:grid-cols-3">
        <Metric label="Applications received" value={rows.length} />
        <Metric label="Awaiting review" value={applied.length} />
        <Metric label="Accepted" value={accepted.length} />
      </dl>

      <div className="mt-9">
        <VolunteerRows
          volunteers={rows}
          photoUrls={photoUrls}
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
          <ShiftsAndBriefings shifts={shifts ?? []} briefings={briefings ?? []} messages={messages ?? []} />
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4">
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary/45">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-extrabold text-primary">
        {value.toLocaleString("en-NG")}
      </dd>
    </div>
  );
}
