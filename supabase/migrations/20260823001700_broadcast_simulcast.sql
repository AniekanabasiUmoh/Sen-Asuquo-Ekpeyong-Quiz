-- SAEAC — Phase 4 sprint 4.2: simulcast links for the live streaming page.
--
-- A broadcast already tracks one YouTube embed. The RD deck and the client's
-- own reach (a Facebook audience larger than the website's) both point at
-- more than one platform carrying the stream simultaneously. Rather than a
-- rigid facebook_url / tiktok_url / x_url column set — adding a platform
-- later would be a migration — this is a small jsonb array of
-- {platform, url, label}, validated by an immutable function rather than an
-- inline check: Postgres check constraints cannot contain a subquery, and
-- jsonb_array_elements() is one.

create or replace function is_valid_simulcast_links(links jsonb)
returns boolean
language sql
immutable
as $$
  select jsonb_typeof(links) = 'array'
    and not exists (
      select 1 from jsonb_array_elements(links) elem
      where not (
        elem ? 'platform' and elem ? 'url'
        and jsonb_typeof(elem -> 'platform') = 'string'
        and jsonb_typeof(elem -> 'url') = 'string'
      )
    );
$$;

alter table broadcasts
  add column if not exists simulcast_links jsonb not null default '[]'::jsonb;

alter table broadcasts
  drop constraint if exists broadcasts_simulcast_links_shape;

alter table broadcasts
  add constraint broadcasts_simulcast_links_shape
  check (is_valid_simulcast_links(simulcast_links));
