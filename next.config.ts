import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  poweredByHeader: false,

  // Ensure content/articles is bundled into serverless functions for local fallback
  outputFileTracingIncludes: {
    '/articles': ['./content/articles/**/*'],
    '/articles/[id]': ['./content/articles/**/*'],
  },

  // Security headers (migrated from vercel.json)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.clerk.accounts.dev",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://img.clerk.com https://*.clerk.accounts.dev https://img.youtube.com https://i.ytimg.com",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.clerk.accounts.dev",
              "connect-src 'self' https://www.google-analytics.com https://api.github.com https://*.clerk.accounts.dev https://*.clerk.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // Redirect old query-param category URLs to static routes
  async redirects() {
    return [
      // /pricing → homepage (Pro tier not live)
      { source: '/pricing', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
