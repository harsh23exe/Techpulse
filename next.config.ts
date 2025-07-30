import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const backendUrl = isProduction 
      ? 'https://real-time-news-agent.vercel.app'
      : 'http://localhost:8000';
    
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
