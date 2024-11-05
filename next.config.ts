import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['lucide-react','@google/generative-ai'],
  output:'standalone',
};

export default nextConfig;
