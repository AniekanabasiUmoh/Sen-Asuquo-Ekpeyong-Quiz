"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionUser, landingPathFor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string };

/**
 * Auth server actions.
 *
 * Error copy is deliberately non-committal about whether an email exists:
 * "those details did not match" rather than "no such account". Confirming which
 * addresses are registered is an account-enumeration leak, and school contact
 * addresses are semi-public.
 *
 * House style: no em dashes in user-facing copy.
 */

function readEmail(formData: FormData): string {
  return String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = readEmail(formData);
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Enter your email address and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("not confirmed")) {
      return {
        error:
          "Your email address has not been confirmed yet. Check your inbox for the confirmation link.",
      };
    }
    return { error: "Those details did not match an account. Please try again." };
  }

  const user = await getSessionUser();
  revalidatePath("/", "layout");
  redirect(next && next.startsWith("/") ? next : user ? landingPathFor(user) : "/portal");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = readEmail(formData);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!fullName) return { error: "Enter your full name." };
  if (!email) return { error: "Enter your email address." };
  if (password.length < 8) {
    return { error: "Choose a password of at least 8 characters." };
  }
  if (password !== confirm) return { error: "The two passwords do not match." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: error.message };
  }

  // With email confirmation on, signUp returns a user but no session. Say so
  // plainly rather than bouncing the user to a portal they cannot open yet.
  if (!data.session) {
    return {
      notice:
        "Account created. Check your email for a confirmation link, then sign in to continue your registration.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/portal/school");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = readEmail(formData);
  if (!email) return { error: "Enter your email address." };

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin ? `${origin}/reset-password` : undefined,
  });

  // Always the same answer, whether or not the address is registered.
  return {
    notice:
      "If that address has an account, a password reset link is on its way. Check your inbox.",
  };
}
