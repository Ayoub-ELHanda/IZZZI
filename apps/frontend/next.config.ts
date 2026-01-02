import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { dev, isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Enable polling for file watching in Docker (especially on Windows)
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding once the first file changed
      };
    }
    
    return config;
  },
};

export default nextConfig;
