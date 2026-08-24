"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Silent looping b-roll with a click-to-play handoff to the full film on
 * YouTube.
 *
 * The loop is a ~750KB, 20s, 480p silent cut used purely as motion. Clicking
 * play swaps in the YouTube iframe, which streams the full six-minute film
 * with audio and handles adaptive bitrate — so we carry almost no bandwidth
 * ourselves.
 *
 * On small screens the video never loads at all: the poster image shows
 * instead. Even 750KB is a real cost on metered data, and the motion matters
 * least on the smallest screen.
 */
export function VideoHero({
  loopSrc,
  poster,
  youTubeId,
  title,
  caption,
  className = "",
}: {
  loopSrc: string;
  poster: string;
  youTubeId: string;
  title: string;
  /** Small corner label, in the manner of the reference site. */
  caption?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setShowVideo(wide.matches && !reduced.matches);

    decide();
    wide.addEventListener("change", decide);
    reduced.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      reduced.removeEventListener("change", decide);
    };
  }, []);

  // Only play the loop while it is actually on screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !showVideo) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [showVideo]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youTubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play the full film: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {showVideo ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={loopSrc}
              poster={poster}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : (
            <Image
              src={poster}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}

          <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" />

          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-110 sm:h-20 sm:w-20">
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none"
              aria-hidden="true"
              className="ml-1"
            >
              <path d="M21 12 0 24V0l21 12Z" fill="var(--color-primary)" />
            </svg>
          </span>

          {caption && (
            <span className="absolute bottom-5 right-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">
              {caption}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
