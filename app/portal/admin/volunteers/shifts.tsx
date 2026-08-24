"use client";

import { useActionState } from "react";

import { FormError, FormNotice, Input, SubmitButton, Textarea } from "@/components/form";
import type { VolunteerBriefing, VolunteerShift } from "@/lib/supabase/types";

import { createShift, publishBriefing, type VolunteerAdminState } from "./actions";

const EMPTY: VolunteerAdminState = {};

export function ShiftsAndBriefings({
  shifts,
  briefings,
}: {
  shifts: VolunteerShift[];
  briefings: VolunteerBriefing[];
}) {
  const [shiftState, shiftAction, shiftPending] = useActionState(createShift, EMPTY);
  const [briefState, briefAction, briefPending] = useActionState(publishBriefing, EMPTY);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <section>
        <h2 className="font-display text-xl font-bold">Shifts ({shifts.length})</h2>
        {shifts.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">
            No shifts yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {shifts.map((s) => (
              <li key={s.id} className="rounded-[24px] bg-white p-6">
                <h3 className="font-display text-base font-bold">{s.title}</h3>
                <p className="mt-1 text-[13px] text-primary/55">
                  {s.starts_at
                    ? new Date(s.starts_at).toLocaleString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Time to be confirmed"}
                  {s.location ? ` · ${s.location}` : ""}
                </p>
                {s.notes ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-primary/50">{s.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <form action={shiftAction} className="mt-6 rounded-[28px] bg-white p-7">
          <h3 className="font-display text-lg font-bold">Add a shift</h3>
          <div className="mt-5 space-y-5">
            <FormError message={shiftState.error} />
            <FormNotice message={shiftState.notice} />
            <Input label="Title" name="title" required placeholder="Grand Finale Check-in" />
            <Input label="Location" name="location" placeholder="Cultural Centre, Calabar" />
            <Input label="Starts at" name="starts_at" type="datetime-local" />
            <Textarea label="Notes for Change Makers on this shift" name="notes" rows={3} />
            <SubmitButton pending={shiftPending}>Add shift</SubmitButton>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">Briefings ({briefings.length})</h2>
        {briefings.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">
            Nothing published yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {briefings.map((b) => (
              <li key={b.id} className="rounded-[24px] bg-white p-6">
                <h3 className="font-display text-base font-bold">{b.title}</h3>
                <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-primary/60">
                  {b.body}
                </p>
              </li>
            ))}
          </ul>
        )}

        <form action={briefAction} className="mt-6 rounded-[28px] bg-white p-7">
          <h3 className="font-display text-lg font-bold">Publish a briefing</h3>
          <p className="mt-1.5 text-[12px] text-primary/50">
            Visible to every accepted Change Maker as soon as it is published.
          </p>
          <div className="mt-5 space-y-5">
            <FormError message={briefState.error} />
            <FormNotice message={briefState.notice} />
            <Input label="Title" name="title" required placeholder="What to bring" />
            <label className="block text-[13px] font-semibold text-primary">
              Applies to
              <select
                name="shift_id"
                className="mt-2 block w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-primary"
              >
                <option value="">Every Change Maker</option>
                {shifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} only
                  </option>
                ))}
              </select>
            </label>
            <Textarea label="Content" name="body" required rows={4} />
            <SubmitButton pending={briefPending}>Publish</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
