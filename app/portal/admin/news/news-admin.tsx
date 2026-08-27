"use client";

import { useActionState } from "react";

import { FormError, FormNotice, Input, SubmitButton, Textarea } from "@/components/form";
import type { News, PublishStatus } from "@/lib/supabase/types";

import { createNews, setNewsStatus, type NewsAdminState } from "./actions";

const EMPTY: NewsAdminState = {};
const STATUSES: PublishStatus[] = ["draft", "review", "published", "archived"];

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
