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
