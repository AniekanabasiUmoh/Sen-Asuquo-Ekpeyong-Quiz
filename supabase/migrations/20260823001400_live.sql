-- SAEAC — Phase 4: live experience.
--
-- The Grand Finale is televised, so the public scoreboard has to update without
-- anyone reloading. Supabase Realtime broadcasts row changes over a websocket
-- to clients that are allowed to see them, and RLS still applies to that
-- stream: a viewer only receives changes on rows their policies permit. That is
-- why the scoreboard reads published matches only.

-- Realtime publishes changes for tables added to this publication.
alter publication supabase_realtime add table match_events;
alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table results;

-- Full row data on update, so a subscriber gets the new values rather than just
-- the primary key.
alter table match_events replica identity full;
alter table matches replica identity full;
alter table results replica identity full;

/**
 * The live scoreboard payload for one match.
 *
 * One function rather than several queries: the scoreboard is the most heavily
 * hit endpoint of the whole event, and a single round trip on Nigerian mobile
 * data is worth more than elegant separation. Returns nothing for an
 * unpublished match, so it cannot leak a score before the committee publishes.
 */
create or replace function live_scoreboard(target_match uuid)
returns table (
  school_id uuid,
  school_name text,
  score numeric,
  striker_correct bigint,
  assist_correct bigint,
  var_referrals bigint,
  substitutions bigint,
  -- `rank` not `position`: position is a reserved word in Postgres.
  rank bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.name,
    coalesce(st.score, 0)::numeric,
    coalesce(st.striker_correct, 0),
    coalesce(st.assist_correct, 0),
    coalesce(st.var_referrals, 0),
    coalesce(st.substitutions, 0),
    row_number() over (order by coalesce(st.score, 0) desc, s.name)
  from matches m
  join fixture_participants fp on fp.fixture_id = m.fixture_id
  join schools s on s.id = fp.school_id
  left join match_standings st on st.match_id = m.id and st.school_id = s.id
  where m.id = target_match
    and (
      m.publish = 'published'
      or exists (select 1 from user_roles ur
                 where ur.user_id = auth.uid()
                   and ur.role in ('super_admin','committee'))
      or judges_this_match(m.id)
    )
  order by 3 desc, 2;
$$;

grant execute on function live_scoreboard(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Broadcast
-- ---------------------------------------------------------------------------

create table if not exists broadcasts (
  id           uuid primary key default gen_random_uuid(),
  match_id     uuid references matches (id) on delete set null,
  title        text not null,
  -- YouTube or similar. Stored as an embed id, not a full URL, so the page
  -- controls the embed parameters rather than trusting pasted markup.
  embed_id     text,
  platform     text not null default 'youtube',
  starts_at    timestamptz,
  status       text not null default 'upcoming',
  publish      publish_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table broadcasts enable row level security;
alter table broadcasts force row level security;

drop policy if exists broadcasts_read on broadcasts;
create policy broadcasts_read on broadcasts for select
  using (publish = 'published' or is_admin());

drop policy if exists broadcasts_write on broadcasts;
create policy broadcasts_write on broadcasts for all
  to authenticated
  using (is_admin()) with check (is_admin());

drop trigger if exists broadcasts_set_updated_at on broadcasts;
create trigger broadcasts_set_updated_at
  before update on broadcasts
  for each row execute function set_updated_at();
