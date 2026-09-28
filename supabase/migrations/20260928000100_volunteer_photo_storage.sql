-- Volunteer headshots support committee-created volunteer designs. Images are
-- private; only the authenticated organising committee may read them. Public
-- applications upload through a server action using the server-only service
-- role key, never directly from the browser.

alter table public.volunteers
  add column if not exists photo_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'volunteer-photos',
  'volunteer-photos',
  false,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists saeac_volunteer_photo_read on storage.objects;
create policy saeac_volunteer_photo_read on storage.objects for select
  to authenticated
  using (bucket_id = 'volunteer-photos' and is_admin());
