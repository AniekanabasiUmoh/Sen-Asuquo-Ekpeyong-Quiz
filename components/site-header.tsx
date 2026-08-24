"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedLogo } from "@/components/animated-logo";
import { nav, navCtas } from "@/content/homepage";

/**
 * Site header, per Content Guide §3.1.
 *
 * Two modes. Over the homepage hero it is transparent glass, floating on the
 * photography exactly as it did when the site was one page. On every other
 * page there is no hero behind it, so it becomes a solid cream bar with navy
 * type. `overlay` picks the mode.
 *
 * The "Register Your School" button is fixed in the header, separate from the
 * nav, per §3.1. Round 2 removed it at the client's request when the site was
 * a single page and the CTA was duplicated three times below the fold; with
 * real pages the header is now the only place it can live, so it returns.
 */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /** Solid backing appears as soon as an overlay header leaves the hero. */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Close the mobile sheet on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // A sheet that scrolls the page behind it feels broken.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  const light = overlay && !scrolled;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      {/* The floating glass pill from the chosen direction (Caladan). It is
          the signature of this design, so it stays a pill on every page
          rather than flattening to a bar off the homepage: over the hero it
          is translucent white on the photograph, elsewhere it is a solid
          cream pill on the page ground. */}
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full px-5 py-3 backdrop-blur-xl transition-colors duration-300 ${
          // While the sheet is open the pill always takes its solid
          // treatment; translucent-over-nothing would lose the logo.
          light && !open
            ? "border border-white/15 bg-white/10"
            : "border border-black/10 bg-cream/92 shadow-[0_8px_30px_rgba(6,18,47,0.08)]"
        }`}
      >
        <AnimatedLogo variant={light ? "white" : "blue"} />

        <nav
          aria-label="Primary"
          className={`hidden items-center gap-x-6 text-[12.5px] font-medium lg:flex ${
            light ? "text-white/80" : "text-primary/70"
          }`}
        >
          {nav.map((n) => {
            const kids = "children" in n ? n.children : undefined;
            const active = isActive(n.href);
            return (
              <div key={n.label} className="group relative">
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap py-1 transition ${
                    light ? "hover:text-white" : "hover:text-primary"
                  } ${active ? (light ? "text-white" : "text-primary") : ""}`}
                >
                  {n.label}
                  {kids && (
                    <svg
                      width="9"
                      height="6"
                      viewBox="0 0 9 6"
                      fill="none"
                      aria-hidden="true"
                      className="opacity-60 transition group-hover:opacity-100"
                    >
                      <path
                        d="M1 1l3.5 3.5L8 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Link>

                {/* Underline marks the section you are in. */}
                {active && (
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full ${
                      light ? "bg-white" : "bg-red"
                    }`}
                  />
                )}

                {kids && (
                  <div className="invisible absolute left-0 top-full z-30 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                    <div className="min-w-60 rounded-2xl border border-black/10 bg-ink p-2 shadow-[0_16px_40px_rgba(6,18,47,0.22)]">
                      {kids.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* §3.1: fixed in the header, separate from the nav. */}
          <Link
            href={navCtas.primary.href}
            className="hidden rounded-full bg-red px-5 py-2.5 text-[12.5px] font-bold text-white transition hover:bg-primary sm:inline-block"
          >
            {navCtas.primary.label}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden ${
              light ? "border-white/25 text-white" : "border-black/15 text-primary"
            }`}
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M2 2l14 8M16 2L2 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M0 1h18M0 6h18M0 11h13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet. Full nav including dropdown children, flattened.
          A rounded card hanging under the pill rather than a full-bleed
          panel, so the sheet belongs to the same object as the bar. */}
      {open && (
        <div className="mx-auto mt-2 max-h-[calc(100svh-7rem)] max-w-6xl overflow-y-auto rounded-[24px] border border-black/10 bg-cream px-5 pb-8 pt-3 shadow-[0_16px_40px_rgba(6,18,47,0.14)] lg:hidden">
          <nav aria-label="Primary mobile">
            {nav.map((n) => {
              const kids = "children" in n ? n.children : undefined;
              return (
                <div key={n.label} className="border-b border-black/[0.08] py-1">
                  <Link
                    href={n.href}
                    className="block py-3 font-display text-lg font-bold text-primary"
                  >
                    {n.label}
                  </Link>
                  {kids && (
                    <ul className="pb-2 pl-3">
                      {kids.map((c) => (
                        <li key={c.label}>
                          <Link
                            href={c.href}
                            className="block py-2 text-[14px] text-primary/55"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
          <Link
            href={navCtas.primary.href}
            className="mt-6 block rounded-full bg-red px-6 py-4 text-center text-[14px] font-bold text-white"
          >
            {navCtas.primary.label}
          </Link>
        </div>
      )}
    </header>
  );
}
