"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Photograph that eases out of a slight zoom as it scrolls into view.
 *
 * Starts at ~1.08 scale and settles to 1.0 over about 1.2s. Unlike a hover
 * effect this fires on scroll, so it works on touch devices — which are the
 * primary medium for this site.
 *
 * The wrapper owns `overflow-hidden`, so the scale never bleeds past a
 * rounded corner. Motion is skipped entirely under prefers-reduced-motion.
 */
export function ZoomImage({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
  objectPosition,
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Classes for the frame — set aspect ratio and rounding here. */
  className?: string;
  /** Extra classes for the image itself. */
  imgClassName?: string;
  priority?: boolean;
  objectPosition?: string;
  /** Overlay content — captions, gradients — rendered above the image. */
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettled(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSettled(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Callers may position the frame themselves (e.g. `absolute inset-0` to fill
  // a parent that owns the aspect ratio). Only default to `relative` when they
  // have not, otherwise the two rules collide and the frame collapses.
  const positioned = /(^|\s)(absolute|fixed|sticky|relative)(\s|$)/.test(className);

  return (
    <div
      ref={ref}
      className={`${positioned ? "" : "relative"} overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imgClassName}`}
        style={{
          transform: settled ? "scale(1)" : "scale(1.08)",
          transition: "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
          objectPosition,
        }}
      />
      {children}
    </div>
  );
}
