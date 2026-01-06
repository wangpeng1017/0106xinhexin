/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 代理后端 API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
  // 输出独立部署包
  output: 'standalone',
}

module.exports = nextConfig
