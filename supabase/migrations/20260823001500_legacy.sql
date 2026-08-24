-- SAEAC — Phase 5: post-competition and legacy.
--
-- The championship is meant to run every year, so the schema has to hold more
-- than one edition from the start. Retro-fitting a season key after a first
-- year of data is the kind of migration nobody enjoys.

create table if not exists seasons (
  id         uuid primary key default gen_random_uuid(),
  year       integer not null unique,
  name       text not null,
  starts_on  date,
  ends_on    date,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into seasons (year, name, is_current)
values (2026, '2026 Maiden Edition', true)
on conflict (year) do nothing;

-- Only one season can be current. A partial unique index says so once, rather
-- than every caller remembering to unset the last one.
create unique index if not exists seasons_one_current
  on seasons ((is_current)) where is_current;

create type award_kind as enum (
  'champion',
  'runner_up',
  'third_place',
  'top_student',
  'best_coach',
  'best_lga',
  'consolation',
  'special'
);

create table if not exists awards (
  id          uuid primary key default gen_random_uuid(),
  season_id   uuid not null references seasons (id) on delete cascade,
  kind        award_kind not null,
  title       text not null,
  description text,
  school_id   uuid references schools (id) on delete set null,
  student_id  uuid references students (id) on delete set null,
  coach_id    uuid references coaches (id) on delete set null,
  -- Prize value as awarded, in naira. Recorded rather than derived so the
  -- published prize table and what was actually given can be compared later.
  prize_value numeric(12, 2),
  prize_note  text,
  publish     publish_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists awards_season_idx on awards (season_id);

/**
 * Prize fulfilment.
 *
 * Separate from the award: winning is one event, receiving is another, and the
 * gap between them is exactly what a legacy project needs to track. The ICT
 * centre promised to the champion's LGA is a year of work, not a cheque.
 */
create table if not exists prize_fulfilment (
  id           uuid primary key default gen_random_uuid(),
  award_id     uuid not null references awards (id) on delete cascade,
  status       text not null default 'pending',
  due_on       date,
  delivered_on date,
  note         text,
  recorded_by  uuid references profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists legacy_projects (
  id          uuid primary key default gen_random_uuid(),
  season_id   uuid references seasons (id) on delete set null,
  lga_id      uuid references lgas (id) on delete set null,
  title       text not null,
  description text,
  status      text not null default 'planned',
  started_on  date,
  completed_on date,
  publish     publish_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

do $$
declare t text;
begin
  foreach t in array array['seasons','awards','prize_fulfilment','legacy_projects']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
  end loop;
end;
$$;

drop policy if exists seasons_read on seasons;
create policy seasons_read on seasons for select using (true);
drop policy if exists seasons_write on seasons;
create policy seasons_write on seasons for all
  to authenticated using (is_admin()) with check (is_admin());

-- The Hall of Fame is the public face of this, so published awards are public.
drop policy if exists awards_read on awards;
create policy awards_read on awards for select
  using (publish = 'published' or is_admin());
drop policy if exists awards_write on awards;
create policy awards_write on awards for all
  to authenticated using (is_admin()) with check (is_admin());

-- Fulfilment is internal: who has and has not received their prize is not a
-- public matter while it is still outstanding.
drop policy if exists prize_fulfilment_read on prize_fulfilment;
create policy prize_fulfilment_read on prize_fulfilment for select
  using (is_admin());
drop policy if exists prize_fulfilment_write on prize_fulfilment;
create policy prize_fulfilment_write on prize_fulfilment for all
  to authenticated using (is_admin()) with check (is_admin());

drop policy if exists legacy_read on legacy_projects;
create policy legacy_read on legacy_projects for select
  using (publish = 'published' or is_admin());
drop policy if exists legacy_write on legacy_projects;
create policy legacy_write on legacy_projects for all
  to authenticated using (is_admin()) with check (is_admin());

do $$
declare t text;
begin
  foreach t in array array['seasons','awards','prize_fulfilment','legacy_projects']
  loop
    execute format('drop trigger if exists %I_set_updated_at on %I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on %I
         for each row execute function set_updated_at()', t, t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reporting
-- ---------------------------------------------------------------------------

/**
 * Registration and participation summary for the committee's reports.
 *
 * Admin only: it counts drafts and rejections, which are not public business.
 */
create or replace function registration_report()
returns table (
  lga_name text,
  eligible integer,
  drafts integer,
  submitted integer,
  approved integer,
  rejected integer,
  students integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    l.name,
    l.school_count,
    count(s.*) filter (where s.status = 'draft')::integer,
    count(s.*) filter (where s.status in ('submitted','under_review'))::integer,
    count(s.*) filter (where s.status = 'approved')::integer,
    count(s.*) filter (where s.status = 'rejected')::integer,
    (select count(*) from students st
       join schools s2 on s2.id = st.school_id
      where s2.lga_id = l.id)::integer
  from lgas l
  left join schools s on s.lga_id = l.id
  where exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role in ('super_admin','committee')
  )
  group by l.id, l.name, l.school_count, l.sort_order
  order by l.sort_order;
$$;

grant execute on function registration_report() to authenticated;
