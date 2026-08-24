import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";
import type { AppRole } from "./supabase/types";

/**
 * Server-side session and role helpers.
 *
 * Every one of these is a *server* check. UI that hides a link is a
 * convenience, not a control: RLS in Postgres is the real boundary, and these
 * helpers are the second layer in front of it. Never gate a privileged action
 * on client state alone.
 */

export type SessionUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  roles: AppRole[];
};

/** The signed-in user with their roles, or null. Never throws. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();

  // getUser(), not getSession(): getUser revalidates the JWT with the auth
  // server, so a revoked or forged token is rejected. getSession trusts the
  // cookie, which is not safe for an authorization decision.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    roles: (roleRows ?? []).map((r) => r.role as AppRole),
  };
}

/** Redirects to the login page when signed out. Returns the user otherwise. */
export async function requireUser(nextPath?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${next}`);
  }
  return user;
}

/** Redirects unless the user holds one of `roles`. */
export async function requireRole(
  roles: readonly AppRole[],
  nextPath?: string,
): Promise<SessionUser> {
  const user = await requireUser(nextPath);
  if (!user.roles.some((r) => roles.includes(r))) {
    redirect("/portal?denied=1");
  }
  return user;
}

export function isAdmin(user: SessionUser | null): boolean {
  return !!user?.roles.some((r) => r === "super_admin" || r === "committee");
}

/**
 * Where a user lands after signing in.
 *
 * Guide §2.2 asks for one login gateway that redirects by role rather than
 * separate portals. Order matters: the most privileged role wins, so someone
 * who is both committee and school_admin lands on the admin view.
 */
export function landingPathFor(user: SessionUser): string {
  if (isAdmin(user)) return "/portal/admin";
  if (user.roles.includes("school_admin") || user.roles.includes("coach")) {
    return "/portal/school";
  }
  return "/portal";
}

/**
 * Writes an audit entry.
 *
 * Uses the caller's own client so the row is attributed to them and the
 * append-only policy applies. Audit failures must never break the action that
 * triggered them, so this swallows errors and reports success instead.
 */
export async function writeAudit(entry: {
  action: string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  reason?: string | null;
}): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: entry.action,
      entity: entry.entity,
      entity_id: entry.entityId ?? null,
      before: (entry.before ?? null) as never,
      after: (entry.after ?? null) as never,
      reason: entry.reason ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}
