import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser, landingPathFor } from "@/lib/auth";

import { SignInForm } from "../auth-forms";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to the SAEAC portal to manage your school's registration and team.",
  robots: { index: false },
};

/**
 * The single login gateway, per Content Guide §2.2.
 *
 * One door for every role. Where a user lands afterwards is decided by
 * landingPathFor(), not by which form they used, so there is no separate
 * "admin login" to find or to guess at.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect(landingPathFor(user));

  const { next } = await searchParams;

  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        SAEAC Portal
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Sign in
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#003090]/60">
        For schools, coaches and officials taking part in the championship.
      </p>

      <div className="mt-9">
        <SignInForm next={next} />
      </div>
    </>
  );
}
