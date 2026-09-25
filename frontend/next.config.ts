import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@scentique/shared"],
  images: { qualities: [75, 90] },
};

export default nextConfig;
