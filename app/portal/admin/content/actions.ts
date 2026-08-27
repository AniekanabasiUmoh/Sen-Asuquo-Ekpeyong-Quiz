"use server";

import { revalidatePath } from "next/cache";
import { requireStepUp, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PublishStatus } from "@/lib/supabase/types";

export type ContentAdminState = { error?: string; notice?: string };
const STATUSES: PublishStatus[] = ["draft", "review", "published", "archived"];
const adminRoles = ["super_admin", "committee"] as const;

export async function createFaq(_prev: ContentAdminState, formData: FormData): Promise<ContentAdminState> {
  const user = await requireStepUp(adminRoles, "/portal/admin/content");
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as PublishStatus;
  if (!question || !answer) return { error: "Enter both the question and answer." };
  if (!STATUSES.includes(status)) return { error: "Choose a valid publication status." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").insert({ question, answer, category: category || null, status }).select("id").single();
  if (error) return { error: `Could not create FAQ: ${error.message}` };
  await writeAudit({ action: "faq.created", entity: "faqs", entityId: data.id, after: { question, status, author_id: user.id } });
  revalidatePath("/portal/admin/content"); revalidatePath("/faq");
  return { notice: "FAQ saved." };
}

export async function setFaqStatus(_prev: ContentAdminState, formData: FormData): Promise<ContentAdminState> {
  await requireStepUp(adminRoles, "/portal/admin/content");
  const id = String(formData.get("faq_id") ?? "");
  const status = String(formData.get("status") ?? "") as PublishStatus;
  if (!id || !STATUSES.includes(status)) return { error: "Choose an FAQ and a valid status." };
  const supabase = await createClient();
  const { data: before } = await supabase.from("faqs").select("question, status").eq("id", id).maybeSingle();
  if (!before) return { error: "That FAQ could not be found." };
  const { error } = await supabase.from("faqs").update({ status }).eq("id", id);
  if (error) return { error: `Could not update FAQ: ${error.message}` };
  await writeAudit({ action: "faq.status_changed", entity: "faqs", entityId: id, before: { status: before.status }, after: { status } });
  revalidatePath("/portal/admin/content"); revalidatePath("/faq");
  return { notice: "FAQ status updated." };
}

export async function createDownload(_prev: ContentAdminState, formData: FormData): Promise<ContentAdminState> {
  const user = await requireStepUp(adminRoles, "/portal/admin/content");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const version = String(formData.get("version") ?? "").trim();
  const fileUrl = String(formData.get("file_url") ?? "").trim();
  const fileSize = Number(formData.get("file_size_bytes") ?? 0);
  const status = String(formData.get("status") ?? "draft") as PublishStatus;
  if (!title || !fileUrl) return { error: "Enter a title and file URL." };
  if (!STATUSES.includes(status)) return { error: "Choose a valid publication status." };
  if (fileUrl.startsWith("//") || (!fileUrl.startsWith("/") && !/^https:\/\//i.test(fileUrl))) return { error: "File URL must be a site path or HTTPS URL." };
  if (fileUrl.length > 2048) return { error: "That file URL is too long." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("downloads").insert({ title, description: description || null, version: version || null, file_url: fileUrl, file_size_bytes: Number.isFinite(fileSize) && fileSize > 0 ? fileSize : null, status, published_at: status === "published" ? new Date().toISOString() : null }).select("id").single();
  if (error) return { error: `Could not create download: ${error.message}` };
  await writeAudit({ action: "download.created", entity: "downloads", entityId: data.id, after: { title, status, author_id: user.id } });
  revalidatePath("/portal/admin/content"); revalidatePath("/downloads");
  return { notice: "Download saved." };
}

export async function setDownloadStatus(_prev: ContentAdminState, formData: FormData): Promise<ContentAdminState> {
  await requireStepUp(adminRoles, "/portal/admin/content");
  const id = String(formData.get("download_id") ?? "");
  const status = String(formData.get("status") ?? "") as PublishStatus;
  if (!id || !STATUSES.includes(status)) return { error: "Choose a download and a valid status." };
  const supabase = await createClient();
  const { data: before } = await supabase.from("downloads").select("title, status").eq("id", id).maybeSingle();
  if (!before) return { error: "That download could not be found." };
  const { error } = await supabase.from("downloads").update({ status, published_at: status === "published" ? new Date().toISOString() : null }).eq("id", id);
  if (error) return { error: `Could not update download: ${error.message}` };
  await writeAudit({ action: "download.status_changed", entity: "downloads", entityId: id, before: { status: before.status }, after: { status } });
  revalidatePath("/portal/admin/content"); revalidatePath("/downloads");
  return { notice: "Download status updated." };
}
