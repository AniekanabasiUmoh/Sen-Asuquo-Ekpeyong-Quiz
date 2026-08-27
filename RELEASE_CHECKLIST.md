# SAEAC release checklist

Last verification: 27 August 2026

## Verified locally

- [x] `npx tsc --noEmit`
- [x] `git diff --check`
- [x] `npm run build` completed and generated the App Router manifest.
- [x] Public browser smoke: `/gallery`, `/news/registration-opens`, and `/results` return 200.
- [x] Public LGA pages render published schools, fixtures, school-level
  results, and the consent-reviewed gallery state; `/gallery` supports LGA,
  stage, and content-type filters.
- [x] Local production-server smoke: `/gallery`, `/downloads`, `/faq`,
  `/schedule`, `/results`, and `/api/health` return 200; unauthenticated
  `/portal/security` redirects to `/login`.
- [x] Schedule calendar export returns `text/calendar` with an attachment filename.
- [x] Public schedule supports stage, LGA and qualifier-group filters plus list/month
  calendar views; calendar view links each fixture to its ICS export.
- [x] Match controls disable while a scoring, substitution, adjustment, or
  state action is pending to reduce duplicate event submissions.
- [x] Live scoreboard has websocket updates plus polling fallback and an
  announced connection state.
- [x] Mobile navigation exposes `aria-controls` and closes on Escape.
- [x] TOTP MFA enrollment and verification UI is available at `/portal/security`.
- [x] High-risk server actions have an optional AAL2 step-up gate controlled by
  `SAEAC_REQUIRE_STEP_UP`.
- [x] Non-sensitive `/api/health` readiness endpoint checks configuration and
  the Supabase dependency without returning database details.
- [x] Public news category filtering, progression-by-stage summary, and live
  chat author resolution use scoped data paths.
- [x] `python supabase/test_rls.py` passes against the seeded project.
- [x] `python supabase/test_phase3.py` passes against the seeded project.
- [x] Local browser acceptance covers all six demo accounts: school admin,
  coach, both judges, super admin, and Change Maker; each lands in the
  expected workspace and the coach sees the assigned school's read-only roster.
- [x] Vercel production deployment for the pushed remediation commit reported
  `READY`; read-only
  smoke checks of `/gallery`, `/downloads`, `/api/health`, `/schedule?view=calendar`,
  and `/results` returned 200, and `/api/health` reported configuration and
  Supabase healthy.
- [x] Post-test production-like counts remain: 2 schools, 5 students, 1 match, 1 volunteer, 0 test results, 0 audit rows.
- [x] Anonymous RLS checks still hide students, pending schools, audit rows, unpublished news, and draft results.
- [x] `npm run lint` completes cleanly with the repository ESLint configuration.
- [x] `npm audit --audit-level=moderate` reports 0 vulnerabilities after
  upgrading the Next.js toolchain to 16.3.3.
- [x] `deno check supabase/functions/send-email/index.ts` passes for the Edge
  Function source.

## Intentionally not release-approved

- [ ] Supabase CLI management ownership: the current CLI identity cannot see
  the SAEAC project. Production migrations were applied through the verified
  direct Postgres pooler URL; Edge Function deployment still needs management
  API access.
- [ ] Vercel Preview variables and isolated Preview database.
- [ ] `send-email` Edge Function deployment and Resend sender-domain approval.
- [ ] Supabase backups/PITR, Vercel alerts, and a restore rehearsal.
- [ ] Register `/api/health` with the chosen uptime/alerting provider and name
  the on-call recipient.
- [ ] MFA enforcement for privileged roles and recovery procedures.
- [ ] Step-up enforcement for high-risk mutations after MFA recovery rehearsal.
- [ ] After two administrators are enrolled and recovery is approved, set
  `SAEAC_REQUIRE_MFA=true` and verify privileged routes require AAL2.
- [ ] Official committee-approved rules PDF, retention period, named committee
  members, sponsor details, and other pending public copy.
- [x] Apply and verify the eight `2026082600*.sql` remediation migrations in
  production. The remote history contains all 29 repository migrations; the
  live RLS and scoring harnesses pass.
- [ ] Full six-account browser acceptance on the deployed URL after deployment.

## Production safety note

The verification scripts create disposable `@test.invalid` users and `Probe`
records. Their assertions and cleanup are scoped to those disposable IDs; they
must not be changed back to global table counts or audit-log truncation.
