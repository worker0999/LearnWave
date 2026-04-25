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
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;