import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/drawings-sketches",
        destination: "/gallery/drawings-and-sketches",
        permanent: true,
      },
      {
        source: "/special-commissions",
        destination: "/gallery/special-commissions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
