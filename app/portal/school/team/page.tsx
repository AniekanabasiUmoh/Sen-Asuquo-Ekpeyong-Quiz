import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { Documents, Roster, type RosterCounts } from "./roster";

export const metadata: Metadata = {
  title: "Our team",
  robots: { index: false },
};

export default async function TeamPage() {
  const user = await requireUser("/portal/school/team");
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("id, name, status")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!school) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          Register your school first
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-primary/60">
          Your five qualifying students can be entered once the school itself is
          registered.
        </p>
        <Link
          href="/portal/school/register"
          className="mt-8 inline-block rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white"
        >
          Start registration
        </Link>
      </div>
    );
  }

  const [{ data: students }, { data: rosterRows }, { data: documents }] =
    await Promise.all([
      supabase
        .from("students")
        .select("*")
        .eq("school_id", school.id)
        .order("created_at"),
      supabase.rpc("roster_status", { target: school.id }),
      supabase
        .from("school_documents")
        .select("*")
        .eq("school_id", school.id)
        .order("created_at", { ascending: false }),
    ]);

  const counts: RosterCounts = rosterRows?.[0] ?? {
    total: 0,
    strikers: 0,
    assists: 0,
    is_valid: false,
  };

  // Photos live in a private bucket, so each needs a short-lived signed URL.
  // One hour is long enough for a working session and short enough that a
  // copied link is not a lasting leak.
  const photoUrls: Record<string, string> = {};
  const withPhotos = (students ?? []).filter((s) => s.photo_path);
  if (withPhotos.length) {
    const { data: signed } = await supabase.storage
      .from("student-photos")
      .createSignedUrls(
        withPhotos.map((s) => s.photo_path as string),
        3600,
      );
    signed?.forEach((entry, i) => {
      if (entry.signedUrl) photoUrls[withPhotos[i].id] = entry.signedUrl;
    });
  }

  // Once the registration is with the committee the roster is read-only, for
  // the same reason the registration itself is.
  const locked = !["draft", "changes_requested", "approved"].includes(school.status);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
        {school.name}
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Our team
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        Five students carry your school: three Strikers, who answer in their own
        right, and two Assists, whose answers are worth half a point. Your mentor
        is the Coach.
      </p>

      {locked ? (
        <p
          role="status"
          className="mt-6 max-w-2xl rounded-2xl border border-black/10 bg-white px-5 py-4 text-[13px] leading-relaxed text-primary/65"
        >
          Your registration is with the committee, so the team is read-only until
          they have reviewed it.
        </p>
      ) : null}

      <div className="mt-9">
        <Roster
          students={students ?? []}
          counts={counts}
          photoUrls={photoUrls}
          locked={locked}
        />
      </div>

      <Documents documents={documents ?? []} locked={locked} />
    </div>
  );
}
