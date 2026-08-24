-- SAEAC — make the append-only tables append-only at the grant level too.
--
-- RLS already refuses updates and deletes on these, because no policy permits
-- either. But PostgREST grants anon and authenticated full table rights by
-- default, so the only thing standing between a client and a rewritten score is
-- the absence of a policy. That is correct, and it is also one accidental
-- `for all` policy away from being wrong.
--
-- Revoking the grants means an edit is refused before policy evaluation is even
-- reached. Official results are reproducible from these logs, so they are worth
-- two locks rather than one.

revoke update, delete, truncate on match_events from anon, authenticated;
revoke update, delete, truncate on audit_log from anon, authenticated;
revoke update, delete, truncate on fixture_changes from anon, authenticated;

-- Nothing outside the database writes a schedule change: the trigger does.
revoke insert on fixture_changes from anon;

-- The standings view is derived from match_events and must never be written to.
revoke insert, update, delete on match_standings from anon, authenticated;
