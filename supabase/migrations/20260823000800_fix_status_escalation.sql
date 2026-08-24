-- SAEAC — two fixes found by the end-to-end test.
--
-- 1. PRIVILEGE ESCALATION: a school could approve its own registration.
--
--    schools_update_own guarded the status in its USING clause but not in its
--    WITH CHECK. USING decides which existing rows may be updated; WITH CHECK
--    decides what they may be updated *to*. A draft row passed USING, and
--    nothing then stopped the new row from having status 'approved' and a
--    self-chosen registration number.
--
--    Fix: a non-admin may only ever leave the row in a status they are allowed
--    to set, and may never write registration_no, approved_at or approved_by.
--    Those three are the committee's to issue.
--
-- 2. The registration counter misparsed its own numbers: regexp_replace with
--    '^.*-' is greedy but the sequence part was read from a string that had
--    already lost its prefix, so SAEAC-2026-9999 yielded 999+1. Take the last
--    four characters explicitly instead.

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
    or (
      (owner_id = auth.uid()
       or exists (select 1 from coaches c
                  where c.school_id = schools.id and c.user_id = auth.uid()))
      -- A school may move its own registration only between these states.
      -- 'approved' and 'rejected' are the committee's to set.
      and status in ('draft', 'submitted', 'withdrawn')
      -- and may never issue itself the marks of approval.
      and registration_no is null
      and approved_at is null
      and approved_by is null
    )
  );

create or replace function issue_registration_number(school uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  prefix text := 'SAEAC-' || extract(year from now())::int || '-';
  existing text;
  next_n integer;
  result text;
begin
  if not exists (
    select 1 from user_roles
    where user_id = auth.uid() and role in ('super_admin', 'committee')
  ) then
    raise exception 'insufficient privilege to issue a registration number';
  end if;

  perform pg_advisory_xact_lock(hashtext('saeac_registration_number'));

  select registration_no into existing
  from schools
  where registration_no like prefix || '%'
  order by registration_no desc
  limit 1;

  -- The sequence is the final four characters, not "everything after the last
  -- dash of a string that has already been truncated".
  next_n := coalesce(nullif(right(coalesce(existing, ''), 4), '')::int, 0) + 1;
  result := prefix || lpad(next_n::text, 4, '0');

  update schools set registration_no = result where id = school;
  return result;
end;
$$;

revoke execute on function issue_registration_number(uuid) from anon;
grant execute on function issue_registration_number(uuid) to authenticated;
