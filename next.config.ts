import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,
  // Configure server external packages
  serverExternalPackages: ['@prisma/client'],
  // Configure API routes
  async rewrites() {
    return [];
  },
  // Configure Redirects
  async redirects() {
    return [
      {
        source: '/ai',
        destination: '/student/ai-assistant',
        permanent: true,
      },
      {
        source: '/ai-assistant',
        destination: '/student/ai-assistant',
        permanent: true,
      },
    ];
  },
  // Allow local dev origin to suppress Next.js webpack-hmr warnings
  allowedDevOrigins: ['127.0.0.1'],
  // Environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;