import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/server";

export const VOLUNTEER_DESIGN_LINK_DAYS = 30;

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ||
  "https://senatorasuquoekpeyongacademicchampionship.com";

export function createVolunteerDesignGrant() {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(
    Date.now() + VOLUNTEER_DESIGN_LINK_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  return { token, tokenHash, expiresAt };
}

export function volunteerDesignUrl(token: string) {
  return SITE_URL + "/volunteer/design/" + encodeURIComponent(token);
}

/**
 * A private bearer link is the volunteer's only access credential; registration
 * itself never creates an account. Keep the lookup limited to accepted
 * applicants and require a valid, unexpired token on every page/photo request.
 */
export async function findAcceptedVolunteerDesign(token: string) {
  if (!TOKEN_PATTERN.test(token)) return null;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("volunteers")
    .select("id, full_name, photo_path")
    .eq("share_token_hash", tokenHash)
    .eq("status", "accepted")
    .gt("share_token_expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("[volunteer-design] private-link lookup failed", error.code);
    return null;
  }

  return data?.photo_path
    ? { id: data.id, fullName: data.full_name, photoPath: data.photo_path }
    : null;
}
