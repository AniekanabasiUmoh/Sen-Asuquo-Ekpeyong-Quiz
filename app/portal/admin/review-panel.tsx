"use client";

import { useActionState, useState } from "react";

import { FormError, FormNotice, SubmitButton, Textarea } from "@/components/form";

import { approveSchool, rejectSchool, type AdminState } from "./actions";

const EMPTY: AdminState = {};

/**
 * Approve / send back / reject controls for one registration.
 *
 * Rejection and send-back both require a written reason, deliberately: the
 * school is shown it, and "rejected" with no explanation generates a phone call
 * the committee then has to field.
 */
export function ReviewPanel({
  schoolId,
  schoolName,
}: {
  schoolId: string;
  schoolName: string;
}) {
  const [approveState, approveAction, approvePending] = useActionState(
    approveSchool,
    EMPTY,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    rejectSchool,
    EMPTY,
  );
  const [showReason, setShowReason] = useState(false);

  return (
    <div className="mt-4 border-t border-black/10 pt-4">
      <FormError message={approveState.error ?? rejectState.error} />
      <FormNotice message={approveState.notice ?? rejectState.notice} />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <form action={approveAction}>
          <input type="hidden" name="school_id" value={schoolId} />
          <SubmitButton pending={approvePending} className="!px-5 !py-2.5">
            Approve
          </SubmitButton>
        </form>

        <button
          type="button"
          onClick={() => setShowReason((v) => !v)}
          aria-expanded={showReason}
          className="rounded-full border border-black/15 px-5 py-2.5 text-[12px] font-semibold transition hover:bg-[#faf6ee]"
        >
          {showReason ? "Cancel" : "Send back or reject"}
        </button>
      </div>

      {showReason ? (
        <form action={rejectAction} className="mt-4 space-y-4">
          <input type="hidden" name="school_id" value={schoolId} />
          <Textarea
            label={`Reason, shown to ${schoolName}`}
            name="reason"
            required
            rows={3}
            placeholder="For example: the coordinator's phone number is not reachable."
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              name="send_back"
              value="1"
              disabled={rejectPending}
              className="rounded-full bg-[#003090] px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#0d2270] disabled:opacity-55"
            >
              Send back for correction
            </button>
            <button
              type="submit"
              disabled={rejectPending}
              className="rounded-full border border-[#f44423]/40 px-5 py-2.5 text-[12px] font-bold text-[#c1300f] transition hover:bg-[#f44423]/5 disabled:opacity-55"
            >
              Reject
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
