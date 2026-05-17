/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode helps catch effects that double-fire in dev
  reactStrictMode: true,

  // Surface real lint errors in CI instead of silently passing.
  // Set to true only if you must ship a build with known lint errors.
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
      // Common stock providers used in the seed data
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },

      // Supabase Storage (bucket public URLs)
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
};

export default nextConfig;
