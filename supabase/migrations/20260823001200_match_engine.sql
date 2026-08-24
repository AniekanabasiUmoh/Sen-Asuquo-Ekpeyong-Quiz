-- SAEAC — Phase 3 sprints 3.2/3.3: match operation, scoring and results.
--
-- Design rule from the roadmap: every official result must be reproducible from
-- stored events. Scores are therefore never a bare number someone typed. They
-- are the sum of match_events, each of which records who answered, in what
-- role, and what it was worth. A disputed final table can then be recomputed
-- rather than argued over.
--
-- The football metaphor is brand-sanctioned and load-bearing here, not
-- decoration: Strikers answer, Assists are worth half a point, the Coach may
-- substitute, and a VAR answer scores nothing. All four are modelled.

create type match_event_type as enum (
  'striker_correct',
  'striker_wrong',
  'striker_pass',
  'assist_correct',
  'assist_wrong',
  'substitution',
  'var_referral',
  'penalty',
  'adjustment'
);

create type match_status as enum ('pending', 'live', 'paused', 'completed', 'abandoned');

create table matches (
  id           uuid primary key default gen_random_uuid(),
  fixture_id   uuid not null references fixtures (id) on delete cascade,
  name         text not null,
  status       match_status not null default 'pending',
  current_round integer not null default 1,
  started_at   timestamptz,
  ended_at     timestamptz,
  -- Results stay invisible to the public until the committee publishes them.
  publish      publish_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on matches (fixture_id);

create table match_rounds (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references matches (id) on delete cascade,
  ordinal     integer not null,
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  unique (match_id, ordinal)
);

/**
 * Every scoring event, append-only in practice.
 *
 * `points` is numeric because an Assist is worth 0.5. It is stored on the event
 * rather than derived from the type so that a rule change later does not
 * silently rewrite last season's scores.
 */
create table match_events (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references matches (id) on delete cascade,
  round_id    uuid references match_rounds (id) on delete set null,
  school_id   uuid not null references schools (id) on delete cascade,
  student_id  uuid references students (id) on delete set null,
  event_type  match_event_type not null,
  points      numeric(5, 2) not null default 0,
  question_no integer,
  -- Substitutions: who came off, who came on.
  student_out uuid references students (id) on delete set null,
  student_in  uuid references students (id) on delete set null,
  note        text,
  recorded_by uuid references profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index on match_events (match_id, created_at);
create index on match_events (school_id);

/**
 * Live standings for a match, computed from the events.
 *
 * A view, not a stored total: there is exactly one source of truth, and it is
 * the event log. Anything that disagrees with this is wrong by definition.
 */
create or replace view match_standings as
  select
    e.match_id,
    e.school_id,
    sum(e.points)::numeric(6, 2) as score,
    count(*) filter (where e.event_type = 'striker_correct') as striker_correct,
    count(*) filter (where e.event_type = 'assist_correct') as assist_correct,
    count(*) filter (where e.event_type = 'var_referral') as var_referrals,
    count(*) filter (where e.event_type = 'substitution') as substitutions
  from match_events e
  group by e.match_id, e.school_id;

-- ---------------------------------------------------------------------------
-- Judge assignments
-- ---------------------------------------------------------------------------

create table judge_assignments (
  id         uuid primary key default gen_random_uuid(),
  judge_id   uuid not null references judges (id) on delete cascade,
  fixture_id uuid not null references fixtures (id) on delete cascade,
  role       text not null default 'judge',
  created_at timestamptz not null default now(),
  unique (judge_id, fixture_id)
);

-- Is the current user a judge assigned to this match's fixture?
create or replace function judges_this_match(target_match uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from matches m
    join judge_assignments ja on ja.fixture_id = m.fixture_id
    join judges j on j.id = ja.judge_id
    where m.id = target_match and j.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table matches enable row level security;
alter table matches force row level security;
alter table match_rounds enable row level security;
alter table match_rounds force row level security;
alter table match_events enable row level security;
alter table match_events force row level security;
alter table judge_assignments enable row level security;
alter table judge_assignments force row level security;

create policy matches_read on matches for select
  using (publish = 'published' or is_admin() or judges_this_match(id));

create policy matches_write on matches for all
  to authenticated
  using (is_admin() or judges_this_match(id))
  with check (is_admin() or judges_this_match(id));

create policy match_rounds_read on match_rounds for select
  using (
    exists (select 1 from matches m
            where m.id = match_rounds.match_id
              and (m.publish = 'published' or is_admin() or judges_this_match(m.id)))
  );

create policy match_rounds_write on match_rounds for all
  to authenticated
  using (is_admin()) with check (is_admin());

-- Events follow their match: public once published, otherwise admin and the
-- assigned judge only.
create policy match_events_read on match_events for select
  using (
    exists (select 1 from matches m
            where m.id = match_events.match_id
              and (m.publish = 'published' or is_admin() or judges_this_match(m.id)))
  );

-- Append only. No update or delete policy exists, so a recorded event cannot be
-- quietly rewritten; corrections are made by recording an 'adjustment' event
-- with a note, which leaves both the error and the fix visible.
create policy match_events_append on match_events for insert
  to authenticated
  with check (
    (is_admin() or judges_this_match(match_id))
    and recorded_by = auth.uid()
  );

create policy judge_assignments_read on judge_assignments for select
  using (
    is_admin()
    or exists (select 1 from judges j
               where j.id = judge_assignments.judge_id and j.user_id = auth.uid())
  );

create policy judge_assignments_write on judge_assignments for all
  to authenticated
  using (is_admin()) with check (is_admin());

create trigger matches_set_updated_at
  before update on matches
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Results publication
-- ---------------------------------------------------------------------------

/**
 * Publishes a match's standings into the results table.
 *
 * Copies the computed standings across in one transaction so a published
 * result is a snapshot, not a live query that changes if someone later records
 * another event. Position is assigned by score, highest first.
 */
create or replace function publish_match_results(target_match uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer := 0;
  fixture uuid;
begin
  if not exists (
    select 1 from user_roles
    where user_id = auth.uid() and role in ('super_admin', 'committee')
  ) then
    raise exception 'only the committee may publish results';
  end if;

  select fixture_id into fixture from matches where id = target_match;
  if fixture is null then
    raise exception 'no such match';
  end if;

  insert into results (fixture_id, school_id, score, position, status, published_at)
  select
    fixture,
    s.school_id,
    s.score,
    row_number() over (order by s.score desc),
    'published',
    now()
  from match_standings s
  where s.match_id = target_match
  on conflict (fixture_id, school_id) do update set
    score = excluded.score,
    position = excluded.position,
    status = 'published',
    published_at = now();

  get diagnostics n = row_count;

  update matches set publish = 'published', status = 'completed' where id = target_match;
  return n;
end;
$$;

grant execute on function publish_match_results(uuid) to authenticated;
