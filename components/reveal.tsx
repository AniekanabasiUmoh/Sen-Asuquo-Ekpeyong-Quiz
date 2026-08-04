"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper. Mirrors the motion idiom used across the Phase 0
 * reference templates — elements rise and fade as they enter the viewport,
 * triggered at roughly "top 80%", eased like power2.out, ~0.6s, with an
 * optional stagger for grids.
 *
 * Implemented with IntersectionObserver + CSS transitions rather than a
 * scroll library, so it costs nothing at runtime. Motion is skipped entirely
 * when the visitor prefers reduced motion — the content simply appears.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  /** Distance to travel, in px. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      // Fire a little before the element is fully on screen, like "top 80%".
      { rootMargin: "0px 0px -18% 0px", threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate3d(0, ${y}px, 0)`,
        transition:
          "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1), transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        willChange: shown ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Counts up to a number when scrolled into view — used for the headline
 * statistics. Falls back to the final value immediately under reduced motion,
 * and preserves any prefix/suffix such as "250+" or "₦25 Million".
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(value);
      setDone(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        setDone(true);

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutExpo — fast out of the gate, settles gently.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setN(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, done]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toLocaleString("en-NG")}
      {suffix}
    </span>
  );
}
