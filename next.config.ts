import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 300,
  async rewrites() {
    return [
      {
        source: '/schoolImages/:path*',
        destination: '/schoolImages/:path*',
      },
    ];
  },
};

export default nextConfig;
