"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Lazy YouTube embed. Shows the poster frame until the viewer clicks play,
 * then swaps in the iframe. Nothing is requested from YouTube on page load,
 * which keeps the homepage fast and avoids setting third-party cookies on
 * visitors who never watch the video.
 */
export function YouTubeEmbed({
  id,
  title,
  poster,
  className = "",
}: {
  id: string;
  title: string;
  poster?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-2xl bg-black ${className}`}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-110 sm:h-20 sm:w-20">
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none"
              aria-hidden="true"
              className="ml-1"
            >
              <path d="M21 12 0 24V0l21 12Z" fill="#0d2270" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
