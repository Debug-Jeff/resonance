/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com', 'supabase.co']
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts']
  }
};

module.exports = nextConfig;