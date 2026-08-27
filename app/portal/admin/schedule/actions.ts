"use server";

import { revalidatePath } from "next/cache";

import { requireStepUp, writeAudit } from "@/lib/auth";
import { sendScheduleChangedEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

/**
 * Competition and schedule management, Phase 3 sprint 3.1.
 *
 * Changes to a fixture's time or venue are logged automatically by a database
 * trigger, so the change log cannot be bypassed by forgetting to write it.
 * Schools plan travel around these dates; a silently moved fixture is worse
 * than a late one.
 */

export type ScheduleState = { error?: string; notice?: string };

const ADMIN_ROLES = ["super_admin", "committee"] as const;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function createVenue(
  _prev: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  await requireStepUp(ADMIN_ROLES, "/portal/admin/schedule");

  const name = String(formData.get("name") ?? "").trim();
  const lgaId = String(formData.get("lga_id") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const capacity = String(formData.get("capacity") ?? "").trim();

  if (!name) return { error: "Enter the venue's name." };
  let capacityValue: number | null = null;
  if (capacity) {
    const parsedCapacity = Number(capacity);
    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1) {
      return { error: "Capacity must be a positive whole number." };
    }
    capacityValue = parsedCapacity;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("venues").insert({
    name,
    slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`,
    lga_id: lgaId || null,
    address: address || null,
    capacity: capacityValue,
  });

  if (error) return { error: `Could not add the venue: ${error.message}` };

  await writeAudit({ action: "venue.created", entity: "venues", after: { name } });
  revalidatePath("/portal/admin/schedule");
  return { notice: `${name} added.` };
}

export async function createFixture(
  _prev: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  await requireStepUp(ADMIN_ROLES, "/portal/admin/schedule");

  const stageId = String(formData.get("stage_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const group = String(formData.get("qualifier_group") ?? "").trim();
  const venueId = String(formData.get("venue_id") ?? "");
  const when = String(formData.get("scheduled_at") ?? "").trim();

  if (!stageId) return { error: "Select the stage this fixture belongs to." };
  if (!name) return { error: "Give the fixture a name." };
  let scheduledAt: string | null = null;
  if (when) {
    const timestamp = Date.parse(when);
    if (Number.isNaN(timestamp)) return { error: "Enter a valid fixture date and time." };
    scheduledAt = new Date(timestamp).toISOString();
  }

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("fixtures")
    .insert({
      stage_id: stageId,
      name,
      qualifier_group: group || null,
      venue_id: venueId || null,
      scheduled_at: scheduledAt,
    })
    .select("id")
    .single();

  if (error) return { error: `Could not create the fixture: ${error.message}` };

  await writeAudit({
    action: "fixture.created",
    entity: "fixtures",
    entityId: created?.id,
    after: { name, stage_id: stageId },
  });

  revalidatePath("/portal/admin/schedule");
  return { notice: `${name} scheduled.` };
}

/** Reschedule. The trigger logs the change; the reason is recorded alongside. */
export async function rescheduleFixture(
  _prev: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  await requireStepUp(ADMIN_ROLES, "/portal/admin/schedule");

  const id = String(formData.get("fixture_id") ?? "");
  const when = String(formData.get("scheduled_at") ?? "").trim();
  const venueId = String(formData.get("venue_id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!id) return { error: "No fixture given." };
  if (!reason) {
    return {
      error:
        "Give a reason for the change. Schools plan travel around these dates and will be shown it.",
    };
  }

  const supabase = await createClient();
  const { data: fixtureBefore } = await supabase
    .from("fixtures")
    .select("name, scheduled_at, venue_id")
    .eq("id", id)
    .maybeSingle();
  if (!fixtureBefore) return { error: "That fixture could not be found." };

  let nextScheduledAt: string | null = null;
  if (when) {
    const timestamp = Date.parse(when);
    if (Number.isNaN(timestamp)) return { error: "Enter a valid date and time." };
    nextScheduledAt = new Date(timestamp).toISOString();
  }
  const sameInstant =
    (fixtureBefore.scheduled_at ? Date.parse(fixtureBefore.scheduled_at) : null) ===
    (nextScheduledAt ? Date.parse(nextScheduledAt) : null);
  const nextVenueId = venueId || null;
  const changedFieldCount = (sameInstant ? 0 : 1) +
    (fixtureBefore.venue_id === nextVenueId ? 0 : 1);
  if (changedFieldCount === 0) {
    return { notice: "No schedule change was needed." };
  }

  const { error } = await supabase
    .from("fixtures")
    .update({
      scheduled_at: nextScheduledAt,
      venue_id: nextVenueId,
    })
    .eq("id", id);

  if (error) return { error: `Could not reschedule: ${error.message}` };

  // The trigger has written the change rows (one per changed field); attach
  // the reason to each one written in this update, and notify every school
  // in the fixture of each field that moved.
  const { data: latest } = await supabase
    .from("fixture_changes")
    .select("id, field, old_value, new_value")
    .eq("fixture_id", id)
    .order("created_at", { ascending: false })
    .limit(changedFieldCount);

  let deliveryWarning = "";
  if (latest?.length) {
    await supabase
      .from("fixture_changes")
      .update({ reason })
      .in("id", latest.map((c) => c.id));

    // Joined in application code, not via an embedded select: this codebase's
    // Database type deliberately leaves Relationships empty and writes joins
    // explicitly (see the comment above `type Table` in
    // lib/supabase/types.ts), so this avoids the unchecked `as unknown as`
    // cast an embedded select here would otherwise need.
    const { data: participants } = await supabase
      .from("fixture_participants")
      .select("school_id")
      .eq("fixture_id", id);
    const schoolIds = (participants ?? []).map((p) => p.school_id);
    const { data: participantSchools } = schoolIds.length
      ? await supabase.from("schools").select("name, contact_email").in("id", schoolIds)
      : { data: [] as { name: string; contact_email: string | null }[] };

    const recipients = (participantSchools ?? []).filter(
      (s): s is { name: string; contact_email: string } => !!s.contact_email,
    );

    let undelivered = 0;
    for (const change of latest) {
      for (const school of recipients) {
        const delivered = await sendScheduleChangedEmail(school.contact_email, {
          schoolName: school.name,
          fixtureName: fixtureBefore?.name ?? "Your fixture",
          field: change.field === "venue" ? "venue" : "scheduled_at",
          oldValue: change.old_value,
          newValue: change.new_value,
          reason,
        });
        if (!delivered) undelivered += 1;
      }
    }

    if (undelivered > 0) {
      deliveryWarning = " Schedule notification email could not be delivered; contact affected schools directly.";
      await writeAudit({
        action: "fixture.reschedule_email_failed",
        entity: "fixtures",
        entityId: id,
        reason: `${undelivered} schedule notification${undelivered === 1 ? "" : "s"} not delivered`,
      });
    }
  }

  await writeAudit({
    action: "fixture.rescheduled",
    entity: "fixtures",
    entityId: id,
    reason,
  });

  revalidatePath("/portal/admin/schedule");
  revalidatePath("/schedule");
  return { notice: `Fixture updated and the change logged.${deliveryWarning}` };
}

/** Publish or unpublish. Nothing reaches the public schedule until published. */
export async function setFixturePublish(
  _prev: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  await requireStepUp(ADMIN_ROLES, "/portal/admin/schedule");

  const id = String(formData.get("fixture_id") ?? "");
  const publish = formData.get("publish") === "1";

  const supabase = await createClient();
  const { error } = await supabase
    .from("fixtures")
    .update({ publish: publish ? "published" : "draft" })
    .eq("id", id);

  if (error) return { error: `Could not update: ${error.message}` };

  await writeAudit({
    action: publish ? "fixture.published" : "fixture.unpublished",
    entity: "fixtures",
    entityId: id,
  });

  revalidatePath("/portal/admin/schedule");
  revalidatePath("/schedule");
  return { notice: publish ? "Published to the public schedule." : "Unpublished." };
}
