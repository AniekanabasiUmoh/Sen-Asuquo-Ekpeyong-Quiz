-- Auditable registration, schedule and result appeals.
-- Apply only after the Supabase project owner confirms the target project.

create table if not exists appeals (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools (id) on delete cascade,
  submitted_by uuid not null references profiles (id) on delete restrict,
  kind text not null check (kind in ('registration', 'result', 'schedule', 'other')),
  subject text not null,
  details text not null,
  evidence_url text,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'resolved', 'rejected', 'withdrawn')),
  resolution text,
  assigned_to uuid references profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appeals_school_idx on appeals (school_id, created_at desc);
create index if not exists appeals_status_idx on appeals (status, created_at desc);

alter table appeals enable row level security;
alter table appeals force row level security;

drop policy if exists appeals_read on appeals;
create policy appeals_read on appeals for select
  using (is_admin() or owns_school(school_id));

drop policy if exists appeals_insert on appeals;
create policy appeals_insert on appeals for insert
  to authenticated
  with check ((is_admin() or owns_school(school_id)) and submitted_by = auth.uid());

drop policy if exists appeals_admin_update on appeals;
create policy appeals_admin_update on appeals for update
  to authenticated
  using (is_admin()) with check (is_admin());

drop trigger if exists appeals_set_updated_at on appeals;
create trigger appeals_set_updated_at before update on appeals
  for each row execute function set_updated_at();
