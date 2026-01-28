import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Enable static export for production PWA builds
  ...(isProd && { output: "export" }),

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slash for proper offline routing
  trailingSlash: true,
};

export default nextConfig;
