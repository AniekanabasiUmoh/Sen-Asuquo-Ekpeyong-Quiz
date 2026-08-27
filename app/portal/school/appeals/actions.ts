"use server";

import { revalidatePath } from "next/cache";
import { requireUser, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AppealKind } from "@/lib/supabase/types";

export type AppealState = { error?: string; notice?: string };
const KINDS: AppealKind[] = ["registration", "result", "schedule", "other"];

export async function submitAppeal(_prev: AppealState, formData: FormData): Promise<AppealState> {
  const user = await requireUser("/portal/school/appeals");
  const kind = String(formData.get("kind") ?? "") as AppealKind;
  const subject = String(formData.get("subject") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  const evidenceUrl = String(formData.get("evidence_url") ?? "").trim();
  if (!KINDS.includes(kind)) return { error: "Choose what your appeal concerns." };
  if (!subject || !details) return { error: "Enter a subject and explain the issue." };
  if (evidenceUrl && ((evidenceUrl.startsWith("//")) || (!evidenceUrl.startsWith("/") && !/^https:\/\//i.test(evidenceUrl)))) return { error: "Evidence must be a site path or HTTPS URL." };
  if (evidenceUrl.length > 2048) return { error: "That evidence link is too long." };
  const supabase = await createClient();
  let { data: school } = await supabase.from("schools").select("id, name").eq("owner_id", user.id).maybeSingle();
  if (!school && user.roles.includes("coach")) {
    const { data: assignment } = await supabase.from("coaches").select("school_id").eq("user_id", user.id).maybeSingle();
    if (assignment) {
      const result = await supabase.from("schools").select("id, name").eq("id", assignment.school_id).maybeSingle();
      school = result.data;
    }
  }
  if (!school) return { error: "Start a school registration before submitting an appeal." };
  const { data, error } = await supabase.from("appeals").insert({ school_id: school.id, submitted_by: user.id, kind, subject, details, evidence_url: evidenceUrl || null }).select("id").single();
  if (error) return { error: `Could not submit appeal: ${error.message}` };
  await writeAudit({ action: "appeal.submitted", entity: "appeals", entityId: data.id, after: { school_id: school.id, kind, subject } });
  revalidatePath("/portal/school/appeals"); revalidatePath("/portal/admin/appeals");
  return { notice: "Appeal submitted to the Organising Committee." };
}
