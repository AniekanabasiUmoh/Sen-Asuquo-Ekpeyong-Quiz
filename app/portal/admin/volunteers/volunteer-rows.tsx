"use client";

import { useActionState } from "react";

import { FormError, FormNotice } from "@/components/form";
import type { Volunteer, VolunteerShift, VolunteerStatus } from "@/lib/supabase/types";

import { assignToShift, setVolunteerStatus, type VolunteerAdminState } from "./actions";

const EMPTY: VolunteerAdminState = {};

const TONE: Record<VolunteerStatus, string> = {
  applied: "bg-[#f0a800]/25 text-[#7a5300]",
  accepted: "bg-[#2dc653]/20 text-[#155d27]",
  declined: "bg-black/[0.06] text-[#003090]/60",
  withdrawn: "bg-black/[0.06] text-[#003090]/60",
};

export function VolunteerRows({
  volunteers,
  lgaNames,
  shifts,
}: {
  volunteers: Volunteer[];
  lgaNames: Record<string, string>;
  shifts: VolunteerShift[];
}) {
  const [state, action] = useActionState(setVolunteerStatus, EMPTY);
  const [assignState, assignAction] = useActionState(assignToShift, EMPTY);

  if (volunteers.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-[#003090]/45">
        No applications yet.
      </p>
    );
  }

  return (
    <div>
      <FormError message={state.error ?? assignState.error} />
      <FormNotice message={state.notice ?? assignState.notice} />

      <ul className="mt-5 space-y-3">
        {volunteers.map((v) => (
          <li key={v.id} className="rounded-[24px] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold">{v.full_name}</h3>
                <p className="mt-0.5 text-[13px] text-[#003090]/55">{v.email}</p>
                <p className="mt-0.5 text-[12px] text-[#003090]/45">
                  {v.lga_id ? lgaNames[v.lga_id] ?? "Unknown LGA" : "Anywhere"}
                  {v.phone ? ` · ${v.phone}` : ""}
                </p>
                {v.role_sought ? (
                  <p className="mt-2 text-[13px] text-[#003090]/70">{v.role_sought}</p>
                ) : null}
                {v.notes ? (
                  <p className="mt-1 text-[13px] italic text-[#003090]/50">{v.notes}</p>
                ) : null}
              </div>
              <span className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold ${TONE[v.status]}`}>
                {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
              </span>
            </div>

            {v.status === "applied" ? (
              <div className="mt-4 flex flex-wrap gap-3 border-t border-black/10 pt-4">
                <form action={action}>
                  <input type="hidden" name="volunteer_id" value={v.id} />
                  <input type="hidden" name="status" value="accepted" />
                  <button
                    type="submit"
                    className="rounded-full bg-[#003090] px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#0d2270]"
                  >
                    Accept
                  </button>
                </form>
                <form action={action}>
                  <input type="hidden" name="volunteer_id" value={v.id} />
                  <input type="hidden" name="status" value="declined" />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-5 py-2.5 text-[12px] font-semibold transition hover:bg-[#faf6ee]"
                  >
                    Decline
                  </button>
                </form>
              </div>
            ) : null}

            {v.status === "accepted" && shifts.length > 0 ? (
              <form
                action={assignAction}
                className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/10 pt-4"
              >
                <input type="hidden" name="volunteer_id" value={v.id} />
                <label className="text-[12px] font-semibold text-[#003090]/55">
                  Assign to a shift
                  <select
                    name="shift_id"
                    required
                    className="ml-2 rounded-full border border-black/15 bg-white px-3 py-2 text-[12px] outline-none focus:border-[#003090]"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </label>
                <input
                  type="text"
                  name="role"
                  placeholder="Role (optional)"
                  className="w-40 rounded-full border border-black/15 bg-white px-3 py-2 text-[12px] outline-none focus:border-[#003090]"
                />
                <button
                  type="submit"
                  className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-[#faf6ee]"
                >
                  Assign
                </button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
