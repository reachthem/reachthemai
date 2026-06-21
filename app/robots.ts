import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://reachthemai.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/auth/', '/api/', '/confirmation'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
