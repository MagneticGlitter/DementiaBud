/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path',
        destination: 'http://localhost:3000/api/:path*'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mock 'tls' when bundling for the client side
      config.resolve.fallback = {
        tls: 'empty',
        fs: 'empty',
      };
    }
    return config;
  },
};
