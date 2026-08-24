-- SAEAC — Phase 3 sprint 3.1: competition and schedule management.
--
-- Fixtures already exist from the core schema. This adds what running them
-- needs: publication state, a change log so a moved fixture can be shown as
-- moved rather than silently edited, and venue records.

create type fixture_status as enum ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');

alter table fixtures
  add column if not exists status fixture_status not null default 'scheduled',
  add column if not exists publish publish_status not null default 'draft',
  add column if not exists notes text;

create table if not exists venues (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  lga_id     uuid references lgas (id) on delete set null,
  address    text,
  capacity   integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table fixtures
  add column if not exists venue_id uuid references venues (id) on delete set null;

/**
 * Schedule change log.
 *
 * A fixture that moves must be *seen* to have moved: schools plan travel around
 * these dates. Every change to a scheduled time or venue writes a row here, and
 * the public schedule flags anything changed recently.
 */
create table if not exists fixture_changes (
  id           uuid primary key default gen_random_uuid(),
  fixture_id   uuid not null references fixtures (id) on delete cascade,
  changed_by   uuid references profiles (id) on delete set null,
  field        text not null,
  old_value    text,
  new_value    text,
  reason       text,
  created_at   timestamptz not null default now()
);

create index if not exists fixture_changes_fixture_idx on fixture_changes (fixture_id, created_at desc);

-- Record schedule changes automatically, so a change cannot be made without a
-- trace simply by forgetting to write one.
create or replace function log_fixture_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.scheduled_at is distinct from old.scheduled_at then
    insert into fixture_changes (fixture_id, changed_by, field, old_value, new_value)
    values (new.id, auth.uid(), 'scheduled_at',
            to_char(old.scheduled_at, 'YYYY-MM-DD HH24:MI'),
            to_char(new.scheduled_at, 'YYYY-MM-DD HH24:MI'));
  end if;

  if new.venue_id is distinct from old.venue_id then
    insert into fixture_changes (fixture_id, changed_by, field, old_value, new_value)
    values (new.id, auth.uid(), 'venue',
            (select name from venues where id = old.venue_id),
            (select name from venues where id = new.venue_id));
  end if;

  return new;
end;
$$;

drop trigger if exists fixtures_log_change on fixtures;
create trigger fixtures_log_change
  after update on fixtures
  for each row execute function log_fixture_change();

drop trigger if exists venues_set_updated_at on venues;
create trigger venues_set_updated_at
  before update on venues
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table venues enable row level security;
alter table venues force row level security;
alter table fixture_changes enable row level security;
alter table fixture_changes force row level security;

drop policy if exists venues_read on venues;
create policy venues_read on venues for select using (true);

drop policy if exists venues_write on venues;
create policy venues_write on venues for all
  using (is_admin()) with check (is_admin());

-- The change log is public: its whole purpose is that schools can see a fixture
-- moved. It is append-only in practice because only the trigger writes to it.
drop policy if exists fixture_changes_read on fixture_changes;
create policy fixture_changes_read on fixture_changes for select using (true);

drop policy if exists fixture_changes_write on fixture_changes;
create policy fixture_changes_write on fixture_changes for insert
  to authenticated with check (is_admin());

-- Fixtures were world-readable from the core schema. Now that they carry a
-- publish state, only published ones should be public.
drop policy if exists fixtures_read on fixtures;
create policy fixtures_read on fixtures for select
  using (publish = 'published' or is_admin());
