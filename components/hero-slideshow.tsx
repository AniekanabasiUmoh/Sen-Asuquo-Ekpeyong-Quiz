"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { hero } from "@/content/homepage";

const INTERVAL = 5000;

/**
 * Cross-fading hero photography.
 *
 * Round 3 item 5. The client asked to "rotate the picture" on the hero and,
 * separately, for "a video of him speaking" as you enter the site, in the
 * manner of the White House homepage. Both comments turned out to describe
 * the same thing: a hero with motion in it. Stills won over video because
 * five photographs cost a fraction of the 754KB patron loop, behave the same
 * on mobile with no breakpoint carve-out, and show five different sets of
 * students rather than one wide shot of a speech.
 *
 * Load behaviour matters more than the effect here. The first frame is a
 * priority image and paints exactly as fast as the old single photograph did;
 * the rest are lazy and only start loading after the first rotation is due,
 * so arriving at the page costs no more than it did before.
 *
 * Holds on the first frame under prefers-reduced-motion, and pauses when the
 * tab is hidden so it is not cycling images nobody is looking at.
 */
export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  /* Frames beyond the first stay out of the DOM until the first advance is
     due, so they cannot compete with the priority image for bandwidth. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      timer ??= setInterval(() => {
        if (document.hidden) return;
        setIndex((i) => (i + 1) % hero.images.length);
      }, INTERVAL);
    };

    const begin = setTimeout(() => {
      setReady(true);
      start();
    }, INTERVAL);

    return () => {
      clearTimeout(begin);
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <>
      {hero.images.map((im, i) => {
        // Only the first frame exists until the rotation actually begins.
        if (i > 0 && !ready) return null;
        return (
          <Image
            key={im.src}
            src={im.src}
            alt={i === 0 ? im.alt : ""}
            aria-hidden={i === 0 ? undefined : true}
            fill
            priority={i === 0}
            sizes="100vw"
            className="-z-10 object-cover transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none"
            style={{ objectPosition: im.position, opacity: i === index ? 1 : 0 }}
          />
        );
      })}
    </>
  );
}
