-- SAEAC — roster rules, LGA groupings, and public counts.
--
-- Team composition is a competition rule, so it belongs in the database rather
-- than only in the wizard: 5 students per school, 3 Strikers and 2 Assists.
-- The check runs on a *complete* roster only. A school builds its team over
-- several sittings, and refusing to save the first student because there are
-- not yet three Strikers would make the form unusable.

-- Cap the roster at five. Deferred to statement end so reordering a roster in
-- one transaction does not trip over itself.
create or replace function enforce_roster_size()
returns trigger
language plpgsql
as $$
declare
  n integer;
  target uuid := coalesce(new.school_id, old.school_id);
begin
  select count(*) into n from students where school_id = target;
  if n > 5 then
    raise exception 'a school may enter at most 5 students (3 Strikers and 2 Assists)';
  end if;
  return null;
end;
$$;

drop trigger if exists students_roster_size on students;
create constraint trigger students_roster_size
  after insert or update on students
  deferrable initially deferred
  for each row execute function enforce_roster_size();

/**
 * Is this school's roster complete and valid?
 *
 * Used by the dashboard and by the committee's view. Not a constraint: an
 * incomplete roster is a normal state right up until the school says it is
 * finished.
 */
create or replace function roster_status(target uuid)
returns table (total integer, strikers integer, assists integer, is_valid boolean)
language sql
stable
as $$
  select
    count(*)::integer,
    count(*) filter (where is_striker)::integer,
    count(*) filter (where not is_striker)::integer,
    (count(*) = 5
     and count(*) filter (where is_striker) = 3
     and count(*) filter (where not is_striker) = 2)
  from students
  where school_id = target;
$$;

-- ---------------------------------------------------------------------------
-- Public counts for the homepage
-- ---------------------------------------------------------------------------

/**
 * Registered-school and student counts, safe to expose publicly.
 *
 * A view rather than a direct count so the public never needs read access to
 * the students table. security_invoker is off deliberately: the function runs
 * with the definer's rights and returns only aggregates, never rows.
 *
 * NOTE: these are live figures. The homepage's published "250+ schools" and
 * "10,000+ students" are the client's approved projections and are a separate
 * thing; see the comment above `stats` in content/homepage.ts. Do not quietly
 * replace one with the other.
 */
create or replace function public_counts()
returns table (
  approved_schools integer,
  participating_lgas integer,
  registered_students integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from schools where status = 'approved')::integer,
    (select count(distinct lga_id) from schools where status = 'approved')::integer,
    (select count(*) from students s
       join schools sc on sc.id = s.school_id
      where sc.status = 'approved')::integer;
$$;

grant execute on function public_counts() to anon, authenticated;

/**
 * Approved schools per LGA, for the LGA pages and the admin groupings view.
 * Counts only, no school identities, so it is safe for anon.
 */
create or replace function lga_registration_counts()
returns table (
  lga_id uuid,
  lga_name text,
  qualifier_group text,
  approved integer,
  pending integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    l.id,
    l.name,
    l.qualifier_group,
    count(s.*) filter (where s.status = 'approved')::integer,
    count(s.*) filter (where s.status in ('submitted','under_review'))::integer
  from lgas l
  left join schools s on s.lga_id = l.id
  group by l.id, l.name, l.qualifier_group, l.sort_order
  order by l.sort_order;
$$;

grant execute on function lga_registration_counts() to anon, authenticated;
