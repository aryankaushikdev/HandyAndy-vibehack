import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images via Clerk
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Clerk avatar CDN
      },
    ],
  },
  // Ensure Three.js (browser-only) doesn't break SSR
  webpack: (config) => {
    config.externals = config.externals || []
    return config
  },
}

export default nextConfig
