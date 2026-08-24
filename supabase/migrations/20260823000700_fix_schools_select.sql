-- SAEAC — fix: a school could not read back the row it had just inserted.
--
-- The original SELECT policy delegated ownership to owns_school(id), which
-- queries the schools table. During an INSERT ... RETURNING, the new row is not
-- yet visible to that subquery, so the ownership test found nothing, the SELECT
-- policy did not match, and Postgres reported the whole statement as an RLS
-- violation on insert. The insert itself was always fine, which made the error
-- message actively misleading.
--
-- Fix: test owner_id directly against auth.uid() on the row being read. The
-- coach path still needs the subquery, but it is now an OR branch rather than
-- the only route, so a newly created draft matches on ownership immediately.

drop policy if exists schools_read_public on schools;

create policy schools_read_public on schools for select
  using (
    status = 'approved'
    or owner_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from coaches c
      where c.school_id = schools.id and c.user_id = auth.uid()
    )
  );

-- Same trap on UPDATE ... RETURNING: check ownership on the row itself.
drop policy if exists schools_update_own on schools;

create policy schools_update_own on schools for update
  using (
    is_admin()
    or (
      (owner_id = auth.uid()
       or exists (select 1 from coaches c
                  where c.school_id = schools.id and c.user_id = auth.uid()))
      and status in ('draft', 'changes_requested', 'submitted')
    )
  )
  with check (
    is_admin()
    or owner_id = auth.uid()
    or exists (select 1 from coaches c
               where c.school_id = schools.id and c.user_id = auth.uid())
  );
