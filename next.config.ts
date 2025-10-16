/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during production build (optional)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
