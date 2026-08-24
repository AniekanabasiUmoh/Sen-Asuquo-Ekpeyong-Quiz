import "server-only";

/**
 * Sends a transactional email via the send-email Edge Function.
 *
 * PLACEHOLDER, WAITING ON A RESEND KEY: the Edge Function this calls has no
 * RESEND_API_KEY set yet, so every call below currently logs and no-ops
 * rather than sending. That is on the function's side, not this one — this
 * helper is complete and needs no changes when the key arrives; see
 * supabase/functions/send-email/index.ts for the two commands that activate
 * it.
 *
 * Always swallows its own failures. An email is a courtesy on top of a
 * database change that already succeeded (a school was approved, a fixture
 * moved); it must never be the reason a server action reports failure to a
 * committee member who correctly did their job.
 */
async function sendEmail(kind: string, to: string, data: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !to) return;

  try {
    await fetch(`${url}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kind, to, data }),
    });
  } catch (e) {
    console.error(`[email] ${kind} to ${to} failed to send:`, e);
  }
}

export function sendRegistrationSubmittedEmail(to: string, schoolName: string) {
  return sendEmail("registration_submitted", to, { schoolName });
}

export function sendRegistrationApprovedEmail(
  to: string,
  schoolName: string,
  registrationNo: string,
) {
  return sendEmail("registration_approved", to, { schoolName, registrationNo });
}

export function sendRegistrationChangesRequestedEmail(
  to: string,
  schoolName: string,
  reason: string,
) {
  return sendEmail("registration_changes_requested", to, { schoolName, reason });
}

export function sendRegistrationRejectedEmail(
  to: string,
  schoolName: string,
  reason: string,
) {
  return sendEmail("registration_rejected", to, { schoolName, reason });
}

export function sendScheduleChangedEmail(
  to: string,
  data: {
    schoolName: string;
    fixtureName: string;
    field: "scheduled_at" | "venue";
    oldValue: string | null;
    newValue: string | null;
    reason: string;
  },
) {
  return sendEmail("schedule_changed", to, data);
}
