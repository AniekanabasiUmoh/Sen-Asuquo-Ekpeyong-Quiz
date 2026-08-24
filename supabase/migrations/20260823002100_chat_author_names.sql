-- SAEAC — fix: live chat could not resolve a new author's display name.
--
-- app/live/[id]/page.tsx resolves chat authors' names once at page load, from
-- the initial batch of messages only. A message from someone who had not yet
-- posted when the page loaded arrives over Realtime with no name available —
-- profiles is locked to "your own row, or admin" (see
-- 20260823000200_rls.sql), so a plain client-side select of other users'
-- profiles returns nothing. Every first-time poster in an active chat would
-- show as "Supporter" for the rest of everyone else's session.
--
-- This is the same shape as live_scoreboard(): a narrow, security definer RPC
-- that returns only what the specific feature needs (a name, not a profile),
-- scoped to only names of people who have actually posted in a match the
-- caller is already allowed to see.

create or replace function chat_author_names(target_match uuid, user_ids uuid[])
returns table (user_id uuid, full_name text)
language sql
stable
security definer
set search_path = public
as $$
  select distinct p.id, p.full_name
  from profiles p
  where p.id = any(user_ids)
    and exists (
      select 1 from chat_messages cm
      where cm.match_id = target_match and cm.user_id = p.id
    )
    and exists (
      select 1 from matches m
      where m.id = target_match
        and (m.publish = 'published' or is_admin() or judges_this_match(m.id))
    );
$$;

grant execute on function chat_author_names(uuid, uuid[]) to authenticated;
