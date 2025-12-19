import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  // output: 'standalone',
  basePath: '', //VD: /bapchampion
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 's3-hcm-r2.s3cloud.vn',
      },
      {
        hostname: 'localhost',
      },
    ],
    unoptimized: true,
    // loaderFile: "utils/next-image-config.ts",
  },
  // reactStrictMode: false,
};

export default nextConfig;
