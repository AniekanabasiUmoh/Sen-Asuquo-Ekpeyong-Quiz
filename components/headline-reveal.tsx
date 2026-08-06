"use client";

import { useEffect, useState } from "react";

/**
 * Masked line-by-line headline entrance — each line rises from behind an
 * invisible edge, staggered.
 *
 * This is the effect every one of the Phase 0 reference templates used, and
 * it is the single most effective piece of motion available on a hero. Each
 * line sits in its own `overflow-hidden` wrapper so it appears to slide up
 * out of nothing rather than simply fading.
 *
 * Renders instantly and un-animated under prefers-reduced-motion.
 */
export function HeadlineReveal({
  lines,
  className = "",
  lineClassName = "",
  delay = 120,
}: {
  /** One entry per visual line. */
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  /** Stagger between lines, in ms. */
  delay?: number;
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
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <span
            className={`block ${lineClassName}`}
            style={{
              transform: shown ? "none" : "translateY(105%)",
              opacity: shown ? 1 : 0,
              transition:
                "transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out",
              transitionDelay: `${i * delay}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
