// SAEAC — transactional email, Sprint 2.2 confirmation + Sprint 3.1 schedule
// notices.
//
// The provider key is optional in development: without it, the function logs
// only the email kind and returns a skipped result so an email outage never
// blocks the underlying application action. Production has a domain-scoped
// sending key configured.
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
  volunteerApplicationAdminAlertEmail,
  volunteerApplicationReceivedEmail,
} from "./_shared/templates.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_ADDRESS =
  Deno.env.get("RESEND_FROM_ADDRESS") ??
  "Senator Asuquo Ekpenyong Academic Championship <info@senatorasuquoekpeyongacademicchampionship.com>";
// Supabase reserves the SUPABASE_ prefix for platform variables and no longer
// guarantees the legacy SERVICE_ROLE_KEY name in every Edge Function runtime.
// Keep an explicit server-only copy for the exact bearer check below.
const EMAIL_AUTH_TOKEN = Deno.env.get("SAEAC_EMAIL_AUTH_TOKEN");

type EmailKind =
  | "registration_submitted"
  | "registration_approved"
  | "registration_changes_requested"
  | "registration_rejected"
  | "schedule_changed"
  | "volunteer_application_received"
  | "volunteer_application_admin_alert";

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
    case "volunteer_application_received":
      return volunteerApplicationReceivedEmail(String(data.volunteerName ?? ""));
    case "volunteer_application_admin_alert":
      return volunteerApplicationAdminAlertEmail({
        volunteerName: String(data.volunteerName ?? ""),
        volunteerEmail: String(data.volunteerEmail ?? ""),
        phone: String(data.phone ?? ""),
        lgaName: String(data.lgaName ?? "Not available"),
        roleSought: String(data.roleSought ?? ""),
        hasPhoto: data.hasPhoto === true,
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
  if (!EMAIL_AUTH_TOKEN || auth !== `Bearer ${EMAIL_AUTH_TOKEN}`) {
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
  // Without a provider key in a development environment, record only the
  // template kind (never recipient, subject, or body) and let the calling
  // application action complete normally.
  // ---------------------------------------------------------------------
  if (!RESEND_API_KEY) {
    console.log(
      `[send-email] SKIPPED (no RESEND_API_KEY set) — kind=${body.kind}`,
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
    await resendResponse.text();
    console.error(`[send-email] Resend error ${resendResponse.status}`);
    // Email failing must never fail the caller's transaction (approving a
    // school, say) — the record is correct either way, so this reports the
    // problem without a non-2xx that could make a server action look like it
    // failed when the important part succeeded.
    return new Response(
      JSON.stringify({ ok: false, sent: false, error: "provider_error" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ ok: true, sent: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// ---------------------------------------------------------------------------
// Production Edge Function secrets: RESEND_API_KEY (domain-scoped sending
// access), RESEND_FROM_ADDRESS, and SAEAC_EMAIL_AUTH_TOKEN (the server-only
// bearer expected from the app). The sending domain's DNS must be verified
// with Resend before provider delivery is enabled.
// ---------------------------------------------------------------------------
