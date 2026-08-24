import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser, landingPathFor } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false },
};

/**
 * The gateway landing. Signed-in users are sent straight to their workspace,
 * so this page is really only seen by someone signed out or denied.
 */
export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;
  const user = await getSessionUser();

  if (user && !denied) redirect(landingPathFor(user));

  return (
    <div className="max-w-2xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        SAEAC Portal
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        {denied ? "You do not have access to that page" : "Portal"}
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[#003090]/60">
        {denied
          ? "Your account does not carry the role that page requires. If you believe that is wrong, contact the Organising Committee."
          : "Sign in to manage your school's registration, or create an account to register a school for the championship."}
      </p>

      {!user ? (
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-full bg-[#f0a800] px-7 py-3.5 text-[13px] font-bold text-[#003090] transition hover:bg-[#003090] hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-black/15 px-7 py-3.5 text-[13px] font-semibold transition hover:bg-white"
          >
            Create an account
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <Link
            href="/portal/school"
            className="rounded-full border border-black/15 px-7 py-3.5 text-[13px] font-semibold transition hover:bg-white"
          >
            Go to my school
          </Link>
        </div>
      )}
    </div>
  );
}
