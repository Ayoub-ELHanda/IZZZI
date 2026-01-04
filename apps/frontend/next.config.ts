import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config, { dev, isServer }) {
    // Resolve @izzzi/types alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@izzzi/types': path.resolve(__dirname, '../../packages/types'),
    };
    
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
