import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { RegistrationStatus } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "My school",
  robots: { index: false },
};

const STATUS_COPY: Record<
  RegistrationStatus,
  { label: string; tone: string; body: string }
> = {
  draft: {
    label: "Draft",
    tone: "bg-black/[0.06] text-[#003090]/70",
    body: "Your registration has been started but not yet submitted.",
  },
  submitted: {
    label: "Submitted",
    tone: "bg-[#f0a800]/25 text-[#7a5300]",
    body: "The Organising Committee has your registration and will review it shortly.",
  },
  under_review: {
    label: "Under review",
    tone: "bg-[#f0a800]/25 text-[#7a5300]",
    body: "The committee is reviewing your registration now.",
  },
  changes_requested: {
    label: "Changes requested",
    tone: "bg-[#f44423]/15 text-[#c1300f]",
    body: "The committee has asked for something to be corrected before they can approve it.",
  },
  approved: {
    label: "Approved",
    tone: "bg-[#2dc653]/20 text-[#155d27]",
    body: "Your school is registered for the championship.",
  },
  rejected: {
    label: "Not accepted",
    tone: "bg-[#f44423]/15 text-[#c1300f]",
    body: "This registration was not accepted.",
  },
  withdrawn: {
    label: "Withdrawn",
    tone: "bg-black/[0.06] text-[#003090]/70",
    body: "This registration has been withdrawn.",
  },
};

export default async function SchoolDashboardPage() {
  const user = await requireUser("/portal/school");
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!school) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          Register your school
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#003090]/60">
          You have not started a registration yet. It takes about five minutes,
          and you can save and return to it at any point.
        </p>
        <Link
          href="/portal/school/register"
          className="mt-8 inline-block rounded-full bg-[#f0a800] px-7 py-3.5 text-[13px] font-bold text-[#003090] transition hover:bg-[#003090] hover:text-white"
        >
          Start registration
        </Link>
      </div>
    );
  }

  const [{ data: lga }, { count: studentCount }] = await Promise.all([
    supabase.from("lgas").select("name").eq("id", school.lga_id).maybeSingle(),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("school_id", school.id),
  ]);

  const status = STATUS_COPY[school.status];
  const editable = ["draft", "changes_requested"].includes(school.status);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
            {lga?.name ?? "Cross River South"}
          </p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            {school.name}
          </h1>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-[12px] font-bold ${status.tone}`}
        >
          {status.label}
        </span>
      </div>

      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#003090]/60">
        {status.body}
      </p>

      {school.status === "changes_requested" && school.rejection_reason ? (
        <div
          role="alert"
          className="mt-6 max-w-2xl rounded-2xl border border-[#f44423]/30 bg-[#f44423]/5 px-5 py-4 text-[14px] leading-relaxed text-[#c1300f]"
        >
          <strong className="font-bold">What needs changing: </strong>
          {school.rejection_reason}
        </div>
      ) : null}

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile label="Registration number" value={school.registration_no ?? "Issued on approval"} />
        <Tile label="Local Government Area" value={lga?.name ?? "Not set"} />
        <Tile label="School type" value={school.is_private ? "Private" : "Public"} />
        <Tile label="Coordinator" value={school.contact_name ?? "Not set"} />
        <Tile label="Qualifying students" value={`${studentCount ?? 0} of 5`} />
        <Tile
          label="Submitted"
          value={
            school.submitted_at
              ? new Date(school.submitted_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Not yet"
          }
        />
      </div>

      <div className="mt-9 flex flex-wrap gap-4">
        <Link
          href="/portal/school/team"
          className="rounded-full border border-black/15 px-7 py-3.5 text-[13px] font-semibold transition hover:bg-white"
        >
          Manage our team
        </Link>
        <Link
          href="/portal/school/register"
          className={
            editable
              ? "rounded-full bg-[#f0a800] px-7 py-3.5 text-[13px] font-bold text-[#003090] transition hover:bg-[#003090] hover:text-white"
              : "rounded-full border border-black/15 px-7 py-3.5 text-[13px] font-semibold transition hover:bg-white"
          }
        >
          {editable ? "Continue registration" : "View registration"}
        </Link>
      </div>


    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#003090]/45">
        {label}
      </p>
      <p className="mt-2 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
