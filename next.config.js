/** @type {import('next').NextConfig} */
const nextConfig = {
  devInspector: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
