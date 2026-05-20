import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ Reduz tamanho do Docker drasticamente
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
    },
  },
  transpilePackages: ["styled-components"],
};

export default nextConfig;
