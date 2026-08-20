"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * The SAEAC lockup with a brief entrance: the mark settles into place while
 * the four-colour ribbon sweeps out from behind it.
 *
 * We only have raster PNGs of the logo, so the whole mark has to move as one
 * object — the individual figures, star and ribbons cannot be animated
 * separately. Once the vector .ai/.svg arrives (blocker B7) this can be
 * replaced with a proper part-by-part build: the two figures rising into
 * their celebration stance, the diamond star drawing itself, the ribbons
 * sweeping through.
 *
 * Skipped entirely under prefers-reduced-motion.
 */
export function AnimatedLogo({
  width = 110,
  className = "",
  variant = "white",
}: {
  width?: number;
  className?: string;
  /** White lockup over photography, blue over the cream page ground. */
  variant?: "white" | "blue";
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <a
      href="/"
      aria-label="SAEAC, home"
      className={`group relative flex shrink-0 items-center ${className}`}
    >
      <span
        className="block"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(-6px) scale(0.94)",
          transition:
            "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Image
          src={`/brand/saeac-logo-${variant}-560.png`}
          alt="SAEAC, Senator Asuquo Ekpenyong Academic Championship"
          width={width}
          height={Math.round((width * 398) / 560)}
          priority
          className="h-auto w-[78px] transition duration-500 group-hover:scale-[1.04] sm:w-[96px]"
        />
      </span>

      {/* Ribbon sweeping out from under the mark */}
      <span
        className="pointer-events-none absolute -bottom-1 left-0 flex h-[3px] overflow-hidden"
        aria-hidden="true"
        style={{
          width: shown ? "100%" : "0%",
          transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1) 260ms",
        }}
      >
        {["#f03018", "#fe6c03", "#0006eb", "#f0a800"].map((c) => (
          <span key={c} className="h-full flex-1" style={{ background: c }} />
        ))}
      </span>
    </a>
  );
}
