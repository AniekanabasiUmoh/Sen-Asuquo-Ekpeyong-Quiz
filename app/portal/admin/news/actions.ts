"use server";

import { revalidatePublicContent } from "@/lib/public-cache";

import { revalidatePath } from "next/cache";

import { requireStepUp, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PublishStatus } from "@/lib/supabase/types";
import sharp from "sharp";

export type NewsAdminState = { error?: string; notice?: string; updatedAt?: string };

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
  revalidatePublicContent("/news");
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
    .select("title, status, published_at, slug, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { error: "That article could not be found." };

  const { data: saved, error } = await supabase
    .from("news")
    .update({
      status,
      published_at: status === "published" ? (before.published_at ?? new Date().toISOString()) : before.published_at,
    })
    .eq("id", id).eq("updated_at", before.updated_at).select("id").maybeSingle();
  if (error) return { error: `Could not update article: ${error.message}` };
  if (!saved) return { error: "This article changed. Reload and try again." };

  await writeAudit({
    action: "news.status_changed",
    entity: "news",
    entityId: id,
    before: { status: before.status },
    after: { status },
  });
  revalidatePath("/portal/admin/news");
  revalidatePublicContent("/news");
  revalidatePath(`/news/${before.slug}`);
  revalidatePath("/", "layout");
  return { notice: `${before.title} is now ${status}.` };
}

export async function updateNews(
  _prev: NewsAdminState,
  formData: FormData,
): Promise<NewsAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/news");
  const id = String(formData.get("news_id") ?? "");
  const updatedAt = String(formData.get("updated_at") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const imagePath = String(formData.get("image_path") ?? "").trim();
  if (!id || !updatedAt || !title || !excerpt) return { error: "A title and summary are required.", updatedAt: _prev.updatedAt };
  if (title.length > 200 || excerpt.length > 1000 || body.length > 50000 || category.length > 100 || imagePath.length > 2048) return { error: "One of the fields is too long.", updatedAt: _prev.updatedAt };
  if (imagePath && !imagePath.startsWith("/img/") && !imagePath.startsWith("/news-media/") && !/^\/api\/news-media\/[0-9a-f-]{36}\.webp$/i.test(imagePath)) return { error: "Use a website image path or upload a cover.", updatedAt: _prev.updatedAt };
  const supabase = await createClient();
  const { data: before, error: readError } = await supabase.from("news").select("id, title, slug, updated_at").eq("id", id).maybeSingle();
  if (readError || !before) return { error: "Could not find this article.", updatedAt: _prev.updatedAt };
  if (before.updated_at !== updatedAt) return { error: "This article changed since you opened it. Reload the page and review the latest version before saving.", updatedAt: _prev.updatedAt };
  const { data, error } = await supabase.from("news").update({ title, excerpt, body: body || null, category: category || null, image_path: imagePath || null }).eq("id", id).eq("updated_at", updatedAt).select("id, updated_at").maybeSingle();
  if (error) return { error: `Could not save the article: ${error.message}`, updatedAt: _prev.updatedAt };
  if (!data) return { error: "This article changed while you were editing. Reload and try again.", updatedAt: _prev.updatedAt };
  await writeAudit({ action: "news.updated", entity: "news", entityId: id, before: { title: before.title }, after: { title } });
  revalidatePath("/portal/admin/news");
  revalidatePublicContent("/news");
  revalidatePath(`/news/${before.slug}`);
  revalidatePath("/", "layout");
  return { notice: `${title} saved.`, updatedAt: data.updated_at };
}

export async function uploadNewsCover(_prev: NewsAdminState, formData: FormData): Promise<NewsAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/news");
  const id = String(formData.get("news_id") ?? "");
  const updatedAt = String(formData.get("updated_at") ?? "");
  const file = formData.get("cover");
  const placement = String(formData.get("placement") ?? "cover");
  const caption = String(formData.get("caption") ?? "").trim();
  if (!id || !updatedAt || !(file instanceof File) || file.size === 0) return { error: "Choose an image to upload." };
  if (!["cover", "gallery"].includes(placement)) return { error: "Choose where to place this image." };
  if (placement === "gallery" && (!caption || caption.length > 180 || /[\]\r\n]/.test(caption))) return { error: "Give the gallery image a short caption without square brackets." };
  if (file.size > 3 * 1024 * 1024) return { error: "Choose an image smaller than 3 MB." };
  let output: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 40_000_000, failOn: "error" });
    const metadata = await image.metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) return { error: "Choose a JPEG, PNG or WebP image." };
    output = await image.rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    if (output.length > 3 * 1024 * 1024) return { error: "This image is too large after processing." };
  } catch { return { error: "Could not read that image. Choose a valid JPEG, PNG or WebP file." }; }
  const supabase = await createClient();
  const { data: article, error: readError } = await supabase.from("news").select("id, title, slug, updated_at, body").eq("id", id).maybeSingle();
  if (readError || !article) return { error: "Could not find this article." };
  if (article.updated_at !== updatedAt) return { error: "This article changed. Reload before uploading." };
  const filename = `${crypto.randomUUID()}.webp`;
  const { error: uploadError } = await supabase.storage.from("news-media").upload(filename, output, { contentType: "image/webp", upsert: false });
  if (uploadError) return { error: "Could not upload the image. Please try again." };
  const path = `/api/news-media/${filename}`;
  const changes = placement === "cover" ? { image_path: path } : { body: `${article.body?.trim() ?? ""}\n\n[[image:${path}|${caption}]]`.trim() };
  const { data: saved, error: saveError } = await supabase.from("news").update(changes).eq("id", id).eq("updated_at", updatedAt).select("id").maybeSingle();
  if (saveError || !saved) {
    await supabase.storage.from("news-media").remove([filename]);
    return { error: "The article changed or could not be saved. Reload and try again." };
  }
  await writeAudit({ action: "news.image_added", entity: "news", entityId: id, after: { image_path: path, placement } });
  revalidatePath("/portal/admin/news");
  revalidatePublicContent("/news");
  revalidatePath(`/news/${article.slug}`);
  revalidatePath("/", "layout");
  return { notice: `${placement === "cover" ? "Cover" : "Gallery"} image saved for ${article.title}.` };
}

export async function addNewsVideo(_prev: NewsAdminState, formData: FormData): Promise<NewsAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/news");
  const id = String(formData.get("news_id") ?? "");
  const updatedAt = String(formData.get("updated_at") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  let videoId = "";
  try {
    const url = new URL(String(formData.get("video_url") ?? ""));
    if (url.protocol !== "https:") throw new Error("Invalid protocol");
    const host = url.hostname.toLowerCase();
    if (host === "youtu.be") videoId = url.pathname.slice(1);
    else if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host) && url.pathname === "/watch") videoId = url.searchParams.get("v") ?? "";
  } catch { return { error: "Enter a valid YouTube video link." }; }
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return { error: "Enter a valid YouTube video link." };
  if (!caption || caption.length > 180 || /[\]\r\n]/.test(caption)) return { error: "Give the video a short title without square brackets." };
  const supabase = await createClient();
  const { data: article } = await supabase.from("news").select("id,title,slug,updated_at,body").eq("id", id).maybeSingle();
  if (!article || article.updated_at !== updatedAt) return { error: "This article changed or was not found. Reload and try again." };
  const body = `${article.body?.trim() ?? ""}\n\n[[youtube:${videoId}|${caption}]]`.trim();
  const { data: saved, error } = await supabase.from("news").update({ body }).eq("id", id).eq("updated_at", updatedAt).select("id").maybeSingle();
  if (error || !saved) return { error: "Could not add the video. Reload and try again." };
  await writeAudit({ action: "news.video_added", entity: "news", entityId: id, after: { video_id: videoId } });
  revalidatePath("/portal/admin/news"); revalidatePublicContent("/news"); revalidatePath(`/news/${article.slug}`); revalidatePath("/", "layout");
  return { notice: `Video added to ${article.title}.` };
}
