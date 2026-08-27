-- Dashboard communication centre for accepted Change Makers.
-- This deliberately does not claim SMS/email delivery; it gives the committee
-- a reliable, auditable in-portal broadcast channel while providers are gated.
create table if not exists volunteer_messages (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  shift_id     uuid references volunteer_shifts (id) on delete set null,
  publish      publish_status not null default 'draft',
  published_at timestamptz,
  created_by   uuid references profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint volunteer_messages_title_length check (char_length(title) between 1 and 160),
  constraint volunteer_messages_body_length check (char_length(body) between 1 and 5000)
);

create index if not exists volunteer_messages_delivery_idx
  on volunteer_messages (publish, shift_id, published_at desc);

alter table volunteer_messages enable row level security;
alter table volunteer_messages force row level security;

drop policy if exists volunteer_messages_admin on volunteer_messages;
create policy volunteer_messages_admin on volunteer_messages for all
  using (is_admin()) with check (is_admin());

drop policy if exists volunteer_messages_read_assigned on volunteer_messages;
create policy volunteer_messages_read_assigned on volunteer_messages for select
  using (
    publish = 'published'
    and exists (
      select 1
      from volunteers v
      where v.user_id = auth.uid()
        and v.status = 'accepted'
        and (
          volunteer_messages.shift_id is null
          or exists (
            select 1
            from volunteer_shift_assignments a
            where a.volunteer_id = v.id
              and a.shift_id = volunteer_messages.shift_id
          )
        )
    )
  );

drop trigger if exists volunteer_messages_set_updated_at on volunteer_messages;
create trigger volunteer_messages_set_updated_at
  before update on volunteer_messages
  for each row execute function set_updated_at();
