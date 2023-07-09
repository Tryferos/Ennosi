/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
      },
    ],
  },
  reactStrictMode: false,
}

module.exports = nextConfig
