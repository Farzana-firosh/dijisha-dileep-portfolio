import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Prefetch one static App Shell per route (recommended with Cache Components; every page here is static anyway)
  partialPrefetching: true,
  // Lets a verification build run beside `next dev` without touching its .next folder (NEXT_DIST_DIR=.next-verify)
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  poweredByHeader: false,
  // Keep getting security-only upgrade prompts from Next.js
  experimental: { agentUpgrade: "security" },
  // Dev only: lets a phone on the home network load the dev server's scripts
  allowedDevOrigins: ["192.168.*.*"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
