"use client";

import { useActionState, useState } from "react";

import { FormError, FormNotice, Input, Select, Textarea } from "@/components/form";
import type { Student } from "@/lib/supabase/types";

import {
  adjustScore,
  publishResults,
  recordEvent,
  recordSubstitution,
  setMatchStatus,
  type MatchState,
} from "../actions";

const EMPTY: MatchState = {};

export type Standing = {
  school_id: string;
  score: number;
  striker_correct: number;
  assist_correct: number;
  var_referrals: number;
  substitutions: number;
};

export type SchoolLite = { id: string; name: string };

export type EventRow = {
  id: string;
  school_id: string;
  event_type: string;
  points: number;
  question_no: number | null;
  note: string | null;
  created_at: string;
};

const EVENT_LABEL: Record<string, string> = {
  striker_correct: "Striker correct",
  striker_wrong: "Striker wrong",
  striker_pass: "Striker passed",
  assist_correct: "Assist correct",
  assist_wrong: "Assist wrong",
  substitution: "Substitution",
  var_referral: "VAR",
  penalty: "Penalty",
  adjustment: "Adjustment",
};

export function MatchConsole({
  matchId,
  status,
  publishState,
  schools,
  students,
  standings,
  events,
  isAdmin,
}: {
  matchId: string;
  matchName: string;
  status: string;
  publishState: string;
  schools: SchoolLite[];
  students: Record<string, Student[]>;
  standings: Standing[];
  events: EventRow[];
  isAdmin: boolean;
}) {
  const [statusState, statusAction] = useActionState(setMatchStatus, EMPTY);
  const [pubState, pubAction, pubPending] = useActionState(publishResults, EMPTY);

  const byId = new Map(schools.map((s) => [s.id, s.name]));
  const scoreOf = new Map(standings.map((s) => [s.school_id, s]));
  const ranked = [...schools].sort(
    (a, b) => (scoreOf.get(b.id)?.score ?? 0) - (scoreOf.get(a.id)?.score ?? 0),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {(["pending", "live", "paused", "completed"] as const).map((s) => (
          <form key={s} action={statusAction}>
            <input type="hidden" name="match_id" value={matchId} />
            <input type="hidden" name="status" value={s} />
            <button
              type="submit"
              aria-pressed={status === s}
              className={
                "rounded-full px-4 py-2 text-[12px] font-bold transition " +
                (status === s
                  ? "bg-primary text-white"
                  : "border border-black/15 hover:bg-cream")
              }
            >
              {s === "live" ? "Go live" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          </form>
        ))}
        {isAdmin && publishState !== "published" ? (
          <form action={pubAction} className="ml-auto">
            <input type="hidden" name="match_id" value={matchId} />
            <button
              type="submit"
              disabled={pubPending}
              className="rounded-full bg-gold px-6 py-2.5 text-[12px] font-bold text-primary transition hover:bg-primary hover:text-white disabled:opacity-55"
            >
              Publish results
            </button>
          </form>
        ) : null}
        {publishState === "published" ? (
          <span className="ml-auto rounded-full bg-grass/20 px-4 py-2 text-[12px] font-bold text-forest">
            Results published
          </span>
        ) : null}
      </div>

      <FormError message={statusState.error ?? pubState.error} />
      <FormNotice message={statusState.notice ?? pubState.notice} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div>
          <h2 className="font-display text-xl font-bold">Standings</h2>
          <ul className="mt-5 space-y-4">
            {ranked.map((school, i) => (
              <SchoolPanel
                key={school.id}
                matchId={matchId}
                school={school}
                position={i + 1}
                standing={scoreOf.get(school.id)}
                students={students[school.id] ?? []}
                isAdmin={isAdmin}
              />
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-lg font-bold">Match log</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-primary/50">
            Append only. A mistake is corrected with an adjustment, so both stay
            visible.
          </p>
          <ol className="mt-4 max-h-[32rem] space-y-2 overflow-y-auto pr-1">
            {events.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-black/15 px-4 py-5 text-center text-[12px] text-primary/45">
                Nothing recorded yet.
              </li>
            ) : (
              events.map((e) => (
                <li key={e.id} className="rounded-2xl bg-white px-4 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] font-semibold">
                      {EVENT_LABEL[e.event_type] ?? e.event_type}
                    </span>
                    {e.points !== 0 ? (
                      <span className="font-mono text-[12px] font-bold tabular-nums text-forest">
                        {e.points > 0 ? "+" : ""}
                        {e.points}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-primary/50">
                    {byId.get(e.school_id) ?? "Unknown"}
                    {e.question_no ? ` · Q${e.question_no}` : ""}
                  </p>
                  {e.note ? (
                    <p className="mt-1 text-[11px] italic text-primary/45">{e.note}</p>
                  ) : null}
                </li>
              ))
            )}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function SchoolPanel({
  matchId,
  school,
  position,
  standing,
  students,
  isAdmin,
}: {
  matchId: string;
  school: SchoolLite;
  position: number;
  standing?: Standing;
  students: Student[];
  isAdmin: boolean;
}) {
  const [evState, evAction, evPending] = useActionState(recordEvent, EMPTY);
  const [subState, subAction] = useActionState(recordSubstitution, EMPTY);
  const [adjState, adjAction] = useActionState(adjustScore, EMPTY);
  const [panel, setPanel] = useState<"none" | "sub" | "adj">("none");

  const strikers = students.filter((s) => s.is_striker);
  const assists = students.filter((s) => !s.is_striker);

  return (
    <li className="rounded-[24px] bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[13px] tabular-nums text-primary/30">
            {String(position).padStart(2, "0")}
          </span>
          <h3 className="font-display text-lg font-bold">{school.name}</h3>
        </div>
        <p className="font-display text-3xl font-extrabold tabular-nums">
          {(standing?.score ?? 0).toFixed(1)}
        </p>
      </div>

      <p className="mt-1 text-[12px] text-primary/50">
        {standing?.striker_correct ?? 0} striker · {standing?.assist_correct ?? 0}{" "}
        assist · {standing?.var_referrals ?? 0} VAR ·{" "}
        {standing?.substitutions ?? 0} sub
      </p>

      <FormError message={evState.error ?? subState.error ?? adjState.error} />
      <FormNotice message={evState.notice ?? subState.notice ?? adjState.notice} />

      <form action={evAction} className="mt-4 border-t border-black/10 pt-4">
        <input type="hidden" name="match_id" value={matchId} />
        <input type="hidden" name="school_id" value={school.id} />
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-[11px] font-semibold text-primary/55">
            Student
            <select
              name="student_id"
              className="mt-1 block rounded-full border border-black/15 bg-white px-3 py-2 text-[12px] outline-none focus:border-primary"
            >
              <option value="">Not specified</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.is_striker ? "Striker" : "Assist"})
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-semibold text-primary/55">
            Question
            <input
              type="number"
              name="question_no"
              min={1}
              max={15}
              className="mt-1 block w-20 rounded-full border border-black/15 bg-white px-3 py-2 text-[12px] outline-none focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Score name="striker_correct" label="Striker +1" pending={evPending} tone="good" />
          <Score name="assist_correct" label="Assist +0.5" pending={evPending} tone="good" />
          <Score name="striker_wrong" label="Wrong" pending={evPending} />
          <Score name="var_referral" label="VAR (0)" pending={evPending} />
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-black/10 pt-4">
        <button
          type="button"
          onClick={() => setPanel(panel === "sub" ? "none" : "sub")}
          className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream"
        >
          Substitution
        </button>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setPanel(panel === "adj" ? "none" : "adj")}
            className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream"
          >
            Adjust score
          </button>
        ) : null}
      </div>

      {panel === "sub" ? (
        <form action={subAction} className="mt-4 space-y-4">
          <input type="hidden" name="match_id" value={matchId} />
          <input type="hidden" name="school_id" value={school.id} />
          <Select
            label="Striker coming off"
            name="student_out"
            required
            placeholder="Select"
            options={strikers.map((s) => ({ value: s.id, label: s.full_name }))}
          />
          <Select
            label="Assist coming on"
            name="student_in"
            required
            placeholder="Select"
            options={assists.map((s) => ({ value: s.id, label: s.full_name }))}
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-navy-deep"
          >
            Record substitution
          </button>
        </form>
      ) : null}

      {panel === "adj" ? (
        <form action={adjAction} className="mt-4 space-y-4">
          <input type="hidden" name="match_id" value={matchId} />
          <input type="hidden" name="school_id" value={school.id} />
          <Input
            label="Points"
            name="points"
            type="number"
            step="0.5"
            required
            hint="Negative to deduct."
          />
          <Textarea label="Reason" name="reason" required rows={2} />
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-navy-deep"
          >
            Record adjustment
          </button>
        </form>
      ) : null}
    </li>
  );
}

function Score({
  name,
  label,
  pending,
  tone,
}: {
  name: string;
  label: string;
  pending: boolean;
  tone?: "good";
}) {
  return (
    <button
      type="submit"
      name="event_type"
      value={name}
      disabled={pending}
      className={
        "rounded-full px-4 py-2.5 text-[12px] font-bold transition disabled:opacity-55 " +
        (tone === "good"
          ? "bg-primary text-white hover:bg-navy-deep"
          : "border border-black/15 hover:bg-cream")
      }
    >
      {label}
    </button>
  );
}
