import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
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
