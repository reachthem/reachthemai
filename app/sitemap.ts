import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://reachthemai.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/ai-advisor', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/review-removal-services', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/the-machine', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/review-generation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/business-review-scan', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/free-assessment', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/submit-removal', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/negative-reviews-impact', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/what-is-online-reputation-management', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  const industryPages = [
    '/industries',
    '/industries/automotive',
    '/industries/healthcare',
    '/industries/restaurants',
    '/industries/home-services',
    '/industries/legal',
    '/industries/real-estate',
    '/industries/financial-services',
    '/industries/education',
    '/industries/retail',
    '/industries/hotels-travel',
  ].map((url) => ({
    url,
    priority: 0.7 as const,
    changeFrequency: 'monthly' as const,
  }));

  const platformPages = [
    '/platforms/google',
    '/platforms/yelp',
    '/platforms/facebook',
    '/platforms/amazon',
    '/platforms/tripadvisor',
    '/platforms/trustpilot',
    '/platforms/glassdoor',
    '/platforms/bbb',
  ].map((url) => ({
    url,
    priority: 0.7 as const,
    changeFrequency: 'monthly' as const,
  }));

  const legalPages = [
    '/legal/privacy-policy',
    '/legal/terms-of-service',
    '/legal/refund-policy',
  ].map((url) => ({
    url,
    priority: 0.3 as const,
    changeFrequency: 'yearly' as const,
  }));

  return [...staticPages, ...industryPages, ...platformPages, ...legalPages].map(
    (page) => ({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  );
}
