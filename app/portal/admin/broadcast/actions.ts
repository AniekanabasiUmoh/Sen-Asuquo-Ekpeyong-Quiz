"use server";

import { revalidatePath } from "next/cache";

import { requireRole, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type BroadcastState = { error?: string; notice?: string };

const ADMIN_ROLES = ["super_admin", "committee"] as const;

/**
 * Accepts either a YouTube URL or a bare video id and stores the id.
 *
 * Storing the id rather than a pasted URL means the page decides the embed
 * parameters, and a full URL with tracking or autoplay arguments cannot arrive
 * from a form field.
 */
function youtubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = raw.match(p);
    if (m) return m[1];
  }
  return null;
}

export async function saveBroadcast(
  _prev: BroadcastState,
  formData: FormData,
): Promise<BroadcastState> {
  await requireRole(ADMIN_ROLES, "/portal/admin/broadcast");

  const title = String(formData.get("title") ?? "").trim();
  const matchId = String(formData.get("match_id") ?? "");
  const link = String(formData.get("embed") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();

  if (!title) return { error: "Give the broadcast a title." };

  const embedId = link ? youtubeId(link) : null;
  if (link && !embedId) {
    return {
      error:
        "That does not look like a YouTube link or video id. Paste the watch or live URL.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("broadcasts").insert({
    title,
    match_id: matchId || null,
    embed_id: embedId,
    starts_at: startsAt ? new Date(startsAt).toISOString() : null,
  });

  if (error) return { error: `Could not save: ${error.message}` };

  await writeAudit({ action: "broadcast.created", entity: "broadcasts", after: { title } });
  revalidatePath("/portal/admin/broadcast");
  revalidatePath("/live");
  return { notice: `${title} saved.` };
}

/**
 * Adds one simulcast link (Facebook, TikTok, X, another YouTube channel, ...).
 *
 * Appended to the existing array rather than replaced, so adding a second
 * platform does not require re-entering the first. The database's
 * is_valid_simulcast_links() check is the actual guarantee; this only avoids
 * sending it something malformed in the first place.
 */
export async function addSimulcastLink(
  _prev: BroadcastState,
  formData: FormData,
): Promise<BroadcastState> {
  await requireRole(ADMIN_ROLES, "/portal/admin/broadcast");

  const broadcastId = String(formData.get("broadcast_id") ?? "");
  const platform = String(formData.get("platform") ?? "").trim();
  const link = String(formData.get("url") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();

  if (!broadcastId) return { error: "No broadcast given." };
  if (!platform) return { error: "Choose a platform." };
  if (!link) return { error: "Enter the stream link." };
  try {
    new URL(link);
  } catch {
    return { error: "That does not look like a web address." };
  }

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("broadcasts")
    .select("simulcast_links")
    .eq("id", broadcastId)
    .maybeSingle();

  const links = [
    ...((current?.simulcast_links as { platform: string; url: string; label?: string }[]) ?? []),
    { platform, url: link, label: label || undefined },
  ];

  const { error } = await supabase
    .from("broadcasts")
    .update({ simulcast_links: links })
    .eq("id", broadcastId);

  if (error) return { error: `Could not add the link: ${error.message}` };

  revalidatePath("/portal/admin/broadcast");
  revalidatePath("/live");
  return { notice: "Simulcast link added." };
}

export async function removeSimulcastLink(
  _prev: BroadcastState,
  formData: FormData,
): Promise<BroadcastState> {
  await requireRole(ADMIN_ROLES, "/portal/admin/broadcast");

  const broadcastId = String(formData.get("broadcast_id") ?? "");
  const index = Number(formData.get("index") ?? -1);

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("broadcasts")
    .select("simulcast_links")
    .eq("id", broadcastId)
    .maybeSingle();

  const links = (
    (current?.simulcast_links as { platform: string; url: string; label?: string }[]) ?? []
  ).filter((_, i) => i !== index);

  const { error } = await supabase
    .from("broadcasts")
    .update({ simulcast_links: links })
    .eq("id", broadcastId);

  if (error) return { error: `Could not remove the link: ${error.message}` };

  revalidatePath("/portal/admin/broadcast");
  revalidatePath("/live");
  return { notice: "Removed." };
}

export async function setBroadcastState(
  _prev: BroadcastState,
  formData: FormData,
): Promise<BroadcastState> {
  await requireRole(ADMIN_ROLES, "/portal/admin/broadcast");

  const id = String(formData.get("broadcast_id") ?? "");
  const publish = formData.get("publish") === "1";
  const status = String(formData.get("status") ?? "");

  const patch: Record<string, unknown> = {
    publish: publish ? "published" : "draft",
  };
  if (status) patch.status = status;

  const supabase = await createClient();
  const { error } = await supabase
    .from("broadcasts")
    .update(patch as never)
    .eq("id", id);

  if (error) return { error: `Could not update: ${error.message}` };

  revalidatePath("/portal/admin/broadcast");
  revalidatePath("/live");
  return { notice: publish ? "Published." : "Unpublished." };
}
