-- Atomic match setup for event-day administration.
-- Apply only after the Supabase project owner confirms the target project.

create or replace function create_match_setup(
  target_fixture uuid,
  target_name text,
  target_school_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  created_match uuid;
begin
  if not is_admin() then
    raise exception 'only the committee may create a match';
  end if;
  if target_fixture is null then
    raise exception 'a fixture is required';
  end if;
  if nullif(trim(target_name), '') is null then
    raise exception 'a match name is required';
  end if;
  if not exists (select 1 from fixtures where id = target_fixture) then
    raise exception 'no such fixture';
  end if;

  insert into matches (fixture_id, name)
  values (target_fixture, trim(target_name))
  returning id into created_match;

  insert into match_rounds (match_id, ordinal, name)
  values
    (created_match, 1, 'Advanced Mathematics and English'),
    (created_match, 2, 'Advanced Science, Art and Commercial'),
    (created_match, 3, 'Advanced Current Affairs Showdown'),
    (created_match, 4, 'Advanced General Knowledge');

  insert into fixture_participants (fixture_id, school_id)
  select target_fixture, ids.school_id
  from unnest(coalesce(target_school_ids, '{}'::uuid[])) as ids(school_id)
  where exists (
    select 1 from schools s
    where s.id = ids.school_id and s.status = 'approved'
  )
  on conflict (fixture_id, school_id) do nothing;

  return created_match;
end;
$$;

revoke all on function create_match_setup(uuid, text, uuid[]) from public;
grant execute on function create_match_setup(uuid, text, uuid[]) to authenticated;
