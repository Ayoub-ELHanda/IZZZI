const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
