import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yjvtnmvtszzboejabzmu.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
  // ✅ Tohle zapne generování sourcemaps i v produkci:
  productionBrowserSourceMaps: true,
};

export default nextConfig;