"use server";

import { revalidatePath } from "next/cache";

import { requireRole, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { VolunteerStatus } from "@/lib/supabase/types";

export type VolunteerAdminState = { error?: string; notice?: string };

const VALID: VolunteerStatus[] = ["applied", "accepted", "declined", "withdrawn"];

export async function setVolunteerStatus(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireRole(["super_admin", "committee"], "/portal/admin/volunteers");

  const id = String(formData.get("volunteer_id") ?? "");
  const status = String(formData.get("status") ?? "") as VolunteerStatus;

  if (!id) return { error: "No application given." };
  if (!VALID.includes(status)) return { error: "Unknown status." };

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("volunteers")
    .select("status, full_name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("volunteers")
    .update({ status })
    .eq("id", id);

  if (error) return { error: `Could not update: ${error.message}` };

  await writeAudit({
    action: `volunteer.${status}`,
    entity: "volunteers",
    entityId: id,
    before: before ? { status: before.status } : undefined,
    after: { status },
  });

  revalidatePath("/portal/admin/volunteers");
  return { notice: `${before?.full_name ?? "Application"} ${status}.` };
}

/**
 * Shift, assignment and briefing management, Sprint 3.4.
 *
 * Deliberately small: a shift is a title, place and time, an assignment links
 * an accepted volunteer to one, and a briefing is a paragraph of instructions.
 * This is a one-day-a-year volunteer programme, not a rostering system.
 */
export async function createShift(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireRole(["super_admin", "committee"], "/portal/admin/volunteers");

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title) return { error: "Give the shift a title." };

  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_shifts").insert({
    title,
    location: location || null,
    starts_at: startsAt ? new Date(startsAt).toISOString() : null,
    notes: notes || null,
  });

  if (error) return { error: `Could not create the shift: ${error.message}` };

  revalidatePath("/portal/admin/volunteers");
  return { notice: `${title} added.` };
}

export async function assignToShift(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireRole(["super_admin", "committee"], "/portal/admin/volunteers");

  const shiftId = String(formData.get("shift_id") ?? "");
  const volunteerId = String(formData.get("volunteer_id") ?? "");
  const role = String(formData.get("role") ?? "").trim();

  if (!shiftId || !volunteerId) return { error: "Select a shift and a Change Maker." };

  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_shift_assignments").insert({
    shift_id: shiftId,
    volunteer_id: volunteerId,
    role: role || null,
  });

  if (error) {
    if (error.message.includes("duplicate")) {
      return { error: "Already assigned to that shift." };
    }
    return { error: `Could not assign: ${error.message}` };
  }

  revalidatePath("/portal/admin/volunteers");
  return { notice: "Assigned." };
}

export async function removeAssignment(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireRole(["super_admin", "committee"], "/portal/admin/volunteers");

  const id = String(formData.get("assignment_id") ?? "");
  if (!id) return { error: "No assignment given." };

  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_shift_assignments").delete().eq("id", id);

  if (error) return { error: `Could not remove: ${error.message}` };

  revalidatePath("/portal/admin/volunteers");
  return { notice: "Removed from the shift." };
}

export async function publishBriefing(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireRole(["super_admin", "committee"], "/portal/admin/volunteers");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const shiftId = String(formData.get("shift_id") ?? "");

  if (!title || !body) return { error: "Give the briefing a title and its content." };

  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_briefings").insert({
    title,
    body,
    shift_id: shiftId || null,
    publish: "published",
  });

  if (error) return { error: `Could not publish: ${error.message}` };

  revalidatePath("/portal/admin/volunteers");
  return { notice: `${title} published to Change Makers.` };
}
