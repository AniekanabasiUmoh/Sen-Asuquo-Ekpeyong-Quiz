-- SAEAC — Phase 4 sprint 4.3: QR-code accreditation for event-day check-in.
--
-- Scope agreed before building: students and their Coach, accepted Change
-- Makers, and assigned judges. One table rather than four near-identical ones
-- (student_badges, coach_badges, ...) — the shape (a holder, a code, a
-- check-in state) is identical across all four, and a generic `holder_type` /
-- `holder_id` pair is one join away from any of the four source tables
-- without four copies of the same check-in logic.
--
-- The code itself is a random opaque token, not the holder's row id: a QR
-- code sits in a photo on someone's phone that might get shared or lost, and a
-- token that reveals nothing about who it belongs to until it is looked up
-- server-side is the right default for something handed to a minor.

create type accreditation_holder as enum ('student', 'coach', 'volunteer', 'judge');

create table if not exists accreditations (
  id           uuid primary key default gen_random_uuid(),
  holder_type  accreditation_holder not null,
  holder_id    uuid not null,
  -- Opaque, url-safe, unguessable. 24 bytes of randomness base64url-encoded.
  code         text not null unique default encode(gen_random_bytes(18), 'base64'),
  issued_at    timestamptz not null default now(),
  checked_in_at timestamptz,
  checked_in_by uuid references profiles (id) on delete set null,
  revoked_at   timestamptz,
  created_at   timestamptz not null default now(),
  unique (holder_type, holder_id)
);

create index if not exists accreditations_holder_idx on accreditations (holder_type, holder_id);
create index if not exists accreditations_code_idx on accreditations (code);

-- Postgres's default base64 alphabet includes '/' and '+', which are
-- meaningful characters in a URL and awkward in a QR-encoded link. Replace
-- with the url-safe alphabet on generation, applied here because
-- gen_random_bytes/encode has no url-safe variant built in.
create or replace function generate_accreditation_code()
returns trigger
language plpgsql
as $$
begin
  if new.code is null or new.code = '' then
    new.code := translate(encode(gen_random_bytes(18), 'base64'), '+/=', '-_');
  else
    new.code := translate(new.code, '+/=', '-_');
  end if;
  return new;
end;
$$;

drop trigger if exists accreditations_code_urlsafe on accreditations;
create trigger accreditations_code_urlsafe
  before insert on accreditations
  for each row execute function generate_accreditation_code();

/**
 * Checks a code in. Returns the holder's display info so the scanning UI can
 * show who just walked through without a second query, and refuses a second
 * check-in (already-used) or a revoked badge with a distinct, actionable
 * message rather than a bare "not found".
 */
create or replace function check_in_accreditation(scanned_code text)
returns table (
  ok boolean,
  message text,
  holder_type accreditation_holder,
  holder_name text,
  detail text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  rec accreditations;
  name text;
  extra text;
begin
  if not exists (
    select 1 from user_roles
    where user_id = auth.uid() and role in ('super_admin', 'committee')
  ) then
    return query select false, 'Not authorised to check in accreditations.', null::accreditation_holder, null::text, null::text;
    return;
  end if;

  select * into rec from accreditations where code = translate(scanned_code, '+/=', '-_');

  if rec.id is null then
    return query select false, 'That code was not recognised.', null::accreditation_holder, null::text, null::text;
    return;
  end if;

  if rec.revoked_at is not null then
    return query select false, 'This accreditation has been revoked.', rec.holder_type, null::text, null::text;
    return;
  end if;

  if rec.checked_in_at is not null then
    select s.full_name into name from students s where s.id = rec.holder_id and rec.holder_type = 'student';
    if name is null then
      select c.full_name into name from coaches c where c.id = rec.holder_id and rec.holder_type = 'coach';
    end if;
    if name is null then
      select v.full_name into name from volunteers v where v.id = rec.holder_id and rec.holder_type = 'volunteer';
    end if;
    if name is null then
      select j.full_name into name from judges j where j.id = rec.holder_id and rec.holder_type = 'judge';
    end if;
    return query select false,
      'Already checked in at ' || to_char(rec.checked_in_at, 'HH24:MI') || '.',
      rec.holder_type, name, null::text;
    return;
  end if;

  update accreditations
     set checked_in_at = now(), checked_in_by = auth.uid()
   where id = rec.id;

  if rec.holder_type = 'student' then
    select st.full_name, sc.name into name, extra
      from students st join schools sc on sc.id = st.school_id
     where st.id = rec.holder_id;
  elsif rec.holder_type = 'coach' then
    select c.full_name, sc.name into name, extra
      from coaches c join schools sc on sc.id = c.school_id
     where c.id = rec.holder_id;
  elsif rec.holder_type = 'volunteer' then
    select v.full_name, v.role_sought into name, extra from volunteers v where v.id = rec.holder_id;
  elsif rec.holder_type = 'judge' then
    select j.full_name, j.speciality into name, extra from judges j where j.id = rec.holder_id;
  end if;

  return query select true, 'Checked in.', rec.holder_type, name, extra;
end;
$$;

grant execute on function check_in_accreditation(text) to authenticated;

alter table accreditations enable row level security;
alter table accreditations force row level security;

-- Admin-only end to end: this is a gate-staff tool, not something the badge
-- holder themselves reads from a portal page. Their code arrives by email/
-- printout (Sprint 2.2/3.1's confirmation email, once Resend is active),
-- never by them logging in and fetching it, which would need them to already
-- be signed in to prove who they are with the very code that proves it.
drop policy if exists accreditations_manage on accreditations;
create policy accreditations_manage on accreditations for all
  to authenticated using (is_admin()) with check (is_admin());
