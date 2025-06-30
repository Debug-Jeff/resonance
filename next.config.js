/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
  // Removed 'output: export' to fix webpack caching and file resolution errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com', 'supabase.co', 'avatar.iran.liara.run']
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts']
  },
  webpack: (config) => {
    // Ignore specific Node.js modules in browser environment
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      bufferutil: false,
      'utf-8-validate': false,
    };
    
    return config;
  }
});

module.exports = nextConfig;