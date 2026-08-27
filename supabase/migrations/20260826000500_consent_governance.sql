-- Minor-data consent provenance and withdrawal history.
-- Apply only after the Supabase project owner confirms the target project.

alter table students add column if not exists consent_version text;
alter table students add column if not exists consent_given_by uuid references profiles (id) on delete set null;
alter table students add column if not exists consent_withdrawn_at timestamptz;
alter table students add column if not exists consent_withdrawn_by uuid references profiles (id) on delete set null;

-- Existing false rows remain valid. New consent records must carry a version
-- and actor together; the original consent timestamp is retained when consent
-- is withdrawn so the history is not silently erased.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'students_consent_provenance'
      and conrelid = 'students'::regclass
  ) then
    alter table students add constraint students_consent_provenance
      check (consent_version is null or consent_given_by is not null);
  end if;
end;
$$;

create index if not exists students_consent_withdrawn_idx
  on students (consent_withdrawn_at)
  where consent_withdrawn_at is not null;

-- Consent is a governance record, not a UI convention. Enforce the required
-- provenance at the database boundary so a direct PostgREST update cannot set
-- the boolean while omitting who approved it or which policy was accepted.
create or replace function enforce_student_consent_provenance()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.consent_given then
    if new.consent_at is null
       or new.consent_version is null
       or new.consent_given_by is null then
      raise exception 'consent requires timestamp, policy version, and approving actor';
    end if;
    if new.consent_withdrawn_at is not null
       or new.consent_withdrawn_by is not null then
      raise exception 'active consent cannot carry withdrawal metadata';
    end if;
  elsif tg_op = 'UPDATE' and old.consent_given then
    if new.consent_withdrawn_at is null
       or new.consent_withdrawn_by is null then
      raise exception 'withdrawing consent requires timestamp and withdrawing actor';
    end if;
  elsif new.consent_withdrawn_at is not null
        or new.consent_withdrawn_by is not null then
    raise exception 'withdrawal metadata requires a prior consent record';
  end if;
  return new;
end;
$$;

drop trigger if exists students_consent_provenance on students;
create trigger students_consent_provenance
  before insert or update on students
  for each row execute function enforce_student_consent_provenance();
