"use server";

import { revalidatePath } from "next/cache";

import { requireRole, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AccreditationHolder } from "@/lib/supabase/types";

export type AccreditationState = { error?: string; notice?: string };

const ADMIN_ROLES = ["super_admin", "committee"] as const;

/**
 * Issues accreditation for everyone eligible who does not already have one.
 *
 * Scope, agreed before building: students and their Coach (once a school is
 * approved), accepted Change Makers, and assigned judges. Idempotent by
 * design — the unique (holder_type, holder_id) constraint means running this
 * again after five more schools are approved only issues the five new
 * badges, never touches the existing ones.
 */
export async function issueMissingAccreditations(
  _prev: AccreditationState,
): Promise<AccreditationState> {
  await requireRole(ADMIN_ROLES, "/portal/admin/accreditation");
  const supabase = await createClient();

  // Approved school ids first, then filter students/coaches against that set
  // in application code. Not an embedded !inner() select: this codebase's
  // Database type deliberately leaves Relationships empty and writes joins
  // explicitly (see the comment above `type Table` in lib/supabase/types.ts)
  // rather than relying on generated join inference, so this stays consistent
  // with every other query in the app instead of being the one exception.
  const { data: approvedSchools } = await supabase
    .from("schools")
    .select("id")
    .eq("status", "approved");
  const approvedIds = (approvedSchools ?? []).map((s) => s.id);

  const [{ data: students }, { data: coaches }, { data: volunteers }, { data: judgeAssignments }] =
    await Promise.all([
      approvedIds.length
        ? supabase.from("students").select("id").in("school_id", approvedIds)
        : Promise.resolve({ data: [] as { id: string }[] }),
      approvedIds.length
        ? supabase.from("coaches").select("id").in("school_id", approvedIds)
        : Promise.resolve({ data: [] as { id: string }[] }),
      supabase.from("volunteers").select("id").eq("status", "accepted"),
      supabase.from("judge_assignments").select("judge_id"),
    ]);

  const judgeIds = [...new Set((judgeAssignments ?? []).map((a) => a.judge_id))];

  const rows: { holder_type: AccreditationHolder; holder_id: string }[] = [
    ...(students ?? []).map((s) => ({ holder_type: "student" as const, holder_id: s.id })),
    ...(coaches ?? []).map((c) => ({ holder_type: "coach" as const, holder_id: c.id })),
    ...(volunteers ?? []).map((v) => ({ holder_type: "volunteer" as const, holder_id: v.id })),
    ...judgeIds.map((id) => ({ holder_type: "judge" as const, holder_id: id })),
  ];

  if (rows.length === 0) return { notice: "Nobody currently eligible to issue for." };

  // on conflict do nothing: existing badges (and their check-in state) are
  // never touched by re-running this.
  const { data: inserted, error } = await supabase
    .from("accreditations")
    .upsert(rows, { onConflict: "holder_type,holder_id", ignoreDuplicates: true })
    .select("id");

  if (error) return { error: `Could not issue accreditations: ${error.message}` };

  await writeAudit({
    action: "accreditation.issued",
    entity: "accreditations",
    after: { count: inserted?.length ?? 0 },
  });

  revalidatePath("/portal/admin/accreditation");
  return {
    notice:
      inserted?.length
        ? `Issued ${inserted.length} new accreditation${inserted.length === 1 ? "" : "s"}.`
        : "Everyone eligible already has an accreditation.",
  };
}

export async function revokeAccreditation(
  _prev: AccreditationState,
  formData: FormData,
): Promise<AccreditationState> {
  await requireRole(ADMIN_ROLES, "/portal/admin/accreditation");
  const id = String(formData.get("accreditation_id") ?? "");
  if (!id) return { error: "No accreditation given." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("accreditations")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Could not revoke: ${error.message}` };

  await writeAudit({ action: "accreditation.revoked", entity: "accreditations", entityId: id });
  revalidatePath("/portal/admin/accreditation");
  return { notice: "Revoked." };
}

export type CheckInResult = {
  ok: boolean;
  message: string;
  holderName: string | null;
  detail: string | null;
};

export type CheckInState = { error?: string; result?: CheckInResult };

export async function checkInCode(
  _prev: CheckInState,
  formData: FormData,
): Promise<CheckInState> {
  await requireRole(ADMIN_ROLES, "/portal/admin/accreditation");
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "No code given." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_in_accreditation", { scanned_code: code });

  if (error) return { error: `Could not check the code: ${error.message}` };
  const row = data?.[0];
  if (!row) return { error: "No response from the check-in." };

  return {
    result: {
      ok: row.ok,
      message: row.message,
      holderName: row.holder_name,
      detail: row.detail,
    },
  };
}
