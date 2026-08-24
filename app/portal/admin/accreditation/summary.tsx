"use client";

import { useActionState } from "react";

import { FormError, FormNotice, SubmitButton } from "@/components/form";
import type { Accreditation, AccreditationHolder } from "@/lib/supabase/types";

import { issueMissingAccreditations, revokeAccreditation, type AccreditationState } from "./actions";

const EMPTY: AccreditationState = {};

const HOLDER_LABEL: Record<AccreditationHolder, string> = {
  student: "Student",
  coach: "Coach",
  volunteer: "Change Maker",
  judge: "Judge",
};

export function AccreditationSummary({
  accreditations,
  names,
}: {
  accreditations: Accreditation[];
  names: Record<string, string>;
}) {
  const [issueState, issueAction, issuePending] = useActionState(
    issueMissingAccreditations,
    EMPTY,
  );
  const [revokeState, revokeAction] = useActionState(revokeAccreditation, EMPTY);

  const total = accreditations.length;
  const checkedIn = accreditations.filter((a) => a.checked_in_at && !a.revoked_at).length;
  const byType = accreditations.reduce<Record<string, number>>((acc, a) => {
    acc[a.holder_type] = (acc[a.holder_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Accreditations issued" value={total} />
        <Stat label="Checked in" value={checkedIn} />
        <Stat label="Not yet arrived" value={total - checkedIn} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(byType).map(([type, count]) => (
          <span
            key={type}
            className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-primary/70"
          >
            {HOLDER_LABEL[type as AccreditationHolder] ?? type}: {count}
          </span>
        ))}
      </div>

      <form action={issueAction} className="mt-6">
        <FormError message={issueState.error} />
        <FormNotice message={issueState.notice} />
        <SubmitButton pending={issuePending} className="mt-3 !px-6 !py-3">
          Issue accreditation for everyone newly eligible
        </SubmitButton>
        <p className="mt-2 text-[12px] text-primary/45">
          Safe to run any time: existing accreditations and check-in status are
          never touched, only new ones are added.
        </p>
      </form>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Recent activity</h2>
        <FormError message={revokeState.error} />
        <FormNotice message={revokeState.notice} />
        {accreditations.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">
            Nothing issued yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-2">
            {accreditations
              .slice()
              .sort((a, b) => {
                const at = a.checked_in_at ?? "";
                const bt = b.checked_in_at ?? "";
                return bt.localeCompare(at);
              })
              .slice(0, 30)
              .map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">
                      {names[`${a.holder_type}:${a.holder_id}`] ?? "Unknown"}
                    </p>
                    <p className="text-[11px] text-primary/45">
                      {HOLDER_LABEL[a.holder_type]}
                      {a.checked_in_at
                        ? ` · checked in ${new Date(a.checked_in_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
                        : " · not yet arrived"}
                      {a.revoked_at ? " · revoked" : ""}
                    </p>
                  </div>
                  {!a.revoked_at ? (
                    <form action={revokeAction}>
                      <input type="hidden" name="accreditation_id" value={a.id} />
                      <button
                        type="submit"
                        className="flex-none text-[11px] font-semibold text-primary/40 hover:text-red-ink"
                      >
                        Revoke
                      </button>
                    </form>
                  ) : null}
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] bg-white p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary/45">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}
