/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          { protocol: 'https', hostname: 'placehold.jp' },
          { protocol: 'https', hostname: 'images.microcms-assets.io' },
          { protocol: 'http', hostname: 'example.com' },
          { protocol: 'https', hostname: 'ybvmvakzxqodivnojebr.supabase.co' },
        ],
      },
    };

export default nextConfig;
