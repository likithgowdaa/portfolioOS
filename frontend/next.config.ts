import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained `.next/standalone` build for the Docker image.
  output: "standalone",
};

export default nextConfig;
