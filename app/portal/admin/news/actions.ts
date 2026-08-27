"use server";

import { revalidatePath } from "next/cache";

import { requireStepUp, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PublishStatus } from "@/lib/supabase/types";

export type NewsAdminState = { error?: string; notice?: string };

const STATUSES: PublishStatus[] = ["draft", "review", "published", "archived"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function createNews(
  _prev: NewsAdminState,
  formData: FormData,
): Promise<NewsAdminState> {
  const user = await requireStepUp(["super_admin", "committee"], "/portal/admin/news");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const category = String(formData.get("category") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const imagePath = String(formData.get("image_path") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as PublishStatus;

  if (!title) return { error: "Give the article a title." };
  if (!slug) return { error: "Give the article a URL slug." };
  if (!STATUSES.includes(status)) return { error: "Choose a valid publication status." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .insert({
      title,
      slug,
      category: category || null,
      excerpt: excerpt || null,
      body: body || null,
      image_path: imagePath || null,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      author_id: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: `Could not create article: ${error.message}` };

  await writeAudit({
    action: "news.created",
    entity: "news",
    entityId: data.id,
    after: { title, slug, status },
  });
  revalidatePath("/portal/admin/news");
  revalidatePath("/news");
  revalidatePath("/", "layout");
  return { notice: `${title} saved.` };
}

export async function setNewsStatus(
  _prev: NewsAdminState,
  formData: FormData,
): Promise<NewsAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/news");
  const id = String(formData.get("news_id") ?? "");
  const status = String(formData.get("status") ?? "") as PublishStatus;
  if (!id) return { error: "No article given." };
  if (!STATUSES.includes(status)) return { error: "Choose a valid publication status." };

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("news")
    .select("title, status")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { error: "That article could not be found." };

  const { error } = await supabase
    .from("news")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { error: `Could not update article: ${error.message}` };

  await writeAudit({
    action: "news.status_changed",
    entity: "news",
    entityId: id,
    before: { status: before.status },
    after: { status },
  });
  revalidatePath("/portal/admin/news");
  revalidatePath("/news");
  revalidatePath("/", "layout");
  return { notice: `${before.title} is now ${status}.` };
}
