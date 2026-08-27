"use server";

import { revalidatePath } from "next/cache";
import { requireStepUp, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { GalleryContentType, PublishStatus } from "@/lib/supabase/types";

export type GalleryAdminState = { error?: string; notice?: string };
const STATUSES: PublishStatus[] = ["draft", "review", "published", "archived"];
const CONTENT_TYPES: GalleryContentType[] = ["event", "school", "student", "people", "venue", "press"];

export async function createGalleryItem(_prev: GalleryAdminState, formData: FormData): Promise<GalleryAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/gallery");
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const imagePath = String(formData.get("image_path") ?? "").trim();
  const lgaId = String(formData.get("lga_id") ?? "").trim() || null;
  const stageId = String(formData.get("stage_id") ?? "").trim() || null;
  const contentType = String(formData.get("content_type") ?? "event") as GalleryContentType;
  const status = String(formData.get("status") ?? "draft") as PublishStatus;
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  if (!imagePath) return { error: "Add an approved image path before saving." };
  if (!STATUSES.includes(status)) return { error: "Choose a valid publication status." };
  if (!CONTENT_TYPES.includes(contentType)) return { error: "Choose a valid content type." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("gallery_items").insert({ title: title || null, caption: caption || null, image_path: imagePath, lga_id: lgaId, stage_id: stageId, content_type: contentType, status, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 }).select("id").single();
  if (error) return { error: `Could not create gallery item: ${error.message}` };
  await writeAudit({ action: "gallery.created", entity: "gallery_items", entityId: data.id, after: { title, imagePath, lgaId, stageId, contentType, status } });
  revalidatePath("/portal/admin/gallery"); revalidatePath("/gallery");
  return { notice: "Gallery item saved." };
}

export async function setGalleryStatus(_prev: GalleryAdminState, formData: FormData): Promise<GalleryAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/gallery");
  const id = String(formData.get("gallery_id") ?? "");
  const status = String(formData.get("status") ?? "") as PublishStatus;
  if (!id || !STATUSES.includes(status)) return { error: "Choose a gallery item and a valid status." };
  const supabase = await createClient();
  const { data: before } = await supabase.from("gallery_items").select("title, status").eq("id", id).maybeSingle();
  if (!before) return { error: "That gallery item could not be found." };
  const { error } = await supabase.from("gallery_items").update({ status }).eq("id", id);
  if (error) return { error: `Could not update gallery item: ${error.message}` };
  await writeAudit({ action: "gallery.status_changed", entity: "gallery_items", entityId: id, before: { status: before.status }, after: { status } });
  revalidatePath("/portal/admin/gallery"); revalidatePath("/gallery");
  return { notice: `${before.title || "Gallery item"} is now ${status}.` };
}
