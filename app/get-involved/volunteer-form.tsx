"use client";

import { useActionState } from "react";

import {
  FormError,
  FormNotice,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/form";

import { applyToVolunteer, type VolunteerState } from "./actions";

const EMPTY: VolunteerState = {};

/**
 * Change Maker application, Content Guide §4.14.
 *
 * "Change Maker" rather than "volunteer" in the copy: the client renamed it,
 * and the database column keeps the neutral name.
 */
export function VolunteerForm({ lgas }: { lgas: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(applyToVolunteer, EMPTY);

  if (state.notice) {
    return (
      <div className="rounded-[28px] bg-white p-8 sm:p-9">
        <h3 className="font-display text-xl font-bold">Thank you</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#003090]/65">
          {state.notice}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-[28px] bg-white p-8 sm:p-9">
      <h3 className="font-display text-xl font-bold">Volunteer with us</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[#003090]/55">
        Change Makers steward the LGA qualifiers and the Grand Finale. Tell us
        where you are and how you would like to help.
      </p>

      <div className="mt-6 space-y-5">
        <FormError message={state.error} />
        <Input label="Full name" name="full_name" required autoComplete="name" />
        <Input
          label="Email address"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Input label="Phone number" name="phone" type="tel" autoComplete="tel" />
        <Select
          label="Local Government Area"
          name="lga_id"
          placeholder="Wherever I am needed"
          options={lgas.map((l) => ({ value: l.id, label: l.name }))}
        />
        <Input
          label="How would you like to help?"
          name="role_sought"
          placeholder="Stewarding, logistics, media"
        />
        <Textarea
          label="Anything else we should know?"
          name="notes"
          rows={3}
        />
        <SubmitButton pending={pending}>Send my application</SubmitButton>
      </div>
    </form>
  );
}
