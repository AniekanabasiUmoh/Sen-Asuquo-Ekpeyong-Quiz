"use server";

import { revalidatePath } from "next/cache";
import { requireStepUp, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AppealStatus } from "@/lib/supabase/types";

export type AppealAdminState = { error?: string; notice?: string };
const STATUSES: AppealStatus[] = ["submitted", "under_review", "resolved", "rejected", "withdrawn"];

export async function updateAppeal(_prev: AppealAdminState, formData: FormData): Promise<AppealAdminState> {
  const user = await requireStepUp(["super_admin", "committee"], "/portal/admin/appeals");
  const id = String(formData.get("appeal_id") ?? "");
  const status = String(formData.get("status") ?? "") as AppealStatus;
  const resolution = String(formData.get("resolution") ?? "").trim();
  if (!id || !STATUSES.includes(status)) return { error: "Choose an appeal and valid status." };
  if ((status === "resolved" || status === "rejected") && !resolution) return { error: "Add the committee response before closing an appeal." };
  const supabase = await createClient();
  const { data: before } = await supabase.from("appeals").select("status, subject").eq("id", id).maybeSingle();
  if (!before) return { error: "That appeal could not be found." };
  const { error } = await supabase.from("appeals").update({ status, resolution: resolution || null, assigned_to: user.id, resolved_at: ["resolved", "rejected"].includes(status) ? new Date().toISOString() : null }).eq("id", id);
  if (error) return { error: `Could not update appeal: ${error.message}` };
  await writeAudit({ action: "appeal.status_changed", entity: "appeals", entityId: id, before: { status: before.status }, after: { status, resolution: resolution || null } });
  revalidatePath("/portal/admin/appeals"); revalidatePath("/portal/school/appeals");
  return { notice: `${before.subject} updated.` };
}
