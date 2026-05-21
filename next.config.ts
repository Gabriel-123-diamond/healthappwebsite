import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' }
    ]
  },
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
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://www.google.com https://www.google.com/recaptcha/ https://infird.com https://*.firebaseapp.com https://www.google-analytics.com https://ssl.google-analytics.com https://*.googletagmanager.com https://*.paystack.co https://*.paystack.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://paystack.com; img-src 'self' data: https://firebasestorage.googleapis.com https://images.unsplash.com https://i.pravatar.cc https://*.googleusercontent.com https://www.google-analytics.com https://*.paystack.co https://*.paystack.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://127.0.0.1:* ws://127.0.0.1:* https://apis.google.com https://*.firebaseio.com https://*.googleapis.com https://google.serper.dev https://*.firebaseapp.com https://www.google.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://overbridgenet.com https://*.paystack.co https://*.paystack.com; frame-src 'self' http://127.0.0.1:* https://www.google.com https://*.firebaseapp.com https://*.paystack.co https://*.paystack.com;"
          }
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
