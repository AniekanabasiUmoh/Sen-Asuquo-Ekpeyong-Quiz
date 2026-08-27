"use server";

import { revalidatePath } from "next/cache";

import { requireUser, writeAudit } from "@/lib/auth";
import { sendRegistrationSubmittedEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import type { RegistrationStatus, School } from "@/lib/supabase/types";

/**
 * School registration wizard, Content Guide §4.6.
 *
 * The five steps are one database row, saved on every step, not a submission
 * held in the browser until the end. A principal filling this in on a phone
 * over patchy data must be able to close the tab and come back, which is also
 * why the row starts life as 'draft'.
 */

export type WizardState = { error?: string; notice?: string; ok?: boolean };

const STREAM_KEYS = ["science", "art", "commercial"] as const;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** Editable only while the registration is still open. */
const EDITABLE: RegistrationStatus[] = ["draft", "changes_requested"];

async function loadOwnSchool() {
  const user = await requireUser("/portal/school/register");
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();
  return { user, supabase, school: data };
}

/** Steps 1 to 3: save progress. Creates the draft row on first save. */
export async function saveStep(
  _prev: WizardState,
  formData: FormData,
): Promise<WizardState> {
  const { user, supabase, school } = await loadOwnSchool();
  const step = Number(formData.get("step") ?? 1);

  if (school && !EDITABLE.includes(school.status)) {
    return {
      error:
        "This registration has been submitted and can no longer be edited. Contact the committee if something needs to change.",
    };
  }

  // Typed rather than Record<string, unknown>: a loose index signature makes
  // supabase-js reject the update, and it would also let a typo through.
  const patch: Partial<School> = {};

  if (step === 1) {
    const name = String(formData.get("name") ?? "").trim();
    const lgaId = String(formData.get("lga_id") ?? "");
    if (!name) return { error: "Enter the school's name." };
    if (!lgaId) return { error: "Select the school's Local Government Area." };

    patch.name = name;
    patch.lga_id = lgaId;
    patch.is_private = formData.get("is_private") === "on";
    patch.address = String(formData.get("address") ?? "").trim() || null;
    patch.principal_name =
      String(formData.get("principal_name") ?? "").trim() || null;
  }

  if (step === 2) {
    // Streams are recorded per student at roster stage. Here we only capture
    // the school's intent, which is what §4.6 step 2 asks for.
    const streams = STREAM_KEYS.filter((s) => formData.get(`stream_${s}`) === "on");
    if (streams.length === 0) {
      return { error: "Select at least one stream the school will enter." };
    }
    patch.address = String(formData.get("address") ?? "").trim() || null;
  }

  if (step === 3) {
    const contactName = String(formData.get("contact_name") ?? "").trim();
    const contactEmail = String(formData.get("contact_email") ?? "")
      .trim()
      .toLowerCase();
    const contactPhone = String(formData.get("contact_phone") ?? "").trim();

    if (!contactName) return { error: "Enter the coordinator's name." };
    if (!contactEmail) return { error: "Enter the coordinator's email address." };
    if (!contactPhone) return { error: "Enter the coordinator's phone number." };

    patch.contact_name = contactName;
    patch.contact_email = contactEmail;
    patch.contact_phone = contactPhone;
  }

  if (!school) {
    const name = String(patch.name ?? "").trim();
    if (!name) return { error: "Start at step one: the school's name is needed first." };

    // Slug collisions are possible across LGAs; suffix keeps the insert honest
    // rather than failing on the unique index.
    const base = slugify(name);
    const { error } = await supabase.from("schools").insert({
      ...patch,
      lga_id: String(patch.lga_id),
      name,
      slug: `${base}-${Math.random().toString(36).slice(2, 7)}`,
      owner_id: user.id,
      status: "draft",
    });
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const { error } = await supabase
      .from("schools")
      .update(patch)
      .eq("id", school.id);
    if (error) return { error: `Could not save: ${error.message}` };
  }

  revalidatePath("/portal/school");
  return { ok: true, notice: "Saved." };
}

/**
 * Step 4: submit for verification.
 *
 * The registration number is NOT issued here. A number is the committee's
 * acknowledgement that a school is in the championship, so it is issued on
 * approval; the schema enforces that with a check constraint.
 */
export async function submitRegistration(
  _prev: WizardState,
  _formData: FormData,
): Promise<WizardState> {
  const { supabase, school } = await loadOwnSchool();

  if (!school) return { error: "There is nothing to submit yet." };
  if (!EDITABLE.includes(school.status)) {
    return { error: "This registration has already been submitted." };
  }

  const missing: string[] = [];
  if (!school.name) missing.push("school name");
  if (!school.lga_id) missing.push("Local Government Area");
  if (!school.contact_name) missing.push("coordinator name");
  if (!school.contact_email) missing.push("coordinator email");
  if (!school.contact_phone) missing.push("coordinator phone");

  if (missing.length) {
    return { error: `Still needed before submitting: ${missing.join(", ")}.` };
  }

  const { error } = await supabase
    .from("schools")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", school.id);

  if (error) return { error: `Could not submit: ${error.message}` };

  await writeAudit({
    action: "school.submitted",
    entity: "schools",
    entityId: school.id,
    before: { status: school.status },
    after: { status: "submitted" },
  });

  let deliveryWarning = "";
  if (school.contact_email) {
    const delivered = await sendRegistrationSubmittedEmail(school.contact_email, school.name);
    if (!delivered) {
      deliveryWarning = " Email delivery is pending; contact the committee if you need confirmation.";
      await writeAudit({
        action: "school.submission_email_failed",
        entity: "schools",
        entityId: school.id,
        reason: "Registration submission succeeded but the notification was not delivered",
      });
    }
  }

  revalidatePath("/portal/school");
  return {
    ok: true,
    notice:
      `Registration submitted. The Organising Committee will review it and you will be notified by email.${deliveryWarning}`,
  };
}
