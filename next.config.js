/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/eyeballs-in',
  images: {
    unoptimized: true,
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  // Other configuration options
}

module.exports = nextConfig