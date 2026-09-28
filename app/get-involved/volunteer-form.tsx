"use client";

import { useActionState } from "react";

import {
  FormError,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/form";

import { applyToVolunteer, type VolunteerState } from "./actions";

const EMPTY: VolunteerState = {};

/**
 * Public Change Maker application, Content Guide §4.14. No account is needed.
 */
export function VolunteerForm({ lgas }: { lgas: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(applyToVolunteer, EMPTY);

  if (state.notice) {
    return (
      <div className="rounded-[28px] bg-white p-8 sm:p-9">
        <h3 className="font-display text-xl font-bold">Thank you</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-primary/65">
          {state.notice}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-[28px] bg-white p-8 sm:p-9">
      <h3 className="font-display text-xl font-bold">Volunteer registration</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-primary/55">
        Change Makers steward the LGA qualifiers and the Grand Finale. Tell us
        where you live and how you would like to help. You do not need to create
        an account.
      </p>

      <div className="mt-6 space-y-5">
        <FormError message={state.error} />
        <Input
          label="Full name"
          name="full_name"
          required
          maxLength={120}
          autoComplete="name"
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
        <Input
          label="Phone number"
          name="phone"
          type="tel"
          maxLength={30}
          autoComplete="tel"
        />
        <Select
          label="Local government of residence"
          name="lga_id"
          required
          placeholder="Select your local government"
          options={lgas.map((l) => ({ value: l.id, label: l.name }))}
        />
        <Input
          label="How would you like to help?"
          name="role_sought"
          maxLength={120}
          placeholder="Stewarding, logistics, media"
        />
        <Input
          label="Photo for your volunteer design (optional)"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hint="A clear photo helps us prepare your volunteer design. JPG, PNG or WebP, up to 3 MB. It is kept private and seen only by the Organising Committee."
          className="file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
        />
        <Textarea
          label="Anything else we should know?"
          name="notes"
          rows={3}
          maxLength={1000}
        />
        <SubmitButton pending={pending}>Send my application</SubmitButton>
      </div>
    </form>
  );
}
