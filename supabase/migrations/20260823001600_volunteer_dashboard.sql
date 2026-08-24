-- SAEAC — Phase 3 sprint 3.4: Change Maker (volunteer) self-service dashboard.
--
-- volunteers already exists with an application-status flow (applied,
-- accepted, declined, withdrawn) and RLS that lets an applicant read their own
-- row. What is missing is something for an *accepted* Change Maker to actually
-- see: which shift they are on, and the briefing material for it. Both are
-- deliberately small tables — this is a one-day-a-year volunteer programme,
-- not a rostering system, and modelling it as one would be solving a problem
-- nobody has.

create table if not exists volunteer_shifts (
  id          uuid primary key default gen_random_uuid(),
  fixture_id  uuid references fixtures (id) on delete set null,
  title       text not null,
  location    text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- A volunteer may be assigned to more than one shift (the LGA qualifier and
-- the Grand Finale, say), and a shift naturally has several volunteers, hence
-- the join table rather than a shift_id column on volunteers.
create table if not exists volunteer_shift_assignments (
  id           uuid primary key default gen_random_uuid(),
  shift_id     uuid not null references volunteer_shifts (id) on delete cascade,
  volunteer_id uuid not null references volunteers (id) on delete cascade,
  role         text,
  created_at   timestamptz not null default now(),
  unique (shift_id, volunteer_id)
);

/**
 * Briefing material for Change Makers.
 *
 * `audience` narrows a briefing to one shift, or leaves it general (null) for
 * things every volunteer should read (what to wear, where to check in). Kept
 * as a body of text rather than a file: most briefings are a paragraph of
 * instructions, and a text field the committee can edit from the admin page
 * beats a PDF someone has to re-upload for a one-line correction.
 */
create table if not exists volunteer_briefings (
  id          uuid primary key default gen_random_uuid(),
  shift_id    uuid references volunteer_shifts (id) on delete cascade,
  title       text not null,
  body        text not null,
  publish     publish_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists volunteer_shift_assignments_volunteer_idx
  on volunteer_shift_assignments (volunteer_id);
create index if not exists volunteer_briefings_shift_idx
  on volunteer_briefings (shift_id);

alter table volunteer_shifts enable row level security;
alter table volunteer_shifts force row level security;
alter table volunteer_shift_assignments enable row level security;
alter table volunteer_shift_assignments force row level security;
alter table volunteer_briefings enable row level security;
alter table volunteer_briefings force row level security;

-- Shifts themselves carry no sensitive detail (title, venue, time), so any
-- signed-in Change Maker may see the full roster of shifts, the same way a
-- staff noticeboard is not restricted to only the shifts you personally work.
drop policy if exists volunteer_shifts_read on volunteer_shifts;
create policy volunteer_shifts_read on volunteer_shifts for select
  to authenticated using (true);
drop policy if exists volunteer_shifts_write on volunteer_shifts;
create policy volunteer_shifts_write on volunteer_shifts for all
  to authenticated using (is_admin()) with check (is_admin());

-- Assignments name who is doing what, which is only that volunteer's business
-- (and the committee's).
drop policy if exists volunteer_shift_assignments_read on volunteer_shift_assignments;
create policy volunteer_shift_assignments_read on volunteer_shift_assignments for select
  to authenticated
  using (
    is_admin()
    or exists (select 1 from volunteers v
               where v.id = volunteer_shift_assignments.volunteer_id
                 and v.user_id = auth.uid())
  );
drop policy if exists volunteer_shift_assignments_write on volunteer_shift_assignments;
create policy volunteer_shift_assignments_write on volunteer_shift_assignments for all
  to authenticated using (is_admin()) with check (is_admin());

drop policy if exists volunteer_briefings_read on volunteer_briefings;
create policy volunteer_briefings_read on volunteer_briefings for select
  to authenticated using (publish = 'published' or is_admin());
drop policy if exists volunteer_briefings_write on volunteer_briefings;
create policy volunteer_briefings_write on volunteer_briefings for all
  to authenticated using (is_admin()) with check (is_admin());

do $$
declare t text;
begin
  foreach t in array array['volunteer_shifts','volunteer_briefings']
  loop
    execute format('drop trigger if exists %I_set_updated_at on %I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on %I
         for each row execute function set_updated_at()', t, t);
  end loop;
end;
$$;
