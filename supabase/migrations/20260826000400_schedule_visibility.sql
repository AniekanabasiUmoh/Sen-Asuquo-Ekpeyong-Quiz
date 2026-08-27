-- Keep draft schedule metadata private. The public schedule only needs change
-- notes after a fixture is published; exposing fixture_changes or participants
-- for a draft could reveal an unannounced venue or school identifier through
-- the REST API even though the UI never renders it.

drop policy if exists venues_read on venues;
create policy venues_read on venues for select
  using (
    is_admin()
    or exists (
      select 1 from fixtures f
      where f.venue_id = venues.id
        and f.publish = 'published'
    )
  );

drop policy if exists fixture_changes_read on fixture_changes;
create policy fixture_changes_read on fixture_changes for select
  using (
    exists (
      select 1 from fixtures f
      where f.id = fixture_changes.fixture_id
        and (f.publish = 'published' or is_admin())
    )
  );

drop policy if exists fixture_participants_read on fixture_participants;
create policy fixture_participants_read on fixture_participants for select
  using (
    exists (
      select 1 from fixtures f
      where f.id = fixture_participants.fixture_id
        and (f.publish = 'published' or is_admin())
    )
  );
