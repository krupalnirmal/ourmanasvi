import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile exists in a parent dir).
  turbopack: {
    root: __dirname,
  },
  images: {
    // Cloudinary Free serves all media; allow its delivery domain.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
