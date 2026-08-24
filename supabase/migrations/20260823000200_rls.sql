-- SAEAC — Sprint 2.1: Row Level Security.
--
-- The anon key ships in the browser bundle, so THIS FILE is the actual
-- security boundary. Default posture: deny. A table with RLS enabled and no
-- matching policy returns zero rows rather than erroring, so every read the
-- public site needs must be granted explicitly below.
--
-- Rules encoded here:
--   * reference data (lgas, stages, subjects) is world-readable
--   * content is world-readable ONLY when status = 'published'
--   * a school sees its own registration; the public sees approved schools only
--   * student rows are never public (minors); consent alone does not publish
--   * audit_log is append-only and readable by admins only

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- security definer so the policy can read user_roles without recursing into
-- user_roles' own policies. search_path is pinned: a security definer function
-- with a mutable search_path is a privilege-escalation vector.
create or replace function has_role(target app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = target
  );
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role in ('super_admin', 'committee')
  );
$$;

-- Schools whose dashboard the current user owns or coaches.
create or replace function owns_school(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from schools s
    where s.id = target and s.owner_id = auth.uid()
  ) or exists (
    select 1 from coaches c
    where c.school_id = target and c.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------

do $$
declare t text;
begin
  foreach t in array array[
    'lgas','stages','subjects','profiles','user_roles','schools','students',
    'coaches','fixtures','fixture_participants','results','news',
    'gallery_items','sponsors','volunteers','judges','audit_log'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    -- Force RLS so even the table owner is subject to it. The service-role key
    -- still bypasses RLS entirely; that is why it is server-only.
    execute format('alter table %I force row level security', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reference data: world-readable, admin-writable
-- ---------------------------------------------------------------------------

create policy lgas_read     on lgas     for select using (true);
create policy stages_read   on stages   for select using (true);
create policy subjects_read on subjects for select using (true);

create policy lgas_write     on lgas     for all using (is_admin()) with check (is_admin());
create policy stages_write   on stages   for all using (is_admin()) with check (is_admin());
create policy subjects_write on subjects for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Profiles and roles
-- ---------------------------------------------------------------------------

create policy profiles_read_self on profiles for select
  using (id = auth.uid() or is_admin());

create policy profiles_update_self on profiles for update
  using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

create policy profiles_insert_self on profiles for insert
  with check (id = auth.uid());

-- A user may read their own roles but never grant themselves one.
create policy user_roles_read on user_roles for select
  using (user_id = auth.uid() or is_admin());

create policy user_roles_admin_write on user_roles for all
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Schools
-- ---------------------------------------------------------------------------

-- Public directory shows approved schools only. An in-progress or rejected
-- registration is visible to its owner and to admins, nobody else.
create policy schools_read_public on schools for select
  using (status = 'approved' or owns_school(id) or is_admin());

-- A signed-in user may create their own school registration.
create policy schools_insert_own on schools for insert
  with check (owner_id = auth.uid() or is_admin());

-- A school may edit itself only while the registration is still open.
-- Once approved or rejected, only an admin can change it.
create policy schools_update_own on schools for update
  using (
    is_admin() or (
      owns_school(id)
      and status in ('draft', 'changes_requested', 'submitted')
    )
  )
  with check (is_admin() or owns_school(id));

create policy schools_delete_admin on schools for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- Students — never public
-- ---------------------------------------------------------------------------

-- Deliberately no public select policy. Students are minors; their rows are
-- visible to their own school and to admins only. Publishing a name or photo
-- on the public site is a separate, explicit step in a later phase and must
-- check students.consent_given at that point.
create policy students_read_own_school on students for select
  using (owns_school(school_id) or is_admin());

create policy students_write_own_school on students for all
  using (owns_school(school_id) or is_admin())
  with check (owns_school(school_id) or is_admin());

create policy coaches_read on coaches for select
  using (owns_school(school_id) or user_id = auth.uid() or is_admin());

create policy coaches_write on coaches for all
  using (owns_school(school_id) or is_admin())
  with check (owns_school(school_id) or is_admin());

-- ---------------------------------------------------------------------------
-- Competition
-- ---------------------------------------------------------------------------

create policy fixtures_read on fixtures for select using (true);
create policy fixtures_write on fixtures for all
  using (is_admin()) with check (is_admin());

create policy fixture_participants_read on fixture_participants for select using (true);
create policy fixture_participants_write on fixture_participants for all
  using (is_admin()) with check (is_admin());

-- Unpublished results must not leak: a draft score is not an official result.
create policy results_read_published on results for select
  using (status = 'published' or owns_school(school_id) or is_admin() or has_role('judge'));

create policy results_write on results for all
  using (is_admin() or has_role('judge'))
  with check (is_admin() or has_role('judge'));

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

create policy news_read_published on news for select
  using (status = 'published' or is_admin());
create policy news_write on news for all
  using (is_admin()) with check (is_admin());

create policy gallery_read_published on gallery_items for select
  using (status = 'published' or is_admin());
create policy gallery_write on gallery_items for all
  using (is_admin()) with check (is_admin());

create policy sponsors_read_published on sponsors for select
  using (status = 'published' or is_admin());
create policy sponsors_write on sponsors for all
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------

-- Anyone may apply to volunteer; only admins may read the applications.
create policy volunteers_insert_any on volunteers for insert with check (true);
create policy volunteers_read on volunteers for select
  using (user_id = auth.uid() or is_admin());
create policy volunteers_manage on volunteers for all
  using (is_admin()) with check (is_admin());

create policy judges_read on judges for select
  using (user_id = auth.uid() or is_admin());
create policy judges_manage on judges for all
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Audit log — append-only
-- ---------------------------------------------------------------------------

create policy audit_read_admin on audit_log for select using (is_admin());

-- Any authenticated actor may append, provided they attribute the entry to
-- themselves. No update or delete policy exists, so with FORCE RLS on, audit
-- rows cannot be altered or removed through the API by any key except the
-- service role.
create policy audit_append on audit_log for insert
  with check (actor_id = auth.uid() or actor_id is null);
