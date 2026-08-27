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
    tone: "bg-black/[0.06] text-primary/70",
    body: "Your registration has been started but not yet submitted.",
  },
  submitted: {
    label: "Submitted",
    tone: "bg-gold/25 text-gold-ink",
    body: "The Organising Committee has your registration and will review it shortly.",
  },
  under_review: {
    label: "Under review",
    tone: "bg-gold/25 text-gold-ink",
    body: "The committee is reviewing your registration now.",
  },
  changes_requested: {
    label: "Changes requested",
    tone: "bg-red/15 text-red-ink",
    body: "The committee has asked for something to be corrected before they can approve it.",
  },
  approved: {
    label: "Approved",
    tone: "bg-grass/20 text-forest",
    body: "Your school is registered for the championship.",
  },
  rejected: {
    label: "Not accepted",
    tone: "bg-red/15 text-red-ink",
    body: "This registration was not accepted.",
  },
  withdrawn: {
    label: "Withdrawn",
    tone: "bg-black/[0.06] text-primary/70",
    body: "This registration has been withdrawn.",
  },
};

export default async function SchoolDashboardPage() {
  const user = await requireUser("/portal/school");
  const supabase = await createClient();

  let { data: school } = await supabase
    .from("schools")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  // Coaches are assigned through the coaches table rather than owning the
  // registration. They still need to see the school workspace, but mutation
  // actions remain owner-checked in their respective server actions.
  if (!school && user.roles.includes("coach")) {
    const { data: assignment } = await supabase
      .from("coaches")
      .select("school_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (assignment) {
      const result = await supabase
        .from("schools")
        .select("*")
        .eq("id", assignment.school_id)
        .maybeSingle();
      school = result.data;
    }
  }

  if (!school) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          Register your school
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-primary/60">
          You have not started a registration yet. It takes about five minutes,
          and you can save and return to it at any point.
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

  const [{ data: lga }, { count: studentCount }, { data: participantRows }] = await Promise.all([
    supabase.from("lgas").select("name").eq("id", school.lga_id).maybeSingle(),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("school_id", school.id),
    supabase
      .from("fixture_participants")
      .select("fixture_id")
      .eq("school_id", school.id),
  ]);

  const participantIds = (participantRows ?? []).map((row) => row.fixture_id);
  const [{ data: fixtures }, { data: publishedResults }, { data: stages }, { data: venues }] =
    await Promise.all([
      participantIds.length
        ? supabase
            .from("fixtures")
            .select("id, name, stage_id, venue_id, scheduled_at, publish")
            .in("id", participantIds)
            .eq("publish", "published")
            .order("scheduled_at", { ascending: true, nullsFirst: false })
        : Promise.resolve({ data: [] as { id: string; name: string; stage_id: string; venue_id: string | null; scheduled_at: string | null; publish: string }[] }),
      supabase
        .from("results")
        .select("fixture_id, score, position, advanced, published_at")
        .eq("school_id", school.id)
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false }),
      supabase.from("stages").select("id, name, ordinal").order("ordinal"),
      supabase.from("venues").select("id, name, address"),
    ]);

  const fixtureRows = fixtures ?? [];
  const stageById = new Map((stages ?? []).map((stage) => [stage.id, stage]));
  const venueById = new Map((venues ?? []).map((venue) => [venue.id, venue]));
  const fixtureById = new Map(fixtureRows.map((fixture) => [fixture.id, fixture]));
  const upcomingFixtures = fixtureRows.filter((fixture) => fixture.scheduled_at).slice(0, 3);
  const latestResult = (publishedResults ?? []).find((result) => fixtureById.has(result.fixture_id));
  const latestFixture = latestResult ? fixtureById.get(latestResult.fixture_id) : null;

  const status = STATUS_COPY[school.status];
  const editable = ["draft", "changes_requested"].includes(school.status);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
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

      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        {status.body}
      </p>

      {school.status === "changes_requested" && school.rejection_reason ? (
        <div
          role="alert"
          className="mt-6 max-w-2xl rounded-2xl border border-red/30 bg-red/5 px-5 py-4 text-[14px] leading-relaxed text-red-ink"
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
              ? "rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white"
              : "rounded-full border border-black/15 px-7 py-3.5 text-[13px] font-semibold transition hover:bg-white"
          }
        >
          {editable ? "Continue registration" : "View registration"}
        </Link>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[24px] bg-white p-7" aria-labelledby="progress-heading">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/45">
                Competition progress
              </p>
              <h2 id="progress-heading" className="mt-2 font-display text-xl font-bold">
                {latestFixture ? stageById.get(latestFixture.stage_id)?.name ?? "Published stage" : "Awaiting your first published fixture"}
              </h2>
            </div>
            {latestResult ? (
              <span className="rounded-full bg-grass/20 px-3.5 py-1.5 text-[11px] font-bold text-forest">
                {latestResult.advanced ? "Advanced" : "Result recorded"}
              </span>
            ) : null}
          </div>
          {latestResult ? (
            <p className="mt-4 text-[14px] leading-relaxed text-primary/60">
              Your latest published result is <strong className="font-bold text-primary">{Number(latestResult.score).toFixed(1)} points</strong>{latestResult.position ? `, position ${latestResult.position}` : ""}. Open the results portal for the complete published table.
            </p>
          ) : (
            <p className="mt-4 text-[14px] leading-relaxed text-primary/60">
              The committee will publish your school&rsquo;s stage and result here as each fixture is verified. Student names remain visible only inside your school workspace.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/results" className="rounded-full bg-primary px-5 py-3 text-[12px] font-bold text-white transition hover:bg-navy-deep">View published results</Link>
            <Link href="/downloads" className="rounded-full border border-black/15 px-5 py-3 text-[12px] font-semibold transition hover:bg-cream">Rules &amp; downloads</Link>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-7" aria-labelledby="school-schedule-heading">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/45">
                Your published fixtures
              </p>
              <h2 id="school-schedule-heading" className="mt-2 font-display text-xl font-bold">Upcoming schedule</h2>
            </div>
            <Link href="/schedule" className="text-[12px] font-bold text-red-ink hover:text-red">Full schedule →</Link>
          </div>
          {upcomingFixtures.length ? (
            <ul className="mt-5 divide-y divide-black/10">
              {upcomingFixtures.map((fixture) => {
                const venue = fixture.venue_id ? venueById.get(fixture.venue_id) : null;
                return <li key={fixture.id} className="py-3 first:pt-0 last:pb-0"><p className="text-[14px] font-semibold">{fixture.name}</p><p className="mt-1 text-[12px] text-primary/55">{stageById.get(fixture.stage_id)?.name ?? "Fixture"}{fixture.scheduled_at ? ` · ${new Date(fixture.scheduled_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : " · Date to be confirmed"}</p>{venue ? <p className="mt-1 text-[12px] text-primary/45">{venue.name}{venue.address ? `, ${venue.address}` : ""}</p> : null}</li>;
              })}
            </ul>
          ) : (
            <p className="mt-5 text-[14px] leading-relaxed text-primary/55">No published fixture has been assigned to your school yet. The committee will notify you when the schedule is confirmed.</p>
          )}
        </section>
      </div>

      <div className="mt-4">
        <Link href="/portal/school/appeals" className="text-[13px] font-semibold text-primary/60 underline underline-offset-4 hover:text-red-ink">Need to query a registration, result, or fixture? Open an appeal.</Link>
      </div>


    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary/45">
        {label}
      </p>
      <p className="mt-2 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
