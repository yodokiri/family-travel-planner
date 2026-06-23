import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 予約画像/PDF（最大約5MB）+ multipart オーバーヘッドの余裕
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
