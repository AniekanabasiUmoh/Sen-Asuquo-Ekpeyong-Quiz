"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Wraps every page in the shared header and footer.
 *
 * Two exceptions, both deliberate:
 *
 * - The homepage takes the overlay header, because it has a full-bleed
 *   photographic hero for the header to float on. Everywhere else the header
 *   is a solid bar.
 * - The archived Phase 0 concepts at /b–/e and their index at /directions
 *   carry their own headers and footers. They are a record of the design
 *   review, so they keep the chrome they were reviewed with rather than
 *   inheriting the chosen direction's.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isArchivedConcept =
    /^\/(b|c|d|e|directions)(\/|$)/.test(pathname);

  if (isArchivedConcept) return <>{children}</>;

  return (
    <>
      <SiteHeader overlay={pathname === "/"} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
