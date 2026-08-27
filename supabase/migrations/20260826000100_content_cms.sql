-- SAEAC content CMS: FAQs and downloadable rules/resources.
-- Apply only after the Supabase project owner confirms the target project.

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  status publish_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faqs_public_order_idx on faqs (status, sort_order, created_at desc);

create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  version text,
  file_url text not null,
  file_size_bytes integer,
  status publish_status not null default 'draft',
  published_at timestamptz,
  download_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists downloads_public_order_idx on downloads (status, published_at desc);

alter table faqs enable row level security;
alter table faqs force row level security;
alter table downloads enable row level security;
alter table downloads force row level security;

drop policy if exists faqs_read_published on faqs;
create policy faqs_read_published on faqs for select
  using (status = 'published' or is_admin());

drop policy if exists faqs_write on faqs;
create policy faqs_write on faqs for all
  to authenticated using (is_admin()) with check (is_admin());

drop policy if exists downloads_read_published on downloads;
create policy downloads_read_published on downloads for select
  using (status = 'published' or is_admin());

drop policy if exists downloads_write on downloads;
create policy downloads_write on downloads for all
  to authenticated using (is_admin()) with check (is_admin());

drop trigger if exists faqs_set_updated_at on faqs;
create trigger faqs_set_updated_at before update on faqs
  for each row execute function set_updated_at();
drop trigger if exists downloads_set_updated_at on downloads;
create trigger downloads_set_updated_at before update on downloads
  for each row execute function set_updated_at();
