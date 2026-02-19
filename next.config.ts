import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Увеличиваем лимит для загрузки видео (200 МБ)
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      bodySizeLimit: "210mb",
    },
  },
};

export default nextConfig;
