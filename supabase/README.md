# Supabase — SAEAC

Project ref: `lmohoeikidbsiioabmsz` · region `eu-west-1`

## Applying the migrations

**All migrations have been applied to the hosted project and verified.** The
seven LGAs, seven stages and seven subjects are seeded; no school, user or audit
row exists yet.

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

Run in order. The seed is safe to re-run; the schema migrations are not.

Migrations 4, 7 and 8 exist because `test_rls.py` caught real bugs after the
first three were applied. They are kept as separate files rather than folded
into the originals so the applied database and this directory stay in step.

## Testing RLS

```
python supabase/test_rls.py
```

Walks a registration from sign-up to approval as three different roles and
checks 17 boundaries. It cleans up after itself, and purges leftovers at the
start, so it is safe to re-run. **Run it after any change to a policy or to the
registration flow.**

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

- **ESLint does not run** in this repo: a transitive dependency under
  `es-abstract` fails to resolve (`object.fromentries/implementation.js`). This
  predates the Supabase work and affects every file, including untouched Phase 1
  pages. `npx tsc --noEmit` is clean and is the check to rely on meanwhile.
- The service-role key and DB password are in plaintext in the workspace-root
  `.env`. Rotate before go-live; deferred by decision during Sprint 2.1.
