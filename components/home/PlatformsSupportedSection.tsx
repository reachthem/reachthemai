'use client';

import Link from 'next/link';

const platforms = [
  { name: 'Google', slug: 'google', color: '#4285F4' },
  { name: 'Yelp', slug: 'yelp', color: '#D32323' },
  { name: 'Facebook', slug: 'facebook', color: '#1877F2' },
  { name: 'Trustpilot', slug: 'trustpilot', color: '#00B67A' },
  { name: 'TripAdvisor', slug: 'tripadvisor', color: '#34E0A1' },
  { name: 'BBB', slug: 'bbb', color: '#005A78' },
  { name: 'Glassdoor', slug: 'glassdoor', color: '#0CAA41' },
  { name: 'Amazon', slug: 'amazon', color: '#FF9900' },
  { name: 'Angi', slug: 'google', color: '#FF6153' },
  { name: 'HomeAdvisor', slug: 'google', color: '#F68A1E' },
  { name: 'Healthgrades', slug: 'google', color: '#1B9CD9' },
  { name: 'Avvo', slug: 'google', color: '#3C78D8' },
  { name: 'Cars.com', slug: 'google', color: '#8649D1' },
  { name: 'DealerRater', slug: 'google', color: '#F47721' },
  { name: 'Zocdoc', slug: 'google', color: '#FFD400' },
  { name: 'Vitals', slug: 'google', color: '#0072CE' },
];

const hasPlatformPage = (slug: string) =>
  ['google', 'yelp', 'facebook', 'trustpilot', 'tripadvisor', 'bbb', 'glassdoor', 'amazon'].includes(slug);

export default function PlatformsSupportedSection() {
  return (
    <section
      id="platforms-supported"
      className="py-24 bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-primary-950/30 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            Platforms We Support
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Review Removal Across Every Major Platform
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We submit formal removal applications to the same platforms you see in the banner — from Google and
            Yelp to niche sites like Healthgrades, Avvo, and DealerRater. One process, every platform that matters.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => {
            const content = (
              <span
                className="flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:-translate-y-0.5"
                style={{ borderLeftColor: platform.color, borderLeftWidth: '4px' }}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: platform.color }}
                />
                {platform.name}
              </span>
            );
            return (
              <div key={platform.name}>
                {hasPlatformPage(platform.slug) ? (
                  <Link href={`/platforms/${platform.slug}`} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Click any platform above to read our removal approach and policy details for that site.
        </p>
      </div>
    </section>
  );
}
