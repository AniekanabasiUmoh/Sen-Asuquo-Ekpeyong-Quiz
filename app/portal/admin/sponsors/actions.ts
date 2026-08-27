"use server";

import { revalidatePath } from "next/cache";
import { requireStepUp, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PublishStatus } from "@/lib/supabase/types";

export type SponsorAdminState = { error?: string; notice?: string };
const STATUSES: PublishStatus[] = ["draft", "review", "published", "archived"];
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100); }

export async function createSponsor(_prev: SponsorAdminState, formData: FormData): Promise<SponsorAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/sponsors");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || name);
  const tier = String(formData.get("tier") ?? "").trim();
  const logoPath = String(formData.get("logo_path") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as PublishStatus;
  if (!name || !slug) return { error: "Enter the sponsor name." };
  if (!STATUSES.includes(status)) return { error: "Choose a valid publication status." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("sponsors").insert({ name, slug, tier: tier || null, logo_path: logoPath || null, website: website || null, status }).select("id").single();
  if (error) return { error: `Could not create sponsor: ${error.message}` };
  await writeAudit({ action: "sponsor.created", entity: "sponsors", entityId: data.id, after: { name, slug, status } });
  revalidatePath("/portal/admin/sponsors"); revalidatePath("/get-involved"); revalidatePath("/");
  return { notice: `${name} saved.` };
}

export async function setSponsorStatus(_prev: SponsorAdminState, formData: FormData): Promise<SponsorAdminState> {
  await requireStepUp(["super_admin", "committee"], "/portal/admin/sponsors");
  const id = String(formData.get("sponsor_id") ?? "");
  const status = String(formData.get("status") ?? "") as PublishStatus;
  if (!id || !STATUSES.includes(status)) return { error: "Choose a sponsor and a valid status." };
  const supabase = await createClient();
  const { data: before } = await supabase.from("sponsors").select("name, status").eq("id", id).maybeSingle();
  if (!before) return { error: "That sponsor could not be found." };
  const { error } = await supabase.from("sponsors").update({ status }).eq("id", id);
  if (error) return { error: `Could not update sponsor: ${error.message}` };
  await writeAudit({ action: "sponsor.status_changed", entity: "sponsors", entityId: id, before: { status: before.status }, after: { status } });
  revalidatePath("/portal/admin/sponsors"); revalidatePath("/get-involved"); revalidatePath("/");
  return { notice: `${before.name} is now ${status}.` };
}
