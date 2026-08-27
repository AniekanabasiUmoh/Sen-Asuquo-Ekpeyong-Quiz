"use server";

import { revalidatePath } from "next/cache";

import { requireStepUp, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PublishStatus, VolunteerStatus } from "@/lib/supabase/types";

export type VolunteerAdminState = { error?: string; notice?: string };

const VALID: VolunteerStatus[] = ["applied", "accepted", "declined", "withdrawn"];
const PUBLISH_STATES: PublishStatus[] = ["draft", "review", "published", "archived"];

export async function setVolunteerStatus(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/volunteers");

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
  await requireStepUp(["super_admin", "committee"], "/portal/admin/volunteers");

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title) return { error: "Give the shift a title." };
  let startsAtIso: string | null = null;
  if (startsAt) {
    const timestamp = Date.parse(startsAt);
    if (Number.isNaN(timestamp)) return { error: "Enter a valid shift date and time." };
    startsAtIso = new Date(timestamp).toISOString();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("volunteer_shifts")
    .insert({
      title,
      location: location || null,
      starts_at: startsAtIso,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: `Could not create the shift: ${error.message}` };

  await writeAudit({
    action: "volunteer_shift.created",
    entity: "volunteer_shifts",
    entityId: data.id,
    after: { title, location, startsAt: startsAtIso },
  });

  revalidatePath("/portal/admin/volunteers");
  return { notice: `${title} added.` };
}

export async function assignToShift(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/volunteers");

  const shiftId = String(formData.get("shift_id") ?? "");
  const volunteerId = String(formData.get("volunteer_id") ?? "");
  const role = String(formData.get("role") ?? "").trim();

  if (!shiftId || !volunteerId) return { error: "Select a shift and a Change Maker." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("volunteer_shift_assignments")
    .insert({
      shift_id: shiftId,
      volunteer_id: volunteerId,
      role: role || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("duplicate")) {
      return { error: "Already assigned to that shift." };
    }
    return { error: `Could not assign: ${error.message}` };
  }

  await writeAudit({
    action: "volunteer_shift.assigned",
    entity: "volunteer_shift_assignments",
    entityId: data.id,
    after: { shift_id: shiftId, volunteer_id: volunteerId, role: role || null },
  });

  revalidatePath("/portal/admin/volunteers");
  return { notice: "Assigned." };
}

export async function removeAssignment(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/volunteers");

  const id = String(formData.get("assignment_id") ?? "");
  if (!id) return { error: "No assignment given." };

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("volunteer_shift_assignments")
    .select("shift_id, volunteer_id")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { error: "That assignment could not be found." };

  const { error } = await supabase
    .from("volunteer_shift_assignments")
    .delete()
    .eq("id", id);

  if (error) return { error: `Could not remove: ${error.message}` };

  await writeAudit({
    action: "volunteer_shift.assignment_removed",
    entity: "volunteer_shift_assignments",
    entityId: id,
    before,
  });

  revalidatePath("/portal/admin/volunteers");
  return { notice: "Removed from the shift." };
}

export async function publishBriefing(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/volunteers");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const shiftId = String(formData.get("shift_id") ?? "");

  if (!title || !body) return { error: "Give the briefing a title and its content." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("volunteer_briefings")
    .insert({
      title,
      body,
      shift_id: shiftId || null,
      publish: "published",
    })
    .select("id")
    .single();

  if (error) return { error: `Could not publish: ${error.message}` };

  await writeAudit({
    action: "volunteer_briefing.published",
    entity: "volunteer_briefings",
    entityId: data.id,
    after: { title, shift_id: shiftId || null },
  });

  revalidatePath("/portal/admin/volunteers");
  return { notice: `${title} published to Change Makers.` };
}

/** Broadcast a dashboard message to all accepted Change Makers, or one shift. */
export async function publishVolunteerMessage(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  const user = await requireStepUp(["super_admin", "committee"], "/portal/admin/volunteers");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const shiftId = String(formData.get("shift_id") ?? "").trim() || null;
  if (!title || !body) return { error: "Give the message a title and its content." };
  if (title.length > 160 || body.length > 5000) return { error: "Keep the title under 160 characters and the message under 5,000 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("volunteer_messages").insert({
    title,
    body,
    shift_id: shiftId,
    publish: "published",
    published_at: new Date().toISOString(),
    created_by: user.id,
  }).select("id").single();
  if (error) return { error: `Could not publish the message: ${error.message}` };
  await writeAudit({ action: "volunteer_message.published", entity: "volunteer_messages", entityId: data.id, after: { title, shiftId } });
  revalidatePath("/portal/admin/volunteers");
  revalidatePath("/portal/volunteer");
  return { notice: `${title} published to ${shiftId ? "the selected shift" : "all accepted Change Makers"}.` };
}

export async function setVolunteerMessageStatus(
  _prev: VolunteerAdminState,
  formData: FormData,
): Promise<VolunteerAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/volunteers");
  const id = String(formData.get("message_id") ?? "");
  const publish = String(formData.get("publish") ?? "") as PublishStatus;
  if (!id || !PUBLISH_STATES.includes(publish)) return { error: "Choose a message and a valid status." };
  const supabase = await createClient();
  const { data: before } = await supabase.from("volunteer_messages").select("title, publish").eq("id", id).maybeSingle();
  if (!before) return { error: "That message could not be found." };
  const { error } = await supabase.from("volunteer_messages").update({ publish, published_at: publish === "published" ? new Date().toISOString() : null }).eq("id", id);
  if (error) return { error: `Could not update the message: ${error.message}` };
  await writeAudit({ action: "volunteer_message.status_changed", entity: "volunteer_messages", entityId: id, before: { publish: before.publish }, after: { publish } });
  revalidatePath("/portal/admin/volunteers");
  revalidatePath("/portal/volunteer");
  return { notice: `${before.title} is now ${publish}.` };
}
