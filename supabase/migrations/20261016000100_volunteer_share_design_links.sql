-- Login-free private links let accepted volunteers download a branded graphic
-- made from the photo they submitted with their application.
--
-- Only a SHA-256 hash is stored. The original random token is sent by email and
-- is never written to the database. A committee resend rotates the token.
alter table public.volunteers
  add column share_token_hash text,
  add column share_token_expires_at timestamptz,
  add constraint volunteers_share_token_hash_unique unique (share_token_hash),
  add constraint volunteers_share_token_pair_check
    check ((share_token_hash is null) = (share_token_expires_at is null));

comment on column public.volunteers.share_token_hash is
  'SHA-256 hash of the current private volunteer design download token.';
comment on column public.volunteers.share_token_expires_at is
  'Expiry for the current private volunteer design download token.';
