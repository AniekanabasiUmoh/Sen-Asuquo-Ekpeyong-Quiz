import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { VolunteerBriefing, VolunteerShift, VolunteerStatus } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Volunteering",
  robots: { index: false },
};

/**
 * Change Maker self-service dashboard, Sprint 3.4.
 *
 * The application itself is anonymous-friendly (see app/get-involved/actions.ts)
 * so applying never requires an account first. This page is what an applicant
 * who *does* have an account sees once they sign in: their status, and once
 * accepted, their shift and its briefing. It deliberately does not gate on any
 * role — signing up for the portal grants `school_admin` by default (the only
 * self-service route), which has nothing to do with whether someone applied to
 * volunteer, so this page is reached by having a linked `volunteers` row, not
 * by role.
 */
const STATUS_COPY: Record<
  VolunteerStatus,
  { label: string; tone: string; body: string }
> = {
  applied: {
    label: "Application received",
    tone: "bg-gold/25 text-gold-ink",
    body: "The Organising Committee has your application and will be in touch about the next steps.",
  },
  accepted: {
    label: "Confirmed",
    tone: "bg-grass/20 text-forest",
    body: "You are confirmed as a Change Maker. Your shift and briefing are below.",
  },
  declined: {
    label: "Not this time",
    tone: "bg-black/[0.06] text-primary/70",
    body: "The committee was not able to take up your application on this occasion.",
  },
  withdrawn: {
    label: "Withdrawn",
    tone: "bg-black/[0.06] text-primary/70",
    body: "This application has been withdrawn.",
  },
};

export default async function VolunteerDashboardPage() {
  const user = await requireUser("/portal/volunteer");
  const supabase = await createClient();

  const { data: volunteer } = await supabase
    .from("volunteers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (!volunteer) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          You have not applied to volunteer
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-primary/60">
          Change Makers power the championship on the ground and behind it, at
          the LGA qualifiers and the Grand Finale.
        </p>
        <Link
          href="/get-involved#changemaker"
          className="mt-8 inline-block rounded-full bg-gold px-7 py-3.5 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white"
        >
          Become a Change Maker
        </Link>
      </div>
    );
  }

  const status = STATUS_COPY[volunteer.status];

  // Joined in application code, not via an embedded select: this codebase's
  // Database type deliberately leaves Relationships empty and writes joins
  // explicitly (see the comment above `type Table` in lib/supabase/types.ts).
  const { data: assignmentRows } =
    volunteer.status === "accepted"
      ? await supabase
          .from("volunteer_shift_assignments")
          .select("shift_id, role")
          .eq("volunteer_id", volunteer.id)
      : { data: null };

  const shiftIds = (assignmentRows ?? []).map((a) => a.shift_id);
  const { data: shiftRows } = shiftIds.length
    ? await supabase
        .from("volunteer_shifts")
        .select("id, title, location, starts_at, ends_at, notes")
        .in("id", shiftIds)
    : { data: [] as VolunteerShift[] };
  const shiftById = new Map((shiftRows ?? []).map((s) => [s.id, s]));

  const assignments = (assignmentRows ?? [])
    .map((a) => ({ role: a.role, shift: shiftById.get(a.shift_id) ?? null }))
    .filter((a): a is { role: string | null; shift: VolunteerShift } => !!a.shift);

  // Briefings that apply: general ones (shift_id null) plus any tied to a
  // shift this volunteer is actually on. Two explicit queries rather than a
  // hand-built .or() filter string interpolating shiftIds — the ids are our
  // own UUIDs, not user input, so it wasn't unsafe, just needless string
  // building where a plain query does the same thing more plainly.
  const [{ data: generalBriefings }, { data: shiftBriefings }] = await Promise.all([
    supabase.from("volunteer_briefings").select("*").is("shift_id", null),
    shiftIds.length
      ? supabase.from("volunteer_briefings").select("*").in("shift_id", shiftIds)
      : Promise.resolve({ data: [] as VolunteerBriefing[] }),
  ]);
  const briefings = [...(generalBriefings ?? []), ...(shiftBriefings ?? [])];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
            Change Maker
          </p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            {volunteer.full_name}
          </h1>
        </div>
        <span className={`rounded-full px-4 py-2 text-[12px] font-bold ${status.tone}`}>
          {status.label}
        </span>
      </div>

      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        {status.body}
      </p>

      {volunteer.status === "accepted" ? (
        <>
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">Your shifts</h2>
            {!assignments?.length ? (
              <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">
                You are confirmed, but not yet placed on a shift. The committee
                will assign one closer to the date.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {assignments.map((a) => {
                  const shift = a.shift;
                  return (
                    <li key={shift.id} className="rounded-[24px] bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-lg font-bold">{shift.title}</h3>
                          {a.role ? (
                            <p className="mt-1 text-[13px] font-semibold text-primary/70">
                              {a.role}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 text-[13px] text-primary/55">
                        {shift.starts_at
                          ? new Date(shift.starts_at).toLocaleString("en-GB", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Time to be confirmed"}
                        {shift.location ? ` · ${shift.location}` : ""}
                      </p>
                      {shift.notes ? (
                        <p className="mt-3 border-t border-black/10 pt-3 text-[13px] leading-relaxed text-primary/55">
                          {shift.notes}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">Briefing</h2>
            {!briefings?.length ? (
              <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">
                Nothing published yet. Check back closer to your shift.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {briefings.map((b) => (
                  <li key={b.id} className="rounded-[24px] bg-white p-6">
                    <h3 className="font-display text-base font-bold">{b.title}</h3>
                    <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-primary/65">
                      {b.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
