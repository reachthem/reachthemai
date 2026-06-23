import Link from 'next/link';

const platforms = [
  {
    name: 'Google Reviews',
    slug: 'google',
    color: '#4285F4',
    stat: '73% of all reviews',
    excerpt: 'Google is the largest review platform in the world. We navigate Google\'s content policies to remove fake, spam, and policy-violating reviews from your Business Profile.',
  },
  {
    name: 'Yelp',
    slug: 'yelp',
    color: '#D32323',
    stat: '178M monthly visitors',
    excerpt: 'Yelp\'s recommendation algorithm and strict policies make removal challenging. Our AI identifies the exact policy grounds that give you the best chance of successful removal.',
  },
  {
    name: 'Facebook',
    slug: 'facebook',
    color: '#1877F2',
    stat: '2.9B active users',
    excerpt: 'Facebook\'s recommendation system replaced traditional star ratings. We help businesses remove fake recommendations, spam, and content that violates community standards.',
  },
  {
    name: 'Trustpilot',
    slug: 'trustpilot',
    color: '#00B67A',
    stat: '120M+ reviews',
    excerpt: 'Trustpilot is critical for e-commerce and B2B trust. We leverage their flagging system and content policies to remove fraudulent and misleading reviews.',
  },
  {
    name: 'TripAdvisor',
    slug: 'tripadvisor',
    color: '#34E0A1',
    stat: '463M monthly users',
    excerpt: 'TripAdvisor dominates hotel and travel bookings. We work with their fraud detection team to remove fake, retaliatory, and blackmail-driven reviews.',
  },
  {
    name: 'BBB',
    slug: 'bbb',
    color: '#005A78',
    stat: '5.4M business profiles',
    excerpt: 'Your BBB rating directly impacts consumer trust. We help resolve disputes, challenge inaccurate complaints, and remove policy-violating reviews.',
  },
  {
    name: 'Glassdoor',
    slug: 'glassdoor',
    color: '#0CAA41',
    stat: '55M monthly users',
    excerpt: 'Negative Glassdoor reviews affect hiring and employer branding. We identify reviews that violate community guidelines and pursue removal through official channels.',
  },
  {
    name: 'Amazon',
    slug: 'amazon',
    color: '#FF9900',
    stat: '300M+ active customers',
    excerpt: 'Amazon reviews directly impact Buy Box placement and sales. We help sellers remove competitor attacks, fake reviews, and policy-violating content.',
  },
];

export default function PlatformsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Every Platform
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Review Removal Across Every Major Platform
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Each platform has unique policies, processes, and enforcement mechanisms. We know them
            all — and we know exactly how to build the strongest removal case for each.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <Link
              key={platform.slug}
              href={`/platforms/${platform.slug}`}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
              style={{ borderTopColor: platform.color, borderTopWidth: '3px' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: platform.color }}
                />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {platform.name}
                </h3>
              </div>
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-3">
                {platform.stat}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {platform.excerpt}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
