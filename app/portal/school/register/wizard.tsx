"use client";

import { useActionState, useState } from "react";

import {
  Checkbox,
  FormError,
  FormNotice,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/form";
import type { Lga, School } from "@/lib/supabase/types";

import { saveStep, submitRegistration, type WizardState } from "./actions";

const EMPTY: WizardState = {};

const STEPS = [
  "School details",
  "LGA and streams",
  "Contact person",
  "Review and submit",
] as const;

export function RegistrationWizard({
  school,
  lgas,
  readOnly = false,
}: {
  school: School | null;
  lgas: Lga[];
  readOnly?: boolean;
}) {
  // Resume where the school left off rather than always at step one.
  const initialStep = !school
    ? 0
    : !school.contact_name
      ? 2
      : 3;
  const [step, setStep] = useState(initialStep);
  const [saveState, saveAction, savePending] = useActionState(saveStep, EMPTY);
  const [submitState, submitAction, submitPending] = useActionState(
    submitRegistration,
    EMPTY,
  );

  const locked =
    readOnly || (!!school && !["draft", "changes_requested"].includes(school.status));

  if (locked) {
    return <LockedNotice school={school!} />;
  }

  return (
    <div>
      <StepBar current={step} onSelect={setStep} />

      <div className="mt-8 rounded-[28px] bg-white p-7 sm:p-9">
        {step === 3 ? (
          <form action={submitAction} className="space-y-6">
            <FormError message={submitState.error} />
            <FormNotice message={submitState.notice} />
            <Review school={school} lgas={lgas} />
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:bg-cream"
              >
                Back
              </button>
              <SubmitButton pending={submitPending}>
                Submit for verification
              </SubmitButton>
            </div>
          </form>
        ) : (
          <form action={saveAction} className="space-y-6">
            <input type="hidden" name="step" value={step + 1} />
            <FormError message={saveState.error} />
            <FormNotice message={saveState.notice} />

            {step === 0 ? <StepDetails school={school} lgas={lgas} /> : null}
            {step === 1 ? <StepStreams school={school} /> : null}
            {step === 2 ? <StepContact school={school} /> : null}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:bg-cream"
                >
                  Back
                </button>
              ) : null}
              <SubmitButton pending={savePending}>Save and continue</SubmitButton>
              {saveState.ok ? (
                <button
                  type="button"
                  onClick={() => setStep(Math.min(step + 1, 3))}
                  className="text-[13px] font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Next step
                </button>
              ) : null}
            </div>
          </form>
        )}
      </div>

      <p className="mt-5 text-[13px] text-primary/50">
        Your answers are saved as you go. You can close this page and come back
        to it at any time before submitting.
      </p>
    </div>
  );
}

function StepBar({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (n: number) => void;
}) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Registration steps">
      {STEPS.map((label, i) => {
        const state =
          i === current ? "current" : i < current ? "done" : "upcoming";
        return (
          <li key={label}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={state === "current" ? "step" : undefined}
              className={
                "rounded-full px-4 py-2 text-[12px] font-bold transition " +
                (state === "current"
                  ? "bg-primary text-white"
                  : state === "done"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "border border-black/10 text-primary/45 hover:bg-black/[0.03]")
              }
            >
              <span className="font-mono tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="ml-2">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StepDetails({ school, lgas }: { school: School | null; lgas: Lga[] }) {
  return (
    <div className="space-y-5">
      <Input
        label="School name"
        name="name"
        required
        defaultValue={school?.name ?? ""}
        placeholder="Government Secondary School, Calabar"
      />
      <Select
        label="Local Government Area"
        name="lga_id"
        required
        defaultValue={school?.lga_id ?? ""}
        placeholder="Select an LGA"
        options={lgas.map((l) => ({ value: l.id, label: l.name }))}
        hint="The LGA the school is physically located in."
      />
      <Input
        label="Principal's name"
        name="principal_name"
        defaultValue={school?.principal_name ?? ""}
      />
      <Textarea
        label="School address"
        name="address"
        defaultValue={school?.address ?? ""}
        rows={3}
      />
      <Checkbox
        label="This is a private school"
        name="is_private"
        defaultChecked={school?.is_private ?? false}
        hint="The championship is open to both public and private secondary schools."
      />
    </div>
  );
}

function StepStreams({ school }: { school: School | null }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-bold">Streams entered</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-primary/55">
          School-level screening runs three examinations on the same day. Select
          the streams your school will enter.
        </p>
      </div>
      <div className="space-y-4">
        <Checkbox label="Science" name="stream_science" defaultChecked />
        <Checkbox label="Art" name="stream_art" defaultChecked />
        <Checkbox label="Commercial" name="stream_commercial" defaultChecked />
      </div>
      <Textarea
        label="School address"
        name="address"
        defaultValue={school?.address ?? ""}
        rows={3}
        hint="Confirm the address examinations should be arranged at."
      />
    </div>
  );
}

function StepContact({ school }: { school: School | null }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-lg font-bold">Coordinating teacher</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-primary/55">
          The member of staff the committee will contact about schedules,
          screening and results.
        </p>
      </div>
      <Input
        label="Full name"
        name="contact_name"
        required
        defaultValue={school?.contact_name ?? ""}
      />
      <Input
        label="Email address"
        name="contact_email"
        type="email"
        required
        defaultValue={school?.contact_email ?? ""}
      />
      <Input
        label="Phone number"
        name="contact_phone"
        type="tel"
        required
        defaultValue={school?.contact_phone ?? ""}
        placeholder="0800 000 0000"
      />
    </div>
  );
}

function Review({ school, lgas }: { school: School | null; lgas: Lga[] }) {
  if (!school) {
    return (
      <p className="text-[14px] text-primary/60">
        Nothing has been saved yet. Start at step one.
      </p>
    );
  }
  const lga = lgas.find((l) => l.id === school.lga_id);
  const rows: Array<[string, string]> = [
    ["School", school.name || "Not given"],
    ["Local Government Area", lga?.name ?? "Not given"],
    ["School type", school.is_private ? "Private" : "Public"],
    ["Principal", school.principal_name || "Not given"],
    ["Address", school.address || "Not given"],
    ["Coordinator", school.contact_name || "Not given"],
    ["Coordinator email", school.contact_email || "Not given"],
    ["Coordinator phone", school.contact_phone || "Not given"],
  ];

  return (
    <div>
      <h3 className="font-display text-lg font-bold">Check these details</h3>
      <dl className="mt-5">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 border-t border-black/10 py-3"
          >
            <dt className="text-[13px] font-semibold text-primary/55">{k}</dt>
            <dd className="text-[14px]">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[13px] leading-relaxed text-primary/55">
        Once submitted, these details are locked while the committee reviews
        them. Your registration number is issued when the registration is
        approved.
      </p>
    </div>
  );
}

function LockedNotice({ school }: { school: School }) {
  const map: Record<string, { title: string; body: string }> = {
    submitted: {
      title: "Registration submitted",
      body: "The Organising Committee has your registration and will review it shortly. You will be notified by email.",
    },
    under_review: {
      title: "Under review",
      body: "The committee is reviewing your registration now.",
    },
    approved: {
      title: "Registration approved",
      body: "Your school is registered for the championship.",
    },
    rejected: {
      title: "Registration not accepted",
      body: school.rejection_reason
        ? `Reason given: ${school.rejection_reason}`
        : "Contact the committee for details.",
    },
    withdrawn: {
      title: "Registration withdrawn",
      body: "This registration has been withdrawn.",
    },
  };
  const m = map[school.status] ?? map.submitted;

  return (
    <div className="rounded-[28px] bg-primary p-8 text-white sm:p-9">
      <h2 className="font-display text-2xl font-extrabold">{m.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-white/70">{m.body}</p>
      {school.registration_no ? (
        <p className="mt-6 border-t border-white/15 pt-6">
          <span className="text-[11px] uppercase tracking-[0.16em] text-white/45">
            Registration number
          </span>
          <br />
          <span className="font-mono text-xl font-bold tabular-nums">
            {school.registration_no}
          </span>
        </p>
      ) : null}
    </div>
  );
}
