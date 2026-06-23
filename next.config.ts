import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect old /the-machine slug to new /business-review-scan
  async redirects() {
    return [
      { source: '/the-machine', destination: '/business-review-scan', permanent: true },
    ];
  },
  // Prevent server from bundling sonner (client-only toast lib) to avoid missing vendor-chunk runtime error
  serverExternalPackages: ['sonner'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;
