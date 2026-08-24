-- SAEAC — fix: anonymous clients could append to audit_log.
--
-- The original policy allowed `actor_id is null` so that system-generated
-- events could be logged without a user. But the anon role satisfies that
-- condition, which let anyone holding the public browser key insert arbitrary
-- audit rows. In a system whose value rests on a trustworthy audit trail, a
-- forgeable trail is worse than none.
--
-- Corrected rule: only an authenticated user may append, and only attributed
-- to themselves. Genuine system events are written with the service-role key,
-- which bypasses RLS anyway and therefore needs no policy.

drop policy if exists audit_append on audit_log;

create policy audit_append on audit_log for insert
  to authenticated
  with check (actor_id = auth.uid());

-- Belt and braces: revoke the table-level grants PostgREST hands the anon
-- role, so an insert is refused before policy evaluation is even reached.
revoke insert, update, delete on audit_log from anon;
