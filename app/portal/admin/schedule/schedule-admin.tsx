"use client";

import { useActionState, useState } from "react";

import {
  FormError,
  FormNotice,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/form";
import type { Lga, Stage } from "@/lib/supabase/types";

import {
  createFixture,
  createVenue,
  rescheduleFixture,
  setFixturePublish,
  type ScheduleState,
} from "./actions";

const EMPTY: ScheduleState = {};

export type FixtureRow = {
  id: string;
  name: string;
  stage_id: string;
  qualifier_group: string | null;
  venue_id: string | null;
  scheduled_at: string | null;
  publish: string;
  status: string;
};

export type VenueRow = { id: string; name: string; lga_id: string | null };

export type ChangeRow = {
  id: string;
  fixture_id: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  reason: string | null;
  created_at: string;
};

function whenLabel(iso: string | null): string {
  if (!iso) return "Not scheduled";
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScheduleAdmin({
  fixtures,
  stages,
  venues,
  lgas,
  changes,
}: {
  fixtures: FixtureRow[];
  stages: Stage[];
  venues: VenueRow[];
  lgas: Lga[];
  changes: ChangeRow[];
}) {
  const [fxState, fxAction, fxPending] = useActionState(createFixture, EMPTY);
  const [venueState, venueAction, venuePending] = useActionState(createVenue, EMPTY);

  const stageName = new Map(stages.map((s) => [s.id, s.name]));
  const venueName = new Map(venues.map((v) => [v.id, v.name]));
  const changesByFixture = new Map<string, ChangeRow[]>();
  for (const ch of changes) {
    const list = changesByFixture.get(ch.fixture_id) ?? [];
    list.push(ch);
    changesByFixture.set(ch.fixture_id, list);
  }

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <section>
          <h2 className="font-display text-xl font-bold">
            Fixtures ({fixtures.length})
          </h2>
          {fixtures.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-[#003090]/45">
              No fixtures yet. Add one on the right.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {fixtures.map((f) => (
                <FixtureCard
                  key={f.id}
                  fixture={f}
                  stageName={stageName.get(f.stage_id) ?? "Unknown stage"}
                  venueName={f.venue_id ? venueName.get(f.venue_id) : null}
                  venues={venues}
                  changes={changesByFixture.get(f.id) ?? []}
                />
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <form action={fxAction} className="rounded-[28px] bg-white p-7">
            <h3 className="font-display text-lg font-bold">Add a fixture</h3>
            <div className="mt-5 space-y-5">
              <FormError message={fxState.error} />
              <FormNotice message={fxState.notice} />
              <Select
                label="Stage"
                name="stage_id"
                required
                placeholder="Select a stage"
                options={stages.map((s) => ({
                  value: s.id,
                  label: `${s.ordinal}. ${s.name}`,
                }))}
              />
              <Input
                label="Fixture name"
                name="name"
                required
                placeholder="Biase Qualifier, Round 1"
              />
              <Input
                label="Qualifying group"
                name="qualifier_group"
                placeholder="biase"
                hint="Leave blank for stages that are not LGA scoped."
              />
              <Select
                label="Venue"
                name="venue_id"
                placeholder="Not decided yet"
                options={venues.map((v) => ({ value: v.id, label: v.name }))}
              />
              <Input label="Date and time" name="scheduled_at" type="datetime-local" />
              <SubmitButton pending={fxPending}>Add fixture</SubmitButton>
            </div>
          </form>

          <form action={venueAction} className="rounded-[28px] bg-white p-7">
            <h3 className="font-display text-lg font-bold">Add a venue</h3>
            <div className="mt-5 space-y-5">
              <FormError message={venueState.error} />
              <FormNotice message={venueState.notice} />
              <Input label="Venue name" name="name" required />
              <Select
                label="Local Government Area"
                name="lga_id"
                placeholder="Not LGA specific"
                options={lgas.map((l) => ({ value: l.id, label: l.name }))}
              />
              <Input label="Address" name="address" />
              <Input label="Capacity" name="capacity" type="number" min={0} />
              <SubmitButton pending={venuePending}>Add venue</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FixtureCard({
  fixture,
  stageName,
  venueName,
  venues,
  changes,
}: {
  fixture: FixtureRow;
  stageName: string;
  venueName: string | null | undefined;
  venues: VenueRow[];
  changes: ChangeRow[];
}) {
  const [pubState, pubAction, pubPending] = useActionState(setFixturePublish, EMPTY);
  const [reState, reAction, rePending] = useActionState(rescheduleFixture, EMPTY);
  const [open, setOpen] = useState(false);

  const published = fixture.publish === "published";

  return (
    <li className="rounded-[24px] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#003090]/45">
            {stageName}
          </p>
          <h3 className="mt-1.5 font-display text-lg font-bold">{fixture.name}</h3>
          <p className="mt-1 text-[13px] text-[#003090]/55">
            {whenLabel(fixture.scheduled_at)}
            {venueName ? ` · ${venueName}` : ""}
          </p>
        </div>
        <span
          className={
            "rounded-full px-3.5 py-1.5 text-[11px] font-bold " +
            (published
              ? "bg-[#2dc653]/20 text-[#155d27]"
              : "bg-black/[0.06] text-[#003090]/60")
          }
        >
          {published ? "Published" : "Draft"}
        </span>
      </div>

      <FormError message={pubState.error ?? reState.error} />
      <FormNotice message={pubState.notice ?? reState.notice} />

      {changes.length > 0 ? (
        <div className="mt-4 rounded-2xl bg-[#f0a800]/10 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7a5300]">
            Changed {changes.length} time{changes.length > 1 ? "s" : ""}
          </p>
          <ul className="mt-1.5 space-y-1">
            {changes.slice(0, 3).map((ch) => (
              <li key={ch.id} className="text-[12px] leading-relaxed text-[#7a5300]">
                {ch.field === "scheduled_at" ? "Time" : "Venue"}:{" "}
                {ch.old_value ?? "not set"} to {ch.new_value ?? "not set"}
                {ch.reason ? ` (${ch.reason})` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/10 pt-4">
        <form action={pubAction}>
          <input type="hidden" name="fixture_id" value={fixture.id} />
          <input type="hidden" name="publish" value={published ? "0" : "1"} />
          <button
            type="submit"
            disabled={pubPending}
            className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-[#faf6ee] disabled:opacity-55"
          >
            {published ? "Unpublish" : "Publish"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-[#faf6ee]"
        >
          {open ? "Cancel" : "Reschedule"}
        </button>
      </div>

      {open ? (
        <form action={reAction} className="mt-4 space-y-4">
          <input type="hidden" name="fixture_id" value={fixture.id} />
          <Input
            label="New date and time"
            name="scheduled_at"
            type="datetime-local"
            defaultValue={
              fixture.scheduled_at
                ? new Date(fixture.scheduled_at).toISOString().slice(0, 16)
                : ""
            }
          />
          <Select
            label="Venue"
            name="venue_id"
            defaultValue={fixture.venue_id ?? ""}
            placeholder="Not decided yet"
            options={venues.map((v) => ({ value: v.id, label: v.name }))}
          />
          <Textarea
            label="Reason for the change"
            name="reason"
            required
            rows={2}
            hint="Shown to schools on the public schedule."
          />
          <SubmitButton pending={rePending} className="!px-5 !py-2.5">
            Save the change
          </SubmitButton>
        </form>
      ) : null}
    </li>
  );
}
