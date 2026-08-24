-- SAEAC — Sprint 2.1: core domain schema.
--
-- Source of truth for the competition structure is the Content Guide, encoded
-- in content/homepage.ts (`stages`, `lgas`). This file must agree with it.
--
-- Conventions used throughout:
--   * every table has id uuid / created_at / updated_at
--   * enums are Postgres types, not free text, so bad states cannot be stored
--   * every status-changing action is auditable (see audit_log below)
--   * RLS is enabled on every table in a companion migration; nothing here
--     grants access on its own

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enumerated domains
-- ---------------------------------------------------------------------------

-- The three screening streams each school examines on the same day.
create type stream as enum ('science', 'art', 'commercial');

-- Registration lifecycle. A school is only 'approved' once a committee member
-- has verified it; 'changes_requested' sends it back without losing the record.
create type registration_status as enum (
  'draft',
  'submitted',
  'under_review',
  'changes_requested',
  'approved',
  'rejected',
  'withdrawn'
);

-- Roles. Kept deliberately small for Sprint 2.1: the committee-level split
-- (ict_results, academic_review, ...) arrives with Phase 3 operations.
create type app_role as enum (
  'super_admin',
  'committee',
  'school_admin',
  'coach',
  'student',
  'judge',
  'volunteer',
  'viewer'
);

create type volunteer_status as enum ('applied', 'accepted', 'declined', 'withdrawn');

create type publish_status as enum ('draft', 'review', 'published', 'archived');

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

-- The seven LGAs of Cross River South.
--
-- qualifier_group is the important column: Akpabuyo and Bakassi are merged and
-- jointly contest ONE slot at the Local Government Qualifiers, so grouping by
-- this column (not by LGA) yields the six qualifying groups that produce the
-- 30-school Group Stage field.
create table lgas (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  -- Provisional public-school count from the Principals' Meeting Report.
  -- These seven values total 117. The public-facing "250+ schools" figure
  -- includes private schools and projected participation; see the note above
  -- `stats` in content/homepage.ts. Do not reconcile one into the other.
  school_count  integer not null check (school_count >= 0),
  qualifier_group text not null,
  is_combined   boolean not null default false,
  image_path    text,
  sort_order    integer not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index on lgas (qualifier_group);

-- The seven stages, per Content Guide and content/homepage.ts `stages`.
create table stages (
  id          uuid primary key default gen_random_uuid(),
  ordinal     integer not null unique check (ordinal between 1 and 7),
  name        text not null unique,
  slug        text not null unique,
  summary     text not null,
  field_label text not null,
  starts_on   date,
  ends_on     date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint stages_date_order check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table subjects (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  stream     stream,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

-- Mirrors auth.users. Supabase owns auth.users; this is the app-side profile
-- that RLS policies and foreign keys can safely reference.
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  email      text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A user may hold several roles (a coach who is also a school_admin).
create table user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  role       app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index on user_roles (user_id);

-- ---------------------------------------------------------------------------
-- Schools and students
-- ---------------------------------------------------------------------------

create table schools (
  id                 uuid primary key default gen_random_uuid(),
  lga_id             uuid not null references lgas (id) on delete restrict,
  name               text not null,
  slug               text not null unique,
  -- Human-facing registration number issued on approval (e.g. SAEAC-2026-0001).
  -- Null until approved, unique when present.
  registration_no    text unique,
  status             registration_status not null default 'draft',
  is_private         boolean not null default false,
  address            text,
  contact_name       text,
  contact_email      text,
  contact_phone      text,
  principal_name     text,
  -- The account that owns this school's dashboard.
  owner_id           uuid references profiles (id) on delete set null,
  submitted_at       timestamptz,
  approved_at        timestamptz,
  approved_by        uuid references profiles (id) on delete set null,
  rejection_reason   text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- A school cannot be approved without the registration number that approval
  -- is supposed to issue.
  constraint schools_approved_has_regno
    check (status <> 'approved' or registration_no is not null)
);

create unique index schools_name_per_lga on schools (lga_id, lower(name));
create index on schools (status);
create index on schools (lga_id);
create index on schools (owner_id);

-- The five qualifying students a school sends forward.
--
-- Football metaphor is brand-sanctioned and deliberate: 3 Strikers + 2 Assists,
-- with the mentor as Coach. `is_striker` carries that distinction; the 3/2 split
-- is enforced at the team level in Phase 3, not here, because a school builds
-- its roster incrementally and must be able to save a partial one.
create table students (
  id            uuid primary key default gen_random_uuid(),
  school_id     uuid not null references schools (id) on delete cascade,
  full_name     text not null,
  stream        stream not null,
  is_striker    boolean not null default true,
  date_of_birth date,
  class_level   text,
  photo_path    text,
  -- Guardian/school consent for a minor's photo and data to appear publicly.
  -- Required before any student image is shown on the public site.
  consent_given boolean not null default false,
  consent_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint students_consent_timestamped
    check (consent_given = false or consent_at is not null)
);

create index on students (school_id);
create index on students (stream);

create table coaches (
  id         uuid primary key default gen_random_uuid(),
  school_id  uuid not null references schools (id) on delete cascade,
  user_id    uuid references profiles (id) on delete set null,
  full_name  text not null,
  email      text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on coaches (school_id);

-- ---------------------------------------------------------------------------
-- Competition operations (skeleton for Phase 3)
-- ---------------------------------------------------------------------------

create table fixtures (
  id              uuid primary key default gen_random_uuid(),
  stage_id        uuid not null references stages (id) on delete restrict,
  -- Null for stages that are not LGA-scoped (Group Stage onward).
  qualifier_group text,
  name            text not null,
  venue           text,
  scheduled_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index on fixtures (stage_id);

create table fixture_participants (
  id         uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references fixtures (id) on delete cascade,
  school_id  uuid not null references schools (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (fixture_id, school_id)
);

create table results (
  id           uuid primary key default gen_random_uuid(),
  fixture_id   uuid not null references fixtures (id) on delete cascade,
  school_id    uuid not null references schools (id) on delete cascade,
  -- numeric, not integer: an Assist answer is worth 0.5 points.
  score        numeric(6, 2) not null default 0,
  position     integer,
  advanced     boolean not null default false,
  -- Results are only visible publicly once a committee member publishes them.
  status       publish_status not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (fixture_id, school_id)
);

create index on results (school_id);
create index on results (status);

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

create table news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  body         text,
  category     text,
  image_path   text,
  status       publish_status not null default 'draft',
  published_at timestamptz,
  author_id    uuid references profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on news (status, published_at desc);

create table gallery_items (
  id           uuid primary key default gen_random_uuid(),
  title        text,
  caption      text,
  image_path   text not null,
  lga_id       uuid references lgas (id) on delete set null,
  stage_id     uuid references stages (id) on delete set null,
  status       publish_status not null default 'draft',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table sponsors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  tier       text,
  logo_path  text,
  website    text,
  status     publish_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------

create table volunteers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles (id) on delete set null,
  full_name  text not null,
  email      text not null,
  phone      text,
  lga_id     uuid references lgas (id) on delete set null,
  role_sought text,
  status     volunteer_status not null default 'applied',
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table judges (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles (id) on delete set null,
  full_name  text not null,
  email      text,
  phone      text,
  speciality text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Audit
-- ---------------------------------------------------------------------------

-- Append-only. Every status-changing action writes here; nothing updates or
-- deletes rows (enforced by RLS in the companion migration).
create table audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles (id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  before      jsonb,
  after       jsonb,
  reason      text,
  created_at  timestamptz not null default now()
);

create index on audit_log (entity, entity_id);
create index on audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

do $$
declare t text;
begin
  foreach t in array array[
    'lgas','stages','subjects','profiles','schools','students','coaches',
    'fixtures','results','news','gallery_items','sponsors','volunteers','judges'
  ]
  loop
    execute format(
      'create trigger %I_set_updated_at before update on %I
         for each row execute function set_updated_at()', t, t);
  end loop;
end;
$$;
