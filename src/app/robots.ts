import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ikikehealth.com';

export default function robots(): MetadataRoute.Robots {
  const locales = ['en', 'fr', 'es'];
  const protectedRoutes = ['/vault', '/transactions', '/onboarding', '/admin', '/profile', '/appointments', '/history', '/reminders', '/saved', '/tools'];
  
  // Construct all localized disjoints to block aggressively across all languages
  let disallowPaths: string[] = [];
  locales.forEach(locale => {
    protectedRoutes.forEach(route => {
      disallowPaths.push(`/${locale}${route}`);
      disallowPaths.push(`/${locale}${route}/*`);
    });
  });

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/*', // Block all direct programmatic REST requests from Google
        ...disallowPaths
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
