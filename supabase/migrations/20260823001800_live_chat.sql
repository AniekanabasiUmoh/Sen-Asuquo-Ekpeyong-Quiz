-- SAEAC — Phase 4 sprint 4.2: moderated live chat on the match centre.
--
-- Moderation model (agreed with the client before building): anyone signed
-- into the portal may post, no pre-approval queue — a queue defeats the point
-- of a *live* chat, since a message would lag the broadcast it is reacting to.
-- Any committee/super_admin account may delete a message after the fact. This
-- matches the trust model already used everywhere else in the schema: a
-- signed-in account is not anonymous (email verified at signup), and the
-- moderation tool is removal rather than pre-screening, the same shape as a
-- Facebook Live comment section a page owner can delete from.

create table if not exists chat_messages (
  id         uuid primary key default gen_random_uuid(),
  match_id   uuid not null references matches (id) on delete cascade,
  user_id    uuid not null references profiles (id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now(),
  constraint chat_messages_body_length check (char_length(body) between 1 and 300)
);

create index if not exists chat_messages_match_idx on chat_messages (match_id, created_at);

alter table chat_messages enable row level security;
alter table chat_messages force row level security;

-- Readable by anyone who can see the match: public once published, admin and
-- the assigned judge otherwise. Matches match_events_read exactly, since a
-- chat message is no more sensitive than a score is before publication.
drop policy if exists chat_messages_read on chat_messages;
create policy chat_messages_read on chat_messages for select
  using (
    exists (select 1 from matches m
            where m.id = chat_messages.match_id
              and (m.publish = 'published' or is_admin() or judges_this_match(m.id)))
  );

-- Post as yourself, on a match you are actually allowed to see. No update
-- policy exists: a chat message cannot be edited after posting, only removed,
-- which is a deliberate, simpler rule than a message silently changing after
-- someone has already reacted to it.
drop policy if exists chat_messages_insert on chat_messages;
create policy chat_messages_insert on chat_messages for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from matches m
                where m.id = chat_messages.match_id
                  and (m.publish = 'published' or is_admin() or judges_this_match(m.id)))
  );

-- Moderation: the committee may delete any message. A poster may withdraw
-- their own.
drop policy if exists chat_messages_delete on chat_messages;
create policy chat_messages_delete on chat_messages for delete
  to authenticated
  using (is_admin() or user_id = auth.uid());

alter publication supabase_realtime add table chat_messages;
alter table chat_messages replica identity full;
