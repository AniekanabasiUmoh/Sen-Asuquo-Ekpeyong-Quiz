"use client";

import { useActionState } from "react";

import { FormError, FormNotice, Input, SubmitButton, Textarea } from "@/components/form";
import type { VolunteerBriefing, VolunteerMessage, VolunteerShift } from "@/lib/supabase/types";

import { createShift, publishBriefing, publishVolunteerMessage, setVolunteerMessageStatus, type VolunteerAdminState } from "./actions";

const EMPTY: VolunteerAdminState = {};

export function ShiftsAndBriefings({
  shifts,
  briefings,
  messages,
}: {
  shifts: VolunteerShift[];
  briefings: VolunteerBriefing[];
  messages: VolunteerMessage[];
}) {
  const [shiftState, shiftAction, shiftPending] = useActionState(createShift, EMPTY);
  const [briefState, briefAction, briefPending] = useActionState(publishBriefing, EMPTY);
  const [messageState, messageAction, messagePending] = useActionState(publishVolunteerMessage, EMPTY);
  const [messageStatusState, messageStatusAction, messageStatusPending] = useActionState(setVolunteerMessageStatus, EMPTY);

  return (
    <>
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
    <section className="mt-10 border-t border-black/10 pt-10">
      <h2 className="font-display text-xl font-bold">Communication centre ({messages.length})</h2>
      <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-primary/55">
        Publish an in-portal message to every accepted Change Maker or target one shift. This does not claim SMS or email delivery.
      </p>
      <FormError message={messageState.error ?? messageStatusState.error} />
      <FormNotice message={messageState.notice ?? messageStatusState.notice} />
      {messages.length ? <ul className="mt-5 space-y-3">{messages.map((message) => <li key={message.id} className="rounded-[24px] bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-display text-base font-bold">{message.title}</h3><p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-primary/60">{message.body}</p><p className="mt-2 text-[11px] text-primary/45">{message.shift_id ? "Targeted shift" : "All accepted Change Makers"}</p></div><span className="rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/60">{message.publish}</span></div><form action={messageStatusAction} className="mt-4 flex flex-wrap items-end gap-3"><input type="hidden" name="message_id" value={message.id} /><label className="text-[12px] font-semibold text-primary">Status<select name="publish" defaultValue={message.publish} className="mt-1.5 block rounded-xl border border-black/15 bg-white px-3 py-2 text-[13px]"><option value="draft">draft</option><option value="review">review</option><option value="published">published</option><option value="archived">archived</option></select></label><SubmitButton pending={messageStatusPending}>Save status</SubmitButton></form></li>)}</ul> : <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">No messages yet.</p>}
      <form action={messageAction} className="mt-6 rounded-[28px] bg-white p-7"><h3 className="font-display text-lg font-bold">Publish a message</h3><div className="mt-5 space-y-5"><Input label="Title" name="title" required placeholder="Arrival time has changed" /><Textarea label="Message" name="body" required rows={4} hint="Up to 5,000 characters. Keep student personal data out of broadcasts." /><label className="block text-[13px] font-semibold text-primary">Audience<select name="shift_id" defaultValue="" className="mt-2 block w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]"><option value="">Every accepted Change Maker</option>{shifts.map((shift) => <option key={shift.id} value={shift.id}>{shift.title} only</option>)}</select></label><SubmitButton pending={messagePending}>Publish message</SubmitButton></div></form>
    </section>
  </>
  );
}
