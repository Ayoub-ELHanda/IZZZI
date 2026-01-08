import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config, { dev, isServer }) {
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@izzzi/types': path.resolve(__dirname, '../../packages/types'),
    };

    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, 
        aggregateTimeout: 300, 
      };
    }
    
    return config;
  },
};

export default nextConfig;
