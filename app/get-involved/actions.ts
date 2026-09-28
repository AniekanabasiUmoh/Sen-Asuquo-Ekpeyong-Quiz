"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import {
  sendVolunteerApplicationAdminAlertEmail,
  sendVolunteerApplicationReceivedEmail,
} from "@/lib/email";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export type VolunteerState = { error?: string; notice?: string };

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const PHOTO_TYPES = {
  "image/jpeg": { extension: "jpg", matches: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { extension: "png", matches: (b: Uint8Array) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a },
  "image/webp": { extension: "webp", matches: (b: Uint8Array) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP" },
} as const;

/**
 * Public volunteer registration. It deliberately creates no portal account;
 * the committee manages applications from the protected admin dashboard.
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
  const lgaId = String(formData.get("lga_id") ?? "").trim();
  const roleSought = String(formData.get("role_sought") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const uploaded = formData.get("photo");
  const photo = uploaded instanceof File && uploaded.size > 0 ? uploaded : null;

  if (!fullName) return { error: "Enter your full name." };
  if (fullName.length > 120) return { error: "Keep your name under 120 characters." };
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!lgaId) return { error: "Select your Local Government of residence." };
  if (phone.length > 30) return { error: "Keep your phone number under 30 characters." };
  if (roleSought.length > 120) return { error: "Keep your preferred role under 120 characters." };
  if (notes.length > 1000) return { error: "Keep your additional information under 1,000 characters." };
  if (photo && photo.size > MAX_PHOTO_BYTES) {
    return { error: "Choose a photo smaller than 3 MB." };
  }

  let photoPath: string | null = null;
  let photoAdmin: ReturnType<typeof createAdminClient> | null = null;

  if (photo) {
    const photoType = PHOTO_TYPES[photo.type as keyof typeof PHOTO_TYPES];
    const signature = new Uint8Array(await photo.slice(0, 12).arrayBuffer());
    if (!photoType || !photoType.matches(signature)) {
      return { error: "Use a valid JPG, PNG or WebP image." };
    }

    photoPath = `${randomUUID()}.${photoType.extension}`;
    try {
      photoAdmin = createAdminClient();
      const { error } = await photoAdmin.storage
        .from("volunteer-photos")
        .upload(photoPath, photo, {
          contentType: photo.type,
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        console.error("[volunteer] private photo upload failed", error.name);
        return { error: "We could not save your photo. Please try again later or submit without it." };
      }
    } catch (error) {
      console.error(
        "[volunteer] private photo upload is unavailable",
        error instanceof Error ? error.name : "unknown error",
      );
      return { error: "Photo uploads are temporarily unavailable. Please try again later or submit without a photo." };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from("volunteers").insert({
    // A public application is not a portal sign-up. Keep it unlinked even if
    // a browser happens to have another SAEAC account signed in.
    user_id: null,
    full_name: fullName,
    email,
    phone: phone || null,
    lga_id: lgaId,
    role_sought: roleSought || null,
    notes: notes || null,
    photo_path: photoPath,
  });

  if (error) {
    if (photoPath && photoAdmin) {
      await photoAdmin.storage.from("volunteer-photos").remove([photoPath]);
    }
    console.error("[volunteer] application insert failed", error.code);
    return { error: "We could not record your application. Please check your details and try again." };
  }

  const { data: lga } = await supabase
    .from("lgas")
    .select("name")
    .eq("id", lgaId)
    .maybeSingle();

  // Email is a courtesy after the application is safely recorded. Provider
  // failures must not make a successful registration look unsuccessful.
  await Promise.all([
    sendVolunteerApplicationReceivedEmail(email, fullName),
    sendVolunteerApplicationAdminAlertEmail({
      volunteerName: fullName,
      volunteerEmail: email,
      phone,
      lgaName: lga?.name ?? "Not available",
      roleSought,
      hasPhoto: Boolean(photoPath),
    }),
  ]);

  revalidatePath("/portal/admin/volunteers");

  return {
    notice: `Thank you, ${fullName}. Your volunteer registration has been received by the Organising Committee. Your application is included in the volunteer register, and the Committee will contact you about next steps. You do not need to create an account.`,
  };
}
