import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";

import { listAudit, listUsers } from "./actions";
import { UserList } from "./user-rows";

export const metadata: Metadata = {
  title: "Users and roles",
  robots: { index: false },
};

export default async function AdminUsersPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/users");
  const [users, audit] = await Promise.all([listUsers(), listAudit(40)]);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Users and roles
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        Everyone with an account. Roles decide what each person can see and do;
        click a role to revoke it. Every grant and revocation is recorded in the
        audit trail below.
      </p>

      <div className="mt-9">
        <UserList users={users} />
      </div>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold">Audit trail</h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-primary/55">
          The most recent 40 recorded actions. The trail is append only: entries
          cannot be edited or deleted through the portal.
        </p>

        {audit.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-6 text-center text-[13px] text-primary/45">
            Nothing recorded yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.12em] text-primary/45">
                  <th className="py-3 pr-4 font-bold">When</th>
                  <th className="py-3 pr-4 font-bold">Action</th>
                  <th className="py-3 pr-4 font-bold">Entity</th>
                  <th className="py-3 pr-4 font-bold">Reason</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((a) => (
                  <tr key={a.id} className="border-b border-black/[0.06]">
                    <td className="py-3 pr-4 tabular-nums text-primary/60">
                      {new Date(a.created_at).toLocaleString("en-GB")}
                    </td>
                    <td className="py-3 pr-4 font-semibold">{a.action}</td>
                    <td className="py-3 pr-4 text-primary/60">{a.entity}</td>
                    <td className="py-3 pr-4 text-primary/60">{a.reason ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
