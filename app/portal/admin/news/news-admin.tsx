"use client";

import { useActionState, useState } from "react";

import { FormError, FormNotice, Input, SubmitButton, Textarea } from "@/components/form";
import type { News, PublishStatus } from "@/lib/supabase/types";

import { addNewsVideo, createNews, setNewsStatus, updateNews, uploadNewsCover, type NewsAdminState } from "./actions";

const EMPTY: NewsAdminState = {};
const STATUSES: PublishStatus[] = ["draft", "review", "published", "archived"];

function EditArticle({ article }: { article: News }) {
  const [state, action, pending] = useActionState(updateNews, EMPTY);
  const [uploadState, uploadAction, uploading] = useActionState(uploadNewsCover, EMPTY);
  const [videoState, videoAction, addingVideo] = useActionState(addNewsVideo, EMPTY);
  const [initialVersion] = useState(article.updated_at);
  const [title, setTitle] = useState(article.title);
  const [category, setCategory] = useState(article.category ?? "");
  const [imagePath, setImagePath] = useState(article.image_path ?? "");
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "");
  const [body, setBody] = useState(article.body ?? "");
  return (
    <details className="mt-4 border-t border-black/10 pt-4">
      <summary className="cursor-pointer text-sm font-bold">Edit article</summary>
      <form action={action} className="mt-4 space-y-4">
        <input type="hidden" name="news_id" value={article.id} />
        <input type="hidden" name="updated_at" value={state.updatedAt ?? initialVersion} />
        <FormError message={state.error} /><FormNotice message={state.notice} />
        <Input id={`title-${article.id}`} label="Title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <Input id={`category-${article.id}`} label="Category" name="category" value={category} onChange={(event) => setCategory(event.target.value)} />
        <Input id={`image-${article.id}`} label="Image path" name="image_path" value={imagePath} onChange={(event) => setImagePath(event.target.value)} hint="Use a website image path or upload an image below." />
        <Textarea id={`excerpt-${article.id}`} label="Summary" name="excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} required />
        <Textarea id={`body-${article.id}`} label="Article body" name="body" value={body} onChange={(event) => setBody(event.target.value)} rows={10} />
        {article.updated_at !== (state.updatedAt ?? initialVersion) ? <p className="text-sm font-semibold">The saved article has changed. Copy any unsaved text, then reload before editing again.</p> : null}
        <div className="flex flex-wrap items-center gap-4"><SubmitButton pending={pending}>Save changes</SubmitButton><a href={`/portal/admin/news/preview/${article.id}`} target="_blank" rel="noreferrer" className="text-sm font-semibold underline underline-offset-4">Preview saved article</a></div>
      </form>
      <form action={uploadAction} className="mt-5 space-y-3 border-t border-black/10 pt-4">
        <input type="hidden" name="news_id" value={article.id} /><input type="hidden" name="updated_at" value={article.updated_at} />
        <FormError message={uploadState.error} /><FormNotice message={uploadState.notice} />
        <Input id={`cover-${article.id}`} label="Upload an image" name="cover" type="file" accept="image/jpeg,image/png,image/webp" required hint="JPEG, PNG or WebP, up to 3 MB. Images added to a published article become public." />
        <label className="block text-sm font-semibold">Place image<select name="placement" className="mt-2 block w-full rounded-xl border border-black/15 px-3 py-2"><option value="cover">Replace cover</option><option value="gallery">Add to article gallery</option></select></label>
        <Input id={`caption-${article.id}`} label="Image caption" name="caption" hint="Required for gallery images." />
        <SubmitButton pending={uploading}>Upload image</SubmitButton>
      </form>
      <form action={videoAction} className="mt-5 space-y-3 border-t border-black/10 pt-4"><input type="hidden" name="news_id" value={article.id} /><input type="hidden" name="updated_at" value={article.updated_at} /><FormError message={videoState.error} /><FormNotice message={videoState.notice} /><Input id={`video-${article.id}`} label="YouTube video link" name="video_url" type="url" required /><Input id={`video-title-${article.id}`} label="Video title" name="caption" required /><SubmitButton pending={addingVideo}>Add video</SubmitButton></form>
    </details>
  );
}

export function NewsAdmin({ articles }: { articles: News[] }) {
  const [createState, createAction, createPending] = useActionState(createNews, EMPTY);
  const [statusState, statusAction, statusPending] = useActionState(setNewsStatus, EMPTY);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <section>
        <h2 className="font-display text-xl font-bold">Articles ({articles.length})</h2>
        {articles.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">
            No articles yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {articles.map((article) => (
              <li key={article.id} className="rounded-[24px] bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold">{article.title}</h3>
                    <p className="mt-1 text-[12px] text-primary/50">
                      {article.category || "Uncategorised"} · {article.slug}
                    </p>
                  </div>
                  <span className="rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/60">
                    {article.status}
                  </span>
                </div>
                <form action={statusAction} className="mt-4 flex flex-wrap items-end gap-3">
                  <input type="hidden" name="news_id" value={article.id} />
                  <label className="text-[12px] font-semibold text-primary">
                    Status
                    <select
                      name="status"
                      defaultValue={article.status}
                      className="mt-1.5 block rounded-xl border border-black/15 bg-white px-3 py-2 text-[13px]"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <SubmitButton pending={statusPending}>Save status</SubmitButton>
                </form>
                <EditArticle article={article} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">Create an article</h2>
        <form action={createAction} className="mt-5 rounded-[28px] bg-white p-7">
          <div className="space-y-5">
            <FormError message={createState.error || statusState.error} />
            <FormNotice message={createState.notice || statusState.notice} />
            <Input label="Title" name="title" required placeholder="Principals back the championship" />
            <Input label="Slug" name="slug" hint="Lowercase URL slug. Leave blank to derive it from the title." />
            <Input label="Category" name="category" placeholder="Announcement" />
            <Input label="Image path" name="image_path" hint="Use an approved public asset path, such as /img/meeting-group.jpg." />
            <Textarea label="Excerpt" name="excerpt" rows={3} required />
            <Textarea label="Article body" name="body" rows={7} />
            <label className="block text-[13px] font-semibold text-primary">
              Initial status
              <select name="status" defaultValue="draft" className="mt-2 block w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]">
                {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <SubmitButton pending={createPending}>Save article</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
