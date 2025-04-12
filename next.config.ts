import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.jsdelivr.net'], // Allow images from jsdelivr CDN
  }
};

export default nextConfig;
