/**
 * Email templates, Sprint 2.2 confirmation + Sprint 3.1 schedule notices.
 *
 * Design decisions, recorded here for the same reason they were recorded on
 * the homepage: so nobody re-derives or accidentally drifts from them later.
 *
 *   - Colour: navy #003090 and gold #f0a800, the same working pair used
 *     everywhere in the app (not the brand deck's pure #0006EB blue — the
 *     built site standardised on #003090 from Phase 0 onward, and an email
 *     that used the deck's blue instead would visibly not match the portal
 *     the recipient is about to open).
 *   - Type: web fonts are unreliable in email clients (Outlook strips
 *     @font-face entirely, Gmail is inconsistent), so this does not attempt
 *     Lama Sans. It uses the same *fallback stack* the site's own CSS
 *     variables name for when Lama Sans fails to load
 *     (`ui-sans-serif, system-ui, sans-serif`), which keeps an email that
 *     cannot use the real typeface at least degrading the way the site
 *     itself already plans for.
 *   - Shape: 16px corner radius on the card, not the site's 24-28px — large
 *     radii read as rendering bugs in Outlook's table-based layout engine,
 *     so this scales the language down rather than dropping it.
 *   - No em dashes in copy, matching the house style set in
 *     app/(auth)/actions.ts and every page built so far.
 *   - No icon font or SVG icon set: email clients strip inline SVG
 *     inconsistently and an icon font requires a web font that will not
 *     load. Status is communicated by the gold/navy pill text alone, the
 *     same way the portal's own status badges work without icons.
 */

const NAVY = "#003090";
const GOLD = "#f0a800";
const PAPER = "#faf6ee";
const INK_SOFT = "#4a5b8f";
const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ui-sans-serif, system-ui, sans-serif";

const SITE_URL = "https://saeac.org";

function shell(opts: {
  eyebrow: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
}): string {
  const { eyebrow, heading, bodyHtml, ctaLabel, ctaHref } = opts;
  // Body content is assembled as trusted markup by the templates below, but
  // shell fields include admin-entered values such as a fixture name. Escape
  // them at the final HTML boundary before placing them in text or attributes.
  const safeEyebrow = escapeHtml(eyebrow);
  const safeHeading = escapeHtml(heading);
  const safeCtaLabel = ctaLabel ? escapeHtml(ctaLabel) : null;
  const safeCtaHref = ctaHref ? escapeHtml(ctaHref) : null;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${safeHeading}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT_STACK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safeEyebrow} &#8211; ${safeHeading}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <tr><td style="padding:0 8px 24px;">
          <span style="font-family:${FONT_STACK};font-size:20px;font-weight:800;letter-spacing:-0.01em;color:${NAVY};">SÆAC</span>
        </td></tr>

        <tr><td style="background:#ffffff;border-radius:16px;padding:36px 32px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${INK_SOFT};">
            ${safeEyebrow}
          </p>
          <h1 style="margin:0 0 18px;font-size:24px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;color:${NAVY};">
            ${safeHeading}
          </h1>
          <div style="font-size:15px;line-height:1.6;color:#1a1a2e;">
            ${bodyHtml}
          </div>
          ${
            safeCtaLabel && safeCtaHref
              ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                  <tr><td style="border-radius:999px;background:${GOLD};">
                    <a href="${safeCtaHref}" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:${NAVY};text-decoration:none;">
                      ${safeCtaLabel}
                    </a>
                  </td></tr>
                </table>`
              : ""
          }
        </td></tr>

        <tr><td style="padding:22px 8px 0;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${INK_SOFT};">
            Senator Asuquo Ekpenyong Academic Championship &middot; Cross River South
            <br />
            <a href="${SITE_URL}" style="color:${NAVY};text-decoration:underline;">saeac.org</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function registrationSubmittedEmail(schoolName: string) {
  return {
    subject: "We have received your registration",
    html: shell({
      eyebrow: "School Registration",
      heading: "Registration received",
      bodyHtml: `
        <p style="margin:0 0 14px;">Dear Coordinator,</p>
        <p style="margin:0 0 14px;">
          Thank you for submitting <strong>${escapeHtml(schoolName)}</strong>'s registration
          for the Senator Asuquo Ekpenyong Academic Championship. The Organising
          Committee has it now and will review it shortly.
        </p>
        <p style="margin:0;">
          You do not need to do anything further while it is under review. If the
          committee needs a correction, you will hear from us with exactly what to
          change.
        </p>`,
      ctaLabel: "View your registration",
      ctaHref: `${SITE_URL}/portal/school`,
    }),
  };
}

export function registrationApprovedEmail(schoolName: string, registrationNo: string) {
  return {
    subject: `${safeSubjectPart(schoolName)} is registered — ${safeSubjectPart(registrationNo)}`,
    html: shell({
      eyebrow: "School Registration &middot; Approved",
      heading: "Your school is registered",
      bodyHtml: `
        <p style="margin:0 0 14px;">Dear Coordinator,</p>
        <p style="margin:0 0 14px;">
          <strong>${escapeHtml(schoolName)}</strong> is registered for the championship.
          Your official registration number is:
        </p>
        <p style="margin:0 0 14px;padding:14px 18px;background:${PAPER};border-radius:10px;font-size:20px;font-weight:800;letter-spacing:0.02em;color:${NAVY};">
          ${escapeHtml(registrationNo)}
        </p>
        <p style="margin:0;">
          Next, build your team: three Strikers and two Assists, with consent
          recorded for each student. You can do this any time before the deadline
          from your school dashboard.
        </p>`,
      ctaLabel: "Build your team",
      ctaHref: `${SITE_URL}/portal/school/team`,
    }),
  };
}

export function registrationChangesRequestedEmail(schoolName: string, reason: string) {
  return {
    subject: `Action needed on ${safeSubjectPart(schoolName)}'s registration`,
    html: shell({
      eyebrow: "School Registration &middot; Changes requested",
      heading: "One thing to correct",
      bodyHtml: `
        <p style="margin:0 0 14px;">Dear Coordinator,</p>
        <p style="margin:0 0 14px;">
          The committee has reviewed <strong>${escapeHtml(schoolName)}</strong>'s
          registration and asks for the following before it can be approved:
        </p>
        <p style="margin:0 0 14px;padding:14px 18px;background:#fef4ed;border-left:3px solid #f44423;border-radius:6px;color:#7a2510;">
          ${escapeHtml(reason)}
        </p>
        <p style="margin:0;">
          Make the change from your dashboard and resubmit. There is no need to
          start again.
        </p>`,
      ctaLabel: "Update your registration",
      ctaHref: `${SITE_URL}/portal/school/register`,
    }),
  };
}

export function registrationRejectedEmail(schoolName: string, reason: string) {
  return {
    subject: `Update on ${safeSubjectPart(schoolName)}'s registration`,
    html: shell({
      eyebrow: "School Registration",
      heading: "Registration not accepted",
      bodyHtml: `
        <p style="margin:0 0 14px;">Dear Coordinator,</p>
        <p style="margin:0 0 14px;">
          The committee has reviewed <strong>${escapeHtml(schoolName)}</strong>'s
          registration and it was not accepted, for this reason:
        </p>
        <p style="margin:0 0 14px;padding:14px 18px;background:#fef4ed;border-left:3px solid #f44423;border-radius:6px;color:#7a2510;">
          ${escapeHtml(reason)}
        </p>
        <p style="margin:0;">
          If you believe this is a mistake, or your circumstances have changed,
          contact the Organising Committee directly.
        </p>`,
      ctaLabel: "Contact the committee",
      ctaHref: `${SITE_URL}/contact`,
    }),
  };
}

export function scheduleChangedEmail(opts: {
  schoolName: string;
  fixtureName: string;
  field: "scheduled_at" | "venue";
  oldValue: string | null;
  newValue: string | null;
  reason: string;
}) {
  const { schoolName, fixtureName, field, oldValue, newValue, reason } = opts;
  const fieldLabel = field === "scheduled_at" ? "Time" : "Venue";
  return {
    subject: `Schedule change: ${safeSubjectPart(fixtureName)}`,
    html: shell({
      eyebrow: "Schedule change",
      heading: `${fixtureName} has moved`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Dear Coordinator,</p>
        <p style="margin:0 0 14px;">
          A fixture <strong>${escapeHtml(schoolName)}</strong> is taking part in has
          changed:
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;width:100%;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:${INK_SOFT};width:90px;">${fieldLabel} was</td>
            <td style="padding:8px 0;text-decoration:line-through;color:${INK_SOFT};">${escapeHtml(oldValue ?? "not set")}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:${INK_SOFT};">${fieldLabel} is now</td>
            <td style="padding:8px 0;font-weight:700;color:${NAVY};">${escapeHtml(newValue ?? "not set")}</td>
          </tr>
        </table>
        <p style="margin:0 0 14px;padding:14px 18px;background:${PAPER};border-radius:10px;color:#1a1a2e;">
          <strong>Why:</strong> ${escapeHtml(reason)}
        </p>
        <p style="margin:0;">Please plan travel around the new details.</p>`,
      ctaLabel: "View the schedule",
      ctaHref: `${SITE_URL}/schedule`,
    }),
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Remove control characters before a value is used in a mail subject. */
function safeSubjectPart(value: string): string {
  return value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").trim().slice(0, 180);
}
