/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      '@/*': ['./src/*'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // 优化 bundle size - 将大型依赖排除在 bundle 外
  serverExternalPackages: [
    '@aws-sdk/client-s3',
    '@aws-sdk/lib-storage',
    '@supabase/supabase-js',
    '@supabase/ssr',
    'drizzle-orm',
    'pg',
  ],
  // 启用 gzip 压缩
  compress: true,
  // 优化输出
  poweredByHeader: false,
};

module.exports = nextConfig;
