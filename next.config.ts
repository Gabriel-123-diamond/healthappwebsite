import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://www.google.com https://www.google.com/recaptcha/ https://infird.com https://www.google-analytics.com https://ssl.google-analytics.com https://*.googletagmanager.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://firebasestorage.googleapis.com https://images.unsplash.com https://i.pravatar.cc https://*.googleusercontent.com https://www.google-analytics.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://apis.google.com https://*.firebaseio.com https://*.googleapis.com https://google.serper.dev https://*.firebaseapp.com https://www.google.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://overbridgenet.com; frame-src 'self' https://www.google.com https://*.firebaseapp.com;"
          }
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
