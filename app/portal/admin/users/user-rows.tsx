"use client";

import { useActionState } from "react";

import { FormError, FormNotice } from "@/components/form";
import type { AppRole } from "@/lib/supabase/types";

import { grantRole, revokeRole, type UserState } from "./actions";

const EMPTY: UserState = {};

const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super admin",
  committee: "Committee",
  school_admin: "School admin",
  coach: "Coach",
  student: "Student",
  judge: "Judge",
  volunteer: "Volunteer",
  viewer: "Viewer",
};

const GRANTABLE: AppRole[] = [
  "committee",
  "judge",
  "volunteer",
  "viewer",
  "super_admin",
];

export type UserRow = {
  id: string;
  fullName: string | null;
  email: string | null;
  createdAt: string;
  roles: AppRole[];
  school: string | null;
};

export function UserList({ users }: { users: UserRow[] }) {
  const [grantState, grantAction] = useActionState(grantRole, EMPTY);
  const [revokeState, revokeAction] = useActionState(revokeRole, EMPTY);

  return (
    <div>
      <FormError message={grantState.error ?? revokeState.error} />
      <FormNotice message={grantState.notice ?? revokeState.notice} />

      <ul className="mt-5 space-y-3">
        {users.map((u) => (
          <li key={u.id} className="rounded-[24px] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold">
                  {u.fullName ?? "No name given"}
                </h3>
                <p className="mt-0.5 truncate text-[13px] text-primary/55">
                  {u.email}
                </p>
                {u.school ? (
                  <p className="mt-1 text-[12px] text-primary/45">{u.school}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {u.roles.length === 0 ? (
                  <span className="text-[12px] text-primary/40">No roles</span>
                ) : (
                  u.roles.map((r) => (
                    <form key={r} action={revokeAction} className="inline">
                      <input type="hidden" name="user_id" value={u.id} />
                      <input type="hidden" name="role" value={r} />
                      <button
                        type="submit"
                        title={`Revoke ${ROLE_LABEL[r]}`}
                        className={
                          "rounded-full px-3.5 py-1.5 text-[11px] font-bold transition " +
                          (r === "super_admin" || r === "committee"
                            ? "bg-primary text-white hover:bg-red-ink"
                            : "bg-primary/10 text-primary hover:bg-red/15 hover:text-red-ink")
                        }
                      >
                        {ROLE_LABEL[r]}
                        <span aria-hidden="true"> ×</span>
                        <span className="sr-only">, revoke</span>
                      </button>
                    </form>
                  ))
                )}
              </div>
            </div>

            <form
              action={grantAction}
              className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/10 pt-4"
            >
              <input type="hidden" name="user_id" value={u.id} />
              <label
                htmlFor={`role-${u.id}`}
                className="text-[12px] font-semibold text-primary/55"
              >
                Grant a role
              </label>
              <select
                id={`role-${u.id}`}
                name="role"
                className="rounded-full border border-black/15 bg-white px-4 py-2 text-[12px] outline-none focus:border-primary"
                defaultValue="committee"
              >
                {GRANTABLE.filter((r) => !u.roles.includes(r)).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream"
              >
                Grant
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
