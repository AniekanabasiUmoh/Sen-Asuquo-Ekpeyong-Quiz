# SAEAC Website — Handover

Operational reference for whoever runs this site after this build. If you are
picking this project up cold, read this file before touching anything else.

For the phase-by-phase build history and what remains, see
[`../saeac-v2/SAEAC-PHASES-AND-SPRINTS.md`](../saeac-v2/SAEAC-PHASES-AND-SPRINTS.md).
This file is the "how do I actually run and operate it" companion to that
one.

## What this is

The public website and portal for the Senator Asuquo Ekpenyong Academic
Championship (SAEAC) — Next.js (App Router) on the frontend, Supabase
(Postgres, Auth, Storage, Realtime) on the backend. One codebase serves the
public marketing site, the school registration portal, the committee's
admin tools, and the live match/scoreboard experience.

## Accounts you need

| What | Where | Notes |
|---|---|---|
| Supabase project | `lmohoeikidbsiioabmsz`, region `eu-west-1` | Dashboard login needed for: personal access tokens (`supabase link`), physical backups/PITR, and anything under Project Settings. The service-role key alone does **not** grant this — it authenticates to the *data* API, not the *management* API. |
| Vercel | Project deploy target | Connect the GitHub repo; env vars below must be set there too, Vercel does not read `.env.local`. |
| Resend | Transactional email | **Not yet set up.** See "Email" below — the code is finished and waiting, only the account and key are missing. |
| Domain (saeac.org) | Registrar | Needed for Resend's SPF/DKIM verification before real email delivery works, and for the site itself once ready to go live at the real domain. |

## Environment variables

See [`.env.example`](.env.example) for the full annotated list. Two things
worth knowing that are easy to get wrong:

- The project ref in `SUPABASE_URL` has a **double `i`**:
  `lmohoeikidbsiioabmsz`. An earlier, wrong single-`i` version circulated in
  some early notes — if a config file or a memory of this project has the
  single-`i` version, it's stale.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security entirely. It must
  never be prefixed `NEXT_PUBLIC_` and must never end up in a client
  component. Every place it is used in this codebase is a server action or a
  server-only module (`lib/auth.ts`, `lib/email.ts`, admin actions using
  `createAdminClient()`).

## Running it locally

```bash
cd calabar-quiz-demo
npm install
cp .env.example .env.local   # fill in the real values
npm run dev
```

## The database

All schema lives in [`supabase/migrations/`](supabase/migrations/), applied
in filename order. **The Supabase CLI's `supabase db push` needs a personal
access token this project has not had access to** — every migration so far
was applied by connecting directly to Postgres instead (see
[`supabase/README.md`](supabase/README.md) for the exact method). Either
path is fine; `db push` is just more convenient once you have CLI access.

Two verification scripts exist and should both pass before trusting a schema
change:

```bash
python supabase/test_rls.py       # 17 checks: auth flow, RLS boundaries
python supabase/test_phase3.py    # scoring, publication, visibility
```

Row Level Security is the actual security boundary in this app, not the
Next.js layer. Every table has RLS enabled *and forced* — check
`supabase/migrations/20260823000200_rls.sql` onward for the pattern before
adding a new table without it.

## Email (not yet live)

Registration confirmations and schedule-change notices are fully coded —
templates, an Edge Function, and every call site — but nothing sends yet,
because there is no Resend account or API key. This was a deliberate,
explicitly-flagged gap, not an oversight.

To activate:

```bash
cd calabar-quiz-demo
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx
npx supabase secrets set RESEND_FROM_ADDRESS="SAEAC <registrations@saeac.org>"
npx supabase functions deploy send-email
```

See [`supabase/functions/send-email/index.ts`](supabase/functions/send-email/index.ts)
for the full explanation, including the DNS (SPF/DKIM) step Resend requires
before it will deliver from `saeac.org`.

## Event-day operations

- **Accreditation / check-in**: `/portal/admin/accreditation`, scans a QR
  code with any staff member's phone camera (no app, no dedicated hardware).
  `/portal/admin/accreditation/badges` prints codes — this is the stopgap
  for getting a badge to someone before the confirmation email is active.
- **Live scoreboard**: `/portal/match/[id]` is the quizmaster's scoring
  console; `/live/[id]` is what the public and the venue screen show. Scores
  are computed from an append-only event log (`match_events`), never edited
  directly — a mistake is corrected by recording an `adjustment` event with
  a reason, not by changing history.
- **Broadcast**: `/portal/admin/broadcast` manages the YouTube embed and any
  simulcast links (Facebook, TikTok, etc). "Mark live" / "Mark ended"
  controls what the public page shows; YouTube auto-archives the stream on
  its own once it ends, so there is nothing to do there.
- **Load testing**: a k6 script exists at
  [`supabase/load-test.js`](supabase/load-test.js) but has **not been run**
  against the live project — it sends real traffic and needs a deliberate
  decision about when to run it, not an automated trigger. Read the comment
  at the top before running it.
- **Backups**: physical backups / point-in-time recovery need the Supabase
  dashboard (Project Settings → Database → Backups) and, depending on the
  project's plan tier, may need an upgrade. This has not been configured —
  it needs dashboard access this build did not have.

## Admin access

One `super_admin` account exists: `saeacadmin2026@saeac.org`. Grant further
committee/admin roles from `/portal/admin/users` once signed in — do not
create additional accounts by editing the database directly, the
`user_roles` table's RLS is deliberately closed to everything except that
page and the initial signup trigger.

## Design system

Colour, type and component conventions are established, not up for
reinterpretation per-page:

- Navy `#003090`, gold `#f0a800` — the working pair used everywhere in the
  built app. (Note: this differs slightly from the brand deck's pure
  `#0006EB`; `#003090` was the value the Phase 0 homepage variants
  standardised on, and everything since has matched it for consistency
  rather than reverting to the deck's exact hex.)
- Type: `Lama Sans` / `Lama Sans Condensed` for display and UI,
  `Libre Caslon Cond` for the serif accent. See `app/globals.css` for the
  full token list (`--color-*`, `--font-*`).
- Cards: `rounded-[24px]` or `rounded-[28px]`, never a smaller radius on a
  content card. Buttons are full pills (`rounded-full`).
- No em dashes in user-facing copy — a house style set from the first pages
  built and kept consistent since.
- Form primitives (`components/form.tsx`) and email templates
  (`supabase/functions/send-email/_shared/templates.ts`) both document their
  own design decisions inline; read those comments before changing either.
