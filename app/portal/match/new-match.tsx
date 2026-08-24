"use client";

import { useActionState } from "react";

import { FormError, FormNotice, Input, Select, SubmitButton } from "@/components/form";

import { createMatch, type MatchState } from "./actions";

const EMPTY: MatchState = {};

export function NewMatchForm({
  fixtures,
  schools,
}: {
  fixtures: { id: string; name: string }[];
  schools: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createMatch, EMPTY);

  return (
    <form action={action} className="rounded-[28px] bg-white p-7">
      <h2 className="font-display text-lg font-bold">New match</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#003090]/55">
        The four Grand Finale rounds are created with it.
      </p>

      <div className="mt-5 space-y-5">
        <FormError message={state.error} />
        <FormNotice message={state.notice} />

        <Select
          label="Fixture"
          name="fixture_id"
          required
          placeholder="Select a fixture"
          options={fixtures.map((f) => ({ value: f.id, label: f.name }))}
        />
        <Input label="Match name" name="name" required placeholder="Grand Finale" />

        <fieldset>
          <legend className="text-[13px] font-semibold text-[#003090]">
            Competing schools
          </legend>
          <p className="mt-1 text-[12px] text-[#003090]/50">
            Approved schools only.
          </p>
          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-black/10 p-4">
            {schools.length === 0 ? (
              <p className="text-[12px] text-[#003090]/45">
                No approved schools yet.
              </p>
            ) : (
              schools.map((s) => (
                <label key={s.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="school_ids"
                    value={s.id}
                    className="h-4 w-4 rounded border-black/25 accent-[#003090]"
                  />
                  <span className="text-[13px]">{s.name}</span>
                </label>
              ))
            )}
          </div>
        </fieldset>

        <SubmitButton pending={pending}>Create match</SubmitButton>
      </div>
    </form>
  );
}
