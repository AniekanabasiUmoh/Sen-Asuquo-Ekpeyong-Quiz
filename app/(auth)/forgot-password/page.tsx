import type { Metadata } from "next";

import { ForgotPasswordForm } from "../auth-forms";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
        SAEAC Portal
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Reset your password
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-primary/60">
        Enter the email address you registered with and we will send a link to
        set a new password.
      </p>

      <div className="mt-9">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
