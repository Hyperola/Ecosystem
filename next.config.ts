import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this to tell Next.js 16 to be quiet about Turbopack
  turbopack: {}, 

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'utfs.io' },
    ],
  },
  
  // Keep this to handle the bcryptjs/fs issue
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;