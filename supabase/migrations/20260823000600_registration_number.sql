-- SAEAC — atomic registration-number issue.
--
-- Reading MAX(registration_no) in application code and adding one is a
-- race: two committee members approving at the same moment read the same
-- maximum and mint the same number. The unique index would reject the second
-- write, so the approval would fail with a confusing error rather than simply
-- taking the next number.
--
-- A transaction-scoped advisory lock serialises the read-and-write. The lock
-- is released automatically when the transaction ends, including on error.

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
  -- Only the committee may issue a number. security definer bypasses RLS, so
  -- the check has to be explicit here.
  if not exists (
    select 1 from user_roles
    where user_id = auth.uid() and role in ('super_admin', 'committee')
  ) then
    raise exception 'insufficient privilege to issue a registration number';
  end if;

  -- One well-known key for this counter; any concurrent caller waits here.
  perform pg_advisory_xact_lock(hashtext('saeac_registration_number'));

  select registration_no into existing
  from schools
  where registration_no like prefix || '%'
  order by registration_no desc
  limit 1;

  next_n := coalesce(nullif(regexp_replace(coalesce(existing, ''), '^.*-', ''), '')::int, 0) + 1;
  result := prefix || lpad(next_n::text, 4, '0');

  update schools set registration_no = result where id = school;
  return result;
end;
$$;

revoke execute on function issue_registration_number(uuid) from anon;
grant execute on function issue_registration_number(uuid) to authenticated;
