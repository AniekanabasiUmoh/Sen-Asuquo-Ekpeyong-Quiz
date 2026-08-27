# SAEAC Website

The public website and authenticated portal for the Senator Asuquo Ekpenyong
Academic Championship (SAEAC). It is a Next.js App Router application backed
by Supabase Auth, Postgres, Storage and Realtime, deployed through Vercel.

## Run locally

```bash
cd calabar-quiz-demo
npm install
cp .env.example .env.local
# fill .env.local with the project values
npm run dev
```

Open <http://localhost:3000>. Public pages render safe empty/fallback states
when optional Supabase data is unavailable; authenticated portals require the
server and public Supabase variables.

## Main routes

- Public: `/`, `/about`, `/competition`, `/eligibility`, `/lgas`,
  `/schedule`, `/results`, `/live`, `/gallery`, `/downloads`, `/faq`, `/news`,
  `/hall-of-fame`, `/contact`, and `/get-involved`.
- Authentication: `/login`, `/signup`, and `/forgot-password`.
- School workspace: `/portal/school`, `/portal/school/team`,
  `/portal/school/register`, and `/portal/school/appeals`.
- Committee workspace: `/portal/admin` and its schedule, match, accreditation,
  broadcast, content, gallery, news, sponsor, volunteer, user, appeal and
  reporting tools.
- Judge and event workspace: `/portal/match`; Change Maker workspace:
  `/portal/volunteer`.

## Supabase

Schema changes live in `supabase/migrations/` and must be applied in filename
order. The eight `2026082600*.sql` remediation migrations are intentionally
pending until the project owner grants CLI access and an isolated Preview
database is available. Never put `SUPABASE_SERVICE_ROLE_KEY` in a client
component or in a `NEXT_PUBLIC_` variable.

The data-boundary regression checks are:

```bash
python supabase/test_rls.py
python supabase/test_phase3.py
```

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
npm audit --omit=dev --audit-level=moderate
git diff --check
```

`/api/health` is a non-sensitive readiness check for monitoring. It reports
configuration and Supabase availability without credentials or database error
details.

## Release status

The implementable remediation work is in the pushed `main` branch. The
production web deployment is Vercel Ready. Applying the pending migrations,
deploying the `send-email` Edge Function, configuring Resend, Preview
variables, backups/alerts, MFA recovery and committee-approved copy remain
owner-controlled release gates. See [HANDOVER.md](HANDOVER.md) and
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for the evidence and exact
sequence; do not invent those values or bypass those gates.

The original homepage concepts and design history remain in the sibling
`saeac-v2` directory and in the phase plan.
