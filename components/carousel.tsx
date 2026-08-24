"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Centre-stage carousel, taken from the chosen reference (Caladan).
 *
 * One card holds the centre at full size and full opacity; its neighbours sit
 * behind it, scaled down and blurred, so the eye is told where to look and
 * still knows there is more either side. Circular arrow buttons flank the
 * stage.
 *
 * The reference uses this for its room collection. Here it carries the seven
 * Local Government Areas, which is the one set on the site big enough to earn
 * a carousel and small enough that a reader will actually go through it.
 *
 * Keyboard accessible, and it degrades to a plain scrollable row under
 * prefers-reduced-motion rather than animating.
 */
export function Carousel({
  items,
  interval = 2000,
}: {
  items: ReadonlyArray<{
    img: string;
    name: string;
    meta: string;
    badge?: string;
  }>;
  /**
   * Milliseconds each card holds the centre.
   *
   * 2s is the client's asking figure. It is on the quick side for a card
   * carrying a name and a school count, so if it reads as rushed on screen
   * this is the single number to raise; 3500 is the comfortable equivalent.
   */
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  /** Autoplay stops for good once someone takes manual control. */
  const [paused, setPaused] = useState(false);
  const liveRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* Advance on its own. Held while the pointer is over the stage or focus is
     inside it, so it cannot move the card out from under someone reading or
     tabbing through, and skipped entirely under reduced motion. */
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [reduced, paused, interval, items.length]);

  const go = (d: number) => {
    setPaused(true);
    setIndex((i) => (i + d + items.length) % items.length);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Stage. Cards are absolutely placed around the centre so the row never
          reflows as the index changes, and the stage clips them: the
          neighbours are meant to run off both edges, which would otherwise
          push the page wider than the viewport. */}
      <div className="relative mx-auto h-[420px] max-w-5xl overflow-hidden sm:h-[500px]">
        {items.map((it, i) => {
          // Signed distance from centre, wrapped so the ends meet.
          let d = i - index;
          if (d > items.length / 2) d -= items.length;
          if (d < -items.length / 2) d += items.length;
          const abs = Math.abs(d);
          if (abs > 2) return null;

          const isCentre = d === 0;
          return (
            <div
              key={it.name}
              aria-hidden={!isCentre}
              className="absolute left-1/2 top-0 h-full w-[86%] sm:w-[62%]"
              style={{
                transform: `translateX(-50%) translateX(${d * 62}%) scale(${
                  isCentre ? 1 : 0.82
                })`,
                filter: isCentre ? "none" : "blur(6px)",
                opacity: isCentre ? 1 : 0.4,
                zIndex: 10 - abs,
                transition: reduced
                  ? "none"
                  : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease, filter 700ms ease",
                pointerEvents: isCentre ? "auto" : "none",
              }}
            >
              <div className="relative h-full overflow-hidden rounded-[24px]">
                <Image
                  src={it.img}
                  alt={isCentre ? it.name : ""}
                  fill
                  sizes="(min-width: 640px) 62vw, 86vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />

                {it.badge && (
                  <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    {it.badge}
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    {it.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-white/70">{it.meta}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrows, in the reference's circular treatment. */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white transition hover:bg-red sm:left-8 sm:h-12 sm:w-12"
        >
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
            <path
              d="M6 1 1 6l5 5M1 6h15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white transition hover:bg-red sm:right-8 sm:h-12 sm:w-12"
        >
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
            <path
              d="M11 1l5 5-5 5M16 6H1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Dots, and a live region so the change is announced. */}
      <div className="mt-7 flex items-center justify-center gap-2">
        {items.map((it, i) => (
          <button
            key={it.name}
            type="button"
            onClick={() => {
              setPaused(true);
              setIndex(i);
            }}
            aria-label={it.name}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-7 bg-red" : "w-2 bg-primary/20 hover:bg-primary/40"
            }`}
          />
        ))}
      </div>
      <p ref={liveRef} aria-live="polite" className="sr-only">
        {items[index]?.name}
      </p>
    </div>
  );
}
