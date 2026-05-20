/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ✅ Reduz tamanho do Docker
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

module.exports = nextConfig;
