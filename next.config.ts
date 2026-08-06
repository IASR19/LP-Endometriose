import type { NextConfig } from "next";

const basePath = "/endometriose";

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1290, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [75, 90, 95],
  },
  async headers() {
    const immutable = "public, max-age=31536000, immutable";

    // Com basePath, o Next prefixa `source` automaticamente
    // (/images → /endometriose/images).
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: immutable }],
      },
    ];
  },
};

export default nextConfig;
