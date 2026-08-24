// SAEAC — transactional email, Sprint 2.2 confirmation + Sprint 3.1 schedule
// notices.
//
// PLACEHOLDER, WAITING ON A KEY: this function is complete and ready to
// deploy, but RESEND_API_KEY has not been set yet. Until it is, every call
// here is logged and returns { ok: true, skipped: true } rather than
// failing, so nothing in the app breaks or blocks on email being absent. See
// "To activate" below for the two commands that turn this on once the key
// arrives.
//
// Called from Next.js server actions with the service-role key (never from
// the browser: this function must not be invokable by an anonymous client,
// since it will hold a paid Resend key). Deno, not Node — Supabase Edge
// Functions run on Deno's runtime, hence the esm.sh import rather than npm.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  registrationApprovedEmail,
  registrationChangesRequestedEmail,
  registrationRejectedEmail,
  registrationSubmittedEmail,
  scheduleChangedEmail,
} from "./_shared/templates.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_ADDRESS =
  Deno.env.get("RESEND_FROM_ADDRESS") ?? "SAEAC <registrations@saeac.org>";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

type EmailKind =
  | "registration_submitted"
  | "registration_approved"
  | "registration_changes_requested"
  | "registration_rejected"
  | "schedule_changed";

type RequestBody = {
  kind: EmailKind;
  to: string;
  data: Record<string, unknown>;
};

function buildEmail(kind: EmailKind, data: Record<string, unknown>) {
  switch (kind) {
    case "registration_submitted":
      return registrationSubmittedEmail(String(data.schoolName ?? ""));
    case "registration_approved":
      return registrationApprovedEmail(
        String(data.schoolName ?? ""),
        String(data.registrationNo ?? ""),
      );
    case "registration_changes_requested":
      return registrationChangesRequestedEmail(
        String(data.schoolName ?? ""),
        String(data.reason ?? ""),
      );
    case "registration_rejected":
      return registrationRejectedEmail(
        String(data.schoolName ?? ""),
        String(data.reason ?? ""),
      );
    case "schedule_changed":
      return scheduleChangedEmail({
        schoolName: String(data.schoolName ?? ""),
        fixtureName: String(data.fixtureName ?? ""),
        field: data.field === "venue" ? "venue" : "scheduled_at",
        oldValue: data.oldValue == null ? null : String(data.oldValue),
        newValue: data.newValue == null ? null : String(data.newValue),
        reason: String(data.reason ?? ""),
      });
    default:
      throw new Error(`Unknown email kind: ${kind}`);
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Only the app's own server (holding the service-role key) may trigger an
  // email. This is not RLS-governed data, so the check is a bearer match
  // against the same secret Postgres calls already carry.
  const auth = req.headers.get("Authorization") ?? "";
  if (!SERVICE_ROLE_KEY || auth !== `Bearer ${SERVICE_ROLE_KEY}`) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.to || !body.kind) {
    return new Response(
      JSON.stringify({ ok: false, error: "missing 'to' or 'kind'" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  let email: { subject: string; html: string };
  try {
    email = buildEmail(body.kind, body.data ?? {});
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "bad request" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // ---------------------------------------------------------------------
  // PLACEHOLDER: no key yet. Log what would have sent, and return success
  // so the calling action (approve a school, reschedule a fixture, ...)
  // completes normally. Remove this block once RESEND_API_KEY is set — the
  // real send below is already written and waiting.
  // ---------------------------------------------------------------------
  if (!RESEND_API_KEY) {
    console.log(
      `[send-email] SKIPPED (no RESEND_API_KEY set) — kind=${body.kind} to=${body.to} subject="${email.subject}"`,
    );
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: "RESEND_API_KEY not set" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [body.to],
      subject: email.subject,
      html: email.html,
    }),
  });

  if (!resendResponse.ok) {
    const text = await resendResponse.text();
    console.error(`[send-email] Resend error ${resendResponse.status}: ${text}`);
    // Email failing must never fail the caller's transaction (approving a
    // school, say) — the record is correct either way, so this reports the
    // problem without a non-2xx that could make a server action look like it
    // failed when the important part succeeded.
    return new Response(
      JSON.stringify({ ok: false, sent: false, error: text }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ ok: true, sent: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// ---------------------------------------------------------------------------
// To activate once a Resend API key exists:
//
//   npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//   npx supabase secrets set RESEND_FROM_ADDRESS="SAEAC <registrations@saeac.org>"
//   npx supabase functions deploy send-email
//
// The sending domain (saeac.org, or a subdomain of it) also needs its SPF/
// DKIM records added at the registrar before Resend will deliver from it —
// Resend's dashboard gives the exact DNS records once the domain is added
// there. Until DNS is verified, Resend will only deliver to the account's own
// verified email addresses, which is enough to test this function end to end
// before the real domain is ready.
// ---------------------------------------------------------------------------
