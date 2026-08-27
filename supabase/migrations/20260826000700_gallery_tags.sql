-- Gallery taxonomy from the content guide. Existing rows remain event images.
alter table gallery_items
  add column if not exists content_type text not null default 'event';

alter table gallery_items
  drop constraint if exists gallery_items_content_type_check;

alter table gallery_items
  add constraint gallery_items_content_type_check
  check (content_type in ('event', 'school', 'student', 'people', 'venue', 'press'));

create index if not exists gallery_items_taxonomy_idx
  on gallery_items (status, content_type, lga_id, stage_id, sort_order);
