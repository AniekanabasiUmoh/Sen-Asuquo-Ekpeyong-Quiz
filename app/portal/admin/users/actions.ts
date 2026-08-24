"use server";

import { revalidatePath } from "next/cache";

import { requireRole, writeAudit } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/supabase/types";

/**
 * User and role management.
 *
 * Granting a role is the sharpest tool in the portal, so it is the one place
 * that uses the service-role client: user_roles is deliberately writable only
 * by an admin under RLS, and listing every profile means reading rows the
 * signed-in admin's own policies would filter. Both callers below re-check the
 * caller's role server-side first.
 */

export type UserState = { error?: string; notice?: string };

const ADMIN_ROLES = ["super_admin", "committee"] as const;

const ASSIGNABLE: AppRole[] = [
  "super_admin",
  "committee",
  "school_admin",
  "coach",
  "judge",
  "volunteer",
  "viewer",
];

export async function grantRole(
  _prev: UserState,
  formData: FormData,
): Promise<UserState> {
  const actor = await requireRole(ADMIN_ROLES, "/portal/admin/users");

  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "") as AppRole;

  if (!userId) return { error: "No user given." };
  if (!ASSIGNABLE.includes(role)) return { error: "That is not a role we grant." };

  // Only a super_admin may mint another super_admin. A committee member with
  // narrow permissions must not be able to promote themselves past them.
  if (role === "super_admin" && !actor.roles.includes("super_admin")) {
    return { error: "Only a super admin can grant the super admin role." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("user_roles")
    .insert({ user_id: userId, role });

  // Granting a role someone already holds is a no-op, not a failure.
  if (error && !error.message.includes("duplicate")) {
    return { error: `Could not grant the role: ${error.message}` };
  }

  await writeAudit({
    action: "role.granted",
    entity: "user_roles",
    entityId: userId,
    after: { role },
  });

  revalidatePath("/portal/admin/users");
  return { notice: `Granted ${role.replace("_", " ")}.` };
}

export async function revokeRole(
  _prev: UserState,
  formData: FormData,
): Promise<UserState> {
  const actor = await requireRole(ADMIN_ROLES, "/portal/admin/users");

  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "") as AppRole;

  if (!userId) return { error: "No user given." };

  if (role === "super_admin" && !actor.roles.includes("super_admin")) {
    return { error: "Only a super admin can revoke the super admin role." };
  }

  // Refuse to remove the last super_admin: an account nobody can administer is
  // a locked door with the key inside.
  if (role === "super_admin") {
    const admin = createAdminClient();
    const { count } = await admin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin");
    if ((count ?? 0) <= 1) {
      return {
        error:
          "This is the only super admin. Grant the role to someone else before revoking it.",
      };
    }
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role);

  if (error) return { error: `Could not revoke the role: ${error.message}` };

  await writeAudit({
    action: "role.revoked",
    entity: "user_roles",
    entityId: userId,
    before: { role },
  });

  revalidatePath("/portal/admin/users");
  return { notice: `Revoked ${role.replace("_", " ")}.` };
}

/** Everyone with an account, their roles, and the school they own if any. */
export async function listUsers() {
  await requireRole(ADMIN_ROLES, "/portal/admin/users");
  const admin = createAdminClient();

  const [{ data: profiles }, { data: roles }, { data: schools }] =
    await Promise.all([
      admin.from("profiles").select("*").order("created_at", { ascending: false }),
      admin.from("user_roles").select("user_id, role"),
      admin.from("schools").select("id, name, owner_id"),
    ]);

  const byUser = new Map<string, AppRole[]>();
  for (const r of roles ?? []) {
    const list = byUser.get(r.user_id) ?? [];
    list.push(r.role as AppRole);
    byUser.set(r.user_id, list);
  }

  const schoolByOwner = new Map(
    (schools ?? []).filter((s) => s.owner_id).map((s) => [s.owner_id as string, s.name]),
  );

  return (profiles ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name,
    email: p.email,
    createdAt: p.created_at,
    roles: byUser.get(p.id) ?? [],
    school: schoolByOwner.get(p.id) ?? null,
  }));
}

/** Reads the audit trail. Admin-only under RLS, so the normal client is fine. */
export async function listAudit(limit = 50) {
  await requireRole(ADMIN_ROLES, "/portal/admin/users");
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
