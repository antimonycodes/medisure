/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@meshsdk/react",
    "@meshsdk/core",
    "@fabianbormann/cardano-peer-connect",
  ],
};

module.exports = nextConfig;
