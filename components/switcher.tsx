"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { variantHref, variants } from "@/content/homepage";

/**
 * Phase 0 review aid — a fixed bar letting the team flip between the five
 * homepage directions without going back to the index. Not part of the
 * production site; removed once a direction is chosen.
 */
export function VariantSwitcher() {
  const pathname = usePathname();
  // The chosen direction sits at "/", so an empty path means variant A.
  const current = pathname === "/" ? "a" : pathname?.replace("/", "") || "";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/15 bg-[#000513]/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-xs">
        <Link
          href="/directions"
          className="rounded px-2 py-1 font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ← All
        </Link>
        {variants.map((v) => {
          const active = current === v.id;
          return (
            <Link
              key={v.id}
              href={variantHref(v.id)}
              className={`rounded px-2.5 py-1 font-medium transition ${
                active
                  ? "bg-white text-[#000513]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="mr-1.5 font-bold uppercase">{v.id}</span>
              <span className="hidden sm:inline">{v.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
