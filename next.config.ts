import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Variant A became the homepage; keep the review-era link working.
      { source: "/a", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
