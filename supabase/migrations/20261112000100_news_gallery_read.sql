-- A gallery object is public only when referenced by a published article.
drop policy if exists saeac_news_media_read on storage.objects;
create policy saeac_news_media_read on storage.objects for select
using (bucket_id = 'news-media' and (
  public.is_admin() or exists (
    select 1 from public.news
    where news.status = 'published' and (
      news.image_path = '/api/news-media/' || storage.objects.name or
      position('[[image:/api/news-media/' || storage.objects.name || '|' in coalesce(news.body, '')) > 0
    )
  )
));
