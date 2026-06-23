'use client';

import Link from 'next/link';

/** Platform display: project uses lucide-react for icons; here we use colored dots + labels for brand clarity. For brand logos, consider simple-icons or custom SVGs. */
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

function PlatformBadge({ name, slug, color }: { name: string; slug: string; color: string }) {
  const hasPage = ['google', 'yelp', 'facebook', 'trustpilot', 'tripadvisor', 'bbb', 'glassdoor', 'amazon'].includes(slug);
  const inner = (
    <span
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-600 transition-colors whitespace-nowrap"
    >
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  );

  if (hasPage) {
    return <Link href={`/platforms/${slug}`}>{inner}</Link>;
  }
  return inner;
}

export default function ReviewSitesBanner() {
  const doubled = [...platforms, ...platforms];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mb-4">
          Have Questions? Call{' '}
          <a
            href="tel:+13174940354"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold underline underline-offset-2"
          >
            (317) 494-0354
          </a>
        </p>
        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">
          We Increase 5 Star Reviews and Remove Bad Reviews From These Platforms
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-4">
          {doubled.map((platform, i) => (
            <PlatformBadge
              key={`${platform.name}-${i}`}
              name={platform.name}
              slug={platform.slug}
              color={platform.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
