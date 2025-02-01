/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/ai-travel-assistant' : '',
  images: {
    unoptimized: true
  },
  // Disable server-side features in static export
  experimental: {
    serverActions: false
  }
}

module.exports = nextConfig
