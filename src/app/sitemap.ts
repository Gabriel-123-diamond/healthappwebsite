import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ikikehealth.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'fr', 'es'];
  
  // High-traffic organic search anchors
  const publicRoutes = [
    '', 
    '/directory', 
    '/about', 
    '/journal', 
    '/institutions', 
    '/community', 
    '/pricing', 
    '/support', 
    '/articles',
    '/expert'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    publicRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
