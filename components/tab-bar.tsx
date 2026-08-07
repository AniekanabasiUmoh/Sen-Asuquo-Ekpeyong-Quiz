"use client";

import { useEffect, useRef, useState } from "react";
import { tabs } from "@/content/homepage";

/**
 * Floating section menu.
 *
 * Raised by Offiong: "can we have tabs up that we can click, because the home
 * page is long." He is right, and it is a consequence of Round 2 item 6 —
 * stripping the header to a single row with no sticky behaviour was correct
 * for the hero, but it left everything below the hero with no way to navigate.
 *
 * The bar stays hidden until the hero has scrolled away, so it never competes
 * with the headline on first paint. It then pins: a centred pill on desktop,
 * and a bottom bar on mobile where it is thumb-reachable and out of the way of
 * browser chrome at the top.
 *
 * The active tab tracks the section in view, which is the part that actually
 * answers "the page is long" — you can always see where you are.
 */
export function TabBar() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string>("");
  /**
   * Below 430px there is not enough width for six tabs plus the Register
   * button without truncating each label to four characters, so the two
   * least-used tabs drop out. Both sections stay reachable by scrolling and
   * from the footer.
   *
   * Driven from state rather than a `hidden min-[430px]:flex` pair, because
   * that relies on utility ordering to resolve two competing `display` rules
   * and Tailwind v4 does not order them the way that needs.
   */
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 429px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  /** Suppresses scroll-spy while a click-triggered smooth scroll is in flight. */
  const lockRef = useRef(0);

  /* Reveal once the hero is out of the way. The hero is ~92svh, so we use the
     viewport height itself rather than observing an element. */
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-spy. A band across the upper third of the viewport decides which
     section is "current"; whichever tracked section is nearest the top of that
     band wins. Simpler and steadier than ranking intersection ratios, which
     flicker when a short section and a tall one are both partly visible. */
  useEffect(() => {
    const ids = tabs.map((t) => t.href.slice(1));

    const pick = () => {
      if (Date.now() < lockRef.current) return;
      const line = window.innerHeight * 0.3;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= line && bottom > line) current = id;
        else if (top > line) break;
        else current = id;
      }
      setActive(current);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  const onTabClick = (href: string) => {
    // Hold the highlight on the clicked tab until the smooth scroll settles,
    // otherwise the spy lights up every section we pass on the way.
    lockRef.current = Date.now() + 900;
    setActive(href.slice(1));
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 pb-3 transition-all duration-500 sm:bottom-auto sm:top-4 sm:px-3 sm:pb-0 print:hidden ${
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0 sm:-translate-y-3"
      }`}
    >
      <nav
        aria-label="Sections"
        className="flex w-full max-w-2xl items-center gap-0.5 rounded-full border border-black/10 bg-[#faf6ee]/92 p-1.5 shadow-[0_8px_30px_rgba(6,18,47,0.13)] backdrop-blur-xl sm:w-auto"
      >
        <div className="flex min-w-0 flex-1 items-center sm:flex-none sm:gap-0.5">
          {tabs.map((t) => {
            const isActive = active === t.href.slice(1);
            if (narrow && !t.core) return null;
            return (
              <a
                key={t.href}
                href={t.href}
                onClick={() => onTabClick(t.href)}
                aria-current={isActive ? "true" : undefined}
                className={`min-w-0 flex-1 truncate rounded-full px-1.5 py-2 text-center text-[11px] font-semibold transition sm:flex-none sm:px-3.5 sm:text-[12.5px] ${
                  isActive
                    ? "bg-[#003090] text-white"
                    : "text-[#003090]/60 hover:bg-black/[0.06] hover:text-[#003090]"
                }`}
              >
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </a>
            );
          })}
        </div>

        {/* The persistent CTA that Round 2 item 6 removed from the header, now
            appearing only after the hero — which is the pattern that item
            recommended in the first place. */}
        <a
          href="#register"
          onClick={() => onTabClick("#register")}
          className="shrink-0 rounded-full bg-[#f03018] px-3.5 py-2 text-[11.5px] font-bold text-white transition hover:bg-[#003090] sm:ml-1 sm:px-5 sm:text-[12.5px]"
        >
          Register
        </a>
      </nav>
    </div>
  );
}
