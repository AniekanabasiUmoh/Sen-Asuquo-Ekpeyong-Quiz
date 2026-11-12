-- Editorial covers remain private until referenced by a published article.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-media', 'news-media', false, 3145728, array['image/webp'])
on conflict (id) do nothing;

create policy saeac_news_media_read on storage.objects for select
using (bucket_id = 'news-media' and (
  public.is_admin() or exists (
    select 1 from public.news
    where news.status = 'published' and news.image_path = '/api/news-media/' || storage.objects.name
  )
));

create policy saeac_news_media_insert on storage.objects for insert
with check (bucket_id = 'news-media' and public.is_admin());

create policy saeac_news_media_delete on storage.objects for delete
using (bucket_id = 'news-media' and public.is_admin());
