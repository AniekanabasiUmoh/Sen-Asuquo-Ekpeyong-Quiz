"use server";

import { revalidatePath } from "next/cache";

import { requireStepUp, writeAudit } from "@/lib/auth";
import {
  sendRegistrationApprovedEmail,
  sendRegistrationChangesRequestedEmail,
  sendRegistrationRejectedEmail,
} from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export type AdminState = { error?: string; notice?: string };

const ADMIN_ROLES = ["super_admin", "committee"] as const;

/**
 * Approve a school registration.
 *
 * Approval is the moment a registration number is issued, which is why it is
 * minted here rather than at submission. The schema will refuse an approved row
 * without one, so a failure to mint cannot leave an inconsistent record.
 */
export async function approveSchool(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const user = await requireStepUp(ADMIN_ROLES, "/portal/admin");
  const id = String(formData.get("school_id") ?? "");
  if (!id) return { error: "No school given." };

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("schools")
    .select("status, registration_no, name, contact_email")
    .eq("id", id)
    .maybeSingle();

  if (!before) return { error: "That school could not be found." };
  if (before.status === "approved") {
    return { notice: "That registration is already approved." };
  }

  // issue_registration_number takes an advisory lock and writes the number, so
  // two admins approving at once cannot mint the same one.
  let registrationNo = before.registration_no;
  if (!registrationNo) {
    const { data: issued, error: rpcError } = await supabase.rpc(
      "issue_registration_number",
      { school: id },
    );
    if (rpcError || !issued) {
      return { error: `Could not issue a registration number: ${rpcError?.message ?? "unknown error"}` };
    }
    registrationNo = issued;
  }

  const { error } = await supabase
    .from("schools")
    .update({
      status: "approved",
      registration_no: registrationNo,
      approved_at: new Date().toISOString(),
      approved_by: user.id,
      rejection_reason: null,
    })
    .eq("id", id);

  if (error) return { error: `Could not approve: ${error.message}` };

  await writeAudit({
    action: "school.approved",
    entity: "schools",
    entityId: id,
    before: { status: before.status },
    after: { status: "approved", registration_no: registrationNo },
  });

  let deliveryWarning = "";
  if (before.contact_email) {
    const delivered = await sendRegistrationApprovedEmail(
      before.contact_email,
      before.name,
      registrationNo,
    );
    if (!delivered) {
      deliveryWarning = " Email delivery is pending; share the number manually.";
      await writeAudit({
        action: "school.approval_email_failed",
        entity: "schools",
        entityId: id,
        reason: "Registration approval succeeded but the notification was not delivered",
      });
    }
  }

  revalidatePath("/portal/admin");
  return { notice: `Approved. Registration number ${registrationNo} issued.${deliveryWarning}` };
}

/** Reject, or send back for correction. Both require a reason. */
export async function rejectSchool(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireStepUp(ADMIN_ROLES, "/portal/admin");
  const id = String(formData.get("school_id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const sendBack = formData.get("send_back") === "1";

  if (!id) return { error: "No school given." };
  if (!reason) {
    return {
      error: "Give a reason. The school sees this, so make it specific enough to act on.",
    };
  }

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("schools")
    .select("status, name, contact_email")
    .eq("id", id)
    .maybeSingle();

  if (!before) return { error: "That school could not be found." };

  const status = sendBack ? "changes_requested" : "rejected";
  const { error } = await supabase
    .from("schools")
    .update({ status, rejection_reason: reason })
    .eq("id", id);

  if (error) return { error: `Could not update: ${error.message}` };

  await writeAudit({
    action: sendBack ? "school.changes_requested" : "school.rejected",
    entity: "schools",
    entityId: id,
    before: { status: before.status },
    after: { status },
    reason,
  });

  let deliveryWarning = "";
  if (before.contact_email) {
    const delivered = await (sendBack
      ? sendRegistrationChangesRequestedEmail(before.contact_email, before.name, reason)
      : sendRegistrationRejectedEmail(before.contact_email, before.name, reason));
    if (!delivered) {
      deliveryWarning = " Email delivery is pending; contact the school directly.";
      await writeAudit({
        action: sendBack ? "school.changes_email_failed" : "school.rejection_email_failed",
        entity: "schools",
        entityId: id,
        reason: "Registration decision succeeded but the notification was not delivered",
      });
    }
  }

  revalidatePath("/portal/admin");
  return {
    notice: sendBack
      ? `Sent back to the school for correction.${deliveryWarning}`
      : `Registration marked as not accepted.${deliveryWarning}`,
  };
}
