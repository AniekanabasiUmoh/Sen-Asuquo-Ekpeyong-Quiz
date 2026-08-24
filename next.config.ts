import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback: both are generated automatically by
    // next/image and served by content negotiation, no extra work at the call
    // site. This is the single highest-leverage thing to get right for event
    // day traffic on Nigerian mobile data — an AVIF hero photo is routinely a
    // third the size of the same JPEG.
    formats: ["image/avif", "image/webp"],
    // Only host actually referenced by an <Image> with a remote src
    // (components/video.tsx's YouTube thumbnail fallback). Every other image
    // in the app is local, under public/img. Next.js refuses to optimise an
    // unlisted remote host by default, so this is required, not a hardening
    // extra — components/video.tsx would fail at that <Image> without it.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  async redirects() {
    return [
      // Variant A became the homepage; keep the review-era link working.
      { source: "/a", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
