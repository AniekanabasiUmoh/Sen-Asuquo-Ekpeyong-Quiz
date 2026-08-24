-- SAEAC — Storage buckets for school documents and student photographs.
--
-- Both buckets are PRIVATE. Student photographs are pictures of minors, and a
-- public bucket means a guessable URL is world-readable forever regardless of
-- what the database says about consent. Files are served through short-lived
-- signed URLs instead, minted server-side for someone who has already passed an
-- RLS check.
--
-- Path convention, relied on by every policy below:
--
--     school-documents/<school_id>/<filename>
--     student-photos/<school_id>/<student_id>-<filename>
--
-- The first path segment is always the school's uuid, so ownership can be
-- decided from the object name alone via (storage.foldername(name))[1].

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('school-documents', 'school-documents', false, 10485760,
   array['application/pdf','image/jpeg','image/png','image/webp']),
  ('student-photos', 'student-photos', false, 5242880,
   array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Does the current user own, or coach at, the school this object belongs to?
create or replace function owns_storage_object(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from schools s
    where s.id::text = (storage.foldername(object_name))[1]
      and (
        s.owner_id = auth.uid()
        or exists (
          select 1 from coaches c
          where c.school_id = s.id and c.user_id = auth.uid()
        )
      )
  );
$$;

-- Clear out any earlier attempt so this migration can be re-run.
drop policy if exists saeac_storage_read   on storage.objects;
drop policy if exists saeac_storage_insert on storage.objects;
drop policy if exists saeac_storage_update on storage.objects;
drop policy if exists saeac_storage_delete on storage.objects;

create policy saeac_storage_read on storage.objects for select
  to authenticated
  using (
    bucket_id in ('school-documents', 'student-photos')
    and (owns_storage_object(name) or is_admin())
  );

create policy saeac_storage_insert on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('school-documents', 'student-photos')
    and (owns_storage_object(name) or is_admin())
  );

create policy saeac_storage_update on storage.objects for update
  to authenticated
  using (
    bucket_id in ('school-documents', 'student-photos')
    and (owns_storage_object(name) or is_admin())
  );

create policy saeac_storage_delete on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('school-documents', 'student-photos')
    and (owns_storage_object(name) or is_admin())
  );

-- Uploaded supporting documents, so the committee can see what was provided
-- without listing the bucket.
create table if not exists school_documents (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools (id) on delete cascade,
  label       text not null,
  storage_path text not null unique,
  mime_type   text,
  size_bytes  integer,
  uploaded_by uuid references profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists school_documents_school_idx on school_documents (school_id);

alter table school_documents enable row level security;
alter table school_documents force row level security;

drop policy if exists school_documents_read on school_documents;
create policy school_documents_read on school_documents for select
  using (
    is_admin()
    or exists (
      select 1 from schools s
      where s.id = school_documents.school_id
        and (s.owner_id = auth.uid()
             or exists (select 1 from coaches c
                        where c.school_id = s.id and c.user_id = auth.uid()))
    )
  );

drop policy if exists school_documents_write on school_documents;
create policy school_documents_write on school_documents for all
  to authenticated
  using (
    is_admin()
    or exists (
      select 1 from schools s
      where s.id = school_documents.school_id and s.owner_id = auth.uid()
    )
  )
  with check (
    is_admin()
    or exists (
      select 1 from schools s
      where s.id = school_documents.school_id and s.owner_id = auth.uid()
    )
  );

create trigger school_documents_set_updated_at
  before update on school_documents
  for each row execute function set_updated_at();
