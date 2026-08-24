-- SAEAC — Phase 5 sprint 5.2: progression and attendance reporting.
--
-- Registration reporting already exists (registration_report()). These two
-- fill the rest of what the roadmap names: how many schools survive each
-- stage, and who actually showed up. Both admin-only, security definer, same
-- shape as registration_report() — a non-admin caller gets zero rows rather
-- than an error, so there is nothing to distinguish "no data" from "not
-- allowed" for someone probing the boundary.

/**
 * Schools remaining at each stage, in stage order.
 *
 * `advanced` on results is the source of truth for whether a school continued
 * past a fixture; `entered` counts every school with a published result at
 * that stage regardless of outcome, so a funnel chart can show both the field
 * size and the survivors at each step.
 */
create or replace function progression_report()
returns table (
  stage_ordinal integer,
  stage_name text,
  entered integer,
  advanced integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    st.ordinal,
    st.name,
    count(distinct r.school_id)::integer,
    count(distinct r.school_id) filter (where r.advanced)::integer
  from stages st
  left join fixtures f on f.stage_id = st.id
  left join results r on r.fixture_id = f.id and r.status = 'published'
  where exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role in ('super_admin', 'committee')
  )
  group by st.id, st.ordinal, st.name
  order by st.ordinal;
$$;

grant execute on function progression_report() to authenticated;

/**
 * Check-in rate by accreditation type, for event-day attendance.
 *
 * A rate rather than a raw count where possible: "38 of 45 students checked
 * in" is what the committee actually wants to read on the day, not two
 * numbers to do the division on themselves.
 */
create or replace function attendance_report()
returns table (
  holder_type accreditation_holder,
  issued integer,
  checked_in integer,
  revoked integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    a.holder_type,
    count(*)::integer,
    count(*) filter (where a.checked_in_at is not null)::integer,
    count(*) filter (where a.revoked_at is not null)::integer
  from accreditations a
  where exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role in ('super_admin', 'committee')
  )
  group by a.holder_type
  order by a.holder_type;
$$;

grant execute on function attendance_report() to authenticated;
