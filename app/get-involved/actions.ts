"use server";

import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type VolunteerState = { error?: string; notice?: string };

/**
 * Change Maker application, Content Guide §4.14.
 *
 * Open to anyone, signed in or not: the RLS policy lets the anon role insert
 * into volunteers but not read it back, so an applicant cannot enumerate other
 * applications. If they happen to be signed in, the row is linked to their
 * account so it appears in their portal.
 */
export async function applyToVolunteer(
  _prev: VolunteerState,
  formData: FormData,
): Promise<VolunteerState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const lgaId = String(formData.get("lga_id") ?? "");
  const roleSought = String(formData.get("role_sought") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!fullName) return { error: "Enter your full name." };
  if (!email) return { error: "Enter your email address." };

  const user = await getSessionUser();
  const supabase = await createClient();

  const { error } = await supabase.from("volunteers").insert({
    user_id: user?.id ?? null,
    full_name: fullName,
    email,
    phone: phone || null,
    lga_id: lgaId || null,
    role_sought: roleSought || null,
    notes: notes || null,
  });

  if (error) {
    return { error: `Could not send your application: ${error.message}` };
  }

  return {
    notice:
      "Your application has reached the Organising Committee. Someone will be in touch about the next steps.",
  };
}
