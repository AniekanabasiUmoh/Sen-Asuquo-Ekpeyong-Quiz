import Link from "next/link";

import { getSessionUser, isAdmin } from "@/lib/auth";

import { signOut } from "../(auth)/actions";

/**
 * Portal shell.
 *
 * Separate from the public site's floating pill nav: once signed in the job is
 * navigation between a small number of workspaces, not marketing. Nav items are
 * filtered by role, but that is a convenience only. Every page behind this
 * shell does its own server-side role check, and RLS is the boundary underneath
 * both.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const admin = isAdmin(user);

  const links: Array<{ href: string; label: string }> = [
    { href: "/portal", label: "Overview" },
  ];
  if (user) {
    links.push({ href: "/portal/school", label: "My school" });
    links.push({ href: "/portal/school/team", label: "Our team" });
    links.push({ href: "/portal/volunteer", label: "Volunteering" });
    if (admin || user.roles.includes("judge")) {
      links.push({ href: "/portal/match", label: "Matches" });
    }
    if (admin) {
      links.push({ href: "/portal/admin", label: "Registrations" });
      links.push({ href: "/portal/admin/schedule", label: "Schedule" });
      links.push({ href: "/portal/admin/lgas", label: "Groupings" });
      links.push({ href: "/portal/admin/broadcast", label: "Broadcast" });
      links.push({ href: "/portal/admin/accreditation", label: "Accreditation" });
      links.push({ href: "/portal/admin/volunteers", label: "Change Makers" });
      links.push({ href: "/portal/admin/reports", label: "Reports" });
      links.push({ href: "/portal/admin/users", label: "Users" });
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4">
          <Link href="/" className="font-display text-lg font-extrabold tracking-[-0.01em]">
            SÆAC
          </Link>

          <nav aria-label="Portal" className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] font-semibold text-primary/65 transition hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden text-[13px] text-primary/50 sm:inline">
                  {user.fullName ?? user.email}
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-5 py-2 text-[12px] font-semibold transition hover:bg-cream"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-gold px-5 py-2 text-[12px] font-bold text-primary transition hover:bg-primary hover:text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:py-14">{children}</main>
    </div>
  );
}
