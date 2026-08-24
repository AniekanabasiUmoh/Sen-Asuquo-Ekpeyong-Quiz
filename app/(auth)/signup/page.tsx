import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser, landingPathFor } from "@/lib/auth";

import { SignUpForm } from "../auth-forms";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create an account to register your school for the Senator Asuquo Ekpenyong Academic Championship.",
  robots: { index: false },
};

export default async function SignUpPage() {
  const user = await getSessionUser();
  if (user) redirect(landingPathFor(user));

  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        SAEAC Portal
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Create an account
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#003090]/60">
        One account per school. You will complete the registration form after
        signing in, and you can save it and return to it at any point.
      </p>

      <div className="mt-9">
        <SignUpForm />
      </div>
    </>
  );
}
