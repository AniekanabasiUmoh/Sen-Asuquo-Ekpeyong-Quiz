import "server-only";

/**
 * Sends a transactional email via the send-email Edge Function.
 *
 * The Edge Function still needs a valid RESEND_API_KEY and verified sender;
 * until then every call below logs and no-ops rather than sending. That is on
 * the function's side, not this one — this helper is complete and needs no
 * changes when the provider is ready; see
 * supabase/functions/send-email/index.ts for the two commands that activate
 * it.
 *
 * Always swallows its own failures. An email is a courtesy on top of a
 * database change that already succeeded (a school was approved, a fixture
 * moved); it must never be the reason a server action reports failure to a
 * committee member who correctly did their job.
 */
async function sendEmail(kind: string, to: string, data: Record<string, unknown>): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !to) return false;

  try {
    const response = await fetch(`${url}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kind, to, data }),
    });
    if (!response.ok) {
      // Do not log the response body: provider errors can contain recipient
      // data. The status is enough to diagnose a missing function or secret.
      // Do not log the recipient or response body: provider errors can contain
      // personal data. The status is enough to diagnose the failure.
      console.error(`[email] ${kind} returned HTTP ${response.status}`);
      return false;
    }
    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; skipped?: boolean }
      | null;
    if (result?.ok === false || result?.skipped) {
      console.warn(`[email] ${kind} was not delivered (provider unavailable)`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[email] ${kind} failed to send:`, e);
    return false;
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
