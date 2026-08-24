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
      {/* WCAG 2.4.1 (Level A). The nav carries two dropdown groups, so without
          this a keyboard or screen-reader user tabs roughly fifteen links
          before reaching the content on every single page load. Visually
          hidden until focused, then it sits above the header. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-[13px] focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader overlay={pathname === "/"} />
      {/* tabIndex={-1} so the skip link can move focus here, not just scroll:
          without it the browser jumps the viewport but leaves focus in the
          header, and the next Tab returns to the nav the user just skipped. */}
      <main id="main" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
