# Supabase — SAEAC

Project ref: `lmohoeikidbsiioabmsz` · region `eu-west-1`

## Applying the migrations

The core migrations through `20260823002100_chat_author_names.sql` have been
applied to the hosted project and verified. The seven LGAs, seven stages and
seven subjects are seeded. The hosted project also contains the deliberately
seeded demo scenario used for acceptance tests (approved and pending schools, a
five-student roster, matches/events, accreditations, volunteer briefings and
news). Treat those rows as test data: do not alter or delete them during QA.

The eight `2026082600*.sql` migrations are prepared locally but are **not yet
applied** because the current Supabase CLI identity cannot see the project.
Apply them, in order, only after project ownership is corrected and Preview
verification is available.

`supabase link` needs a personal access token, which this environment does not
have, so the migrations were applied over the direct Postgres connection in
`SUPABASE_DB_URL`. Either route works. To apply from a machine that is logged
in to the Supabase CLI:

```
supabase link --project-ref lmohoeikidbsiioabmsz
supabase db push
```

Or paste each file into the SQL Editor in the dashboard, in filename order:

| Order | File | What it does |
|---|---|---|
| 1 | `20260823000100_core_schema.sql` | Enums, tables, indexes, `updated_at` triggers |
| 2 | `20260823000200_rls.sql` | Enables + forces RLS, defines every policy |
| 3 | `20260823000300_seed_reference.sql` | Seven LGAs, seven stages, subjects (idempotent) |
| 4 | `20260823000400_fix_audit_append.sql` | Stops anon appending to the audit trail |
| 5 | `20260823000500_profile_on_signup.sql` | Trigger: profile + default role on sign-up |
| 6 | `20260823000600_registration_number.sql` | `issue_registration_number()` under an advisory lock |
| 7 | `20260823000700_fix_schools_select.sql` | Fixes `INSERT ... RETURNING` for a school's own row |
| 8 | `20260823000800_fix_status_escalation.sql` | Stops a school approving itself; fixes the counter |
| 22 | `20260826000100_content_cms.sql` | FAQ and Downloads/Rules tables with forced RLS |
| 23 | `20260826000200_appeals.sql` | School appeals/disputes workflow with forced RLS |
| 24 | `20260826000300_chat_author_names_anon.sql` | Allows the public live page to call the narrow chat-name RPC |
| 25 | `20260826000400_schedule_visibility.sql` | Hides draft fixture changes, participants and unpublished venue addresses from public REST reads |
| 26 | `20260826000500_consent_governance.sql` | Records consent policy version/actor and preserves withdrawal timestamps |
| 27 | `20260826000600_match_setup_transaction.sql` | Creates matches, rounds and participants atomically |
| 28 | `20260826000700_gallery_tags.sql` | Adds LGA, stage, and content-type taxonomy to gallery items |
| 29 | `20260826000800_volunteer_messages.sql` | Adds the accepted-Change-Maker dashboard communication centre |

Run in order. The seed is safe to re-run; the schema migrations are not.

Migrations 4, 7 and 8 exist because `test_rls.py` caught real bugs after the
first three were applied. They are kept as separate files rather than folded
into the originals so the applied database and this directory stay in step.

## Testing RLS

```
python supabase/test_rls.py
```

Walks a registration from sign-up to approval as three different roles and
checks the RLS boundaries. It scopes assertions to its disposable school and
actors, and only removes rows created by those actors; it does not truncate
the audit trail or assume the hosted database is empty. **Run it after any
change to a policy or to the registration flow.**

It has already earned its keep, catching three bugs that reading the SQL had
missed:

1. `INSERT ... RETURNING` failed for a school's own new row, because the SELECT
   policy delegated ownership to a subquery that could not see the row being
   inserted. This would have broken the wizard's first save.
2. **A school could approve its own registration.** The status guard was in the
   policy's `USING` clause but not its `WITH CHECK`, so a draft row passed the
   test for *which* rows may be updated and nothing then constrained what it
   could be updated *to*.
3. The registration counter misparsed its own numbers and jumped from 9999 to
   1000.

## Regenerating types

`lib/supabase/types.ts` is hand-written and has been **verified column by column
against the live schema**, including nullability. Type generation needs Docker,
which is unavailable here. On a machine with Docker running:

```
npx supabase gen types typescript --project-id lmohoeikidbsiioabmsz > lib/supabase/types.ts
```

Three keys must survive any regeneration or the client silently degrades every
query result to `never`: `Views`, `Functions` and `CompositeTypes`.

## Clients

| File | Key | RLS applies |
|---|---|---|
| `lib/supabase/client.ts` | anon | yes |
| `lib/supabase/server.ts` → `createClient()` | anon | yes |
| `lib/supabase/server.ts` → `createAdminClient()` | service role | **no — bypasses everything** |

`server.ts` imports `server-only`, so importing it from a Client Component is a
build error rather than a runtime credential leak.

## Environment

`.env.local` holds the real values and is gitignored. `.env.example` carries the
names only. The same variables must be set in the Vercel project settings, or
deployed builds will fail at runtime rather than at build time.

Note: the workspace-root `.env` (outside this repo) has the project ref
misspelled in its Postgres user — an extra `i`. `.env.local` uses the correct
ref throughout.

## Known issues

- **ESLint is part of the release gate** and currently passes with the checked-in
  repository configuration. Run `npm run lint` from `calabar-quiz-demo` before
  every deployment.
- The service-role key and DB password are in plaintext in the workspace-root
  `.env`. Rotate before go-live; deferred by decision during Sprint 2.1.
