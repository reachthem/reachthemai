'use client';

import Link from 'next/link';
import { BarChart3, Radar, Map, TrendingUp, ArrowRight } from 'lucide-react';

export default function BusinessTrackingSection() {
  const services = [
    {
      icon: BarChart3,
      title: 'Business Scan',
      description: 'Get a comprehensive analysis of your business\'s online presence, reviews, and reputation in minutes.',
      features: [
        'Multi-platform review analysis',
        'Reputation score calculation',
        'Competitor comparison',
        'Action recommendations',
        'Downloadable reports',
      ],
      href: '/business-scan',
    },
    {
      icon: Radar,
      title: 'Business Review Scan',
      description: 'Deep dive analysis of all reviews across platforms. Identify patterns and opportunities.',
      features: [
        'Detailed review analysis',
        'Sentiment analysis',
        'Removal opportunity identification',
        'Response recommendations',
        'Trend tracking',
      ],
      href: '/business-review-scan',
    },
    {
      icon: TrendingUp,
      title: 'Local Rank Tracking',
      description: 'Monitor your rankings on Google Maps and local search results in your service areas.',
      features: [
        'Real-time ranking updates',
        'Service area tracking',
        'Competitor benchmarking',
        'Position history',
        'Local SEO insights',
      ],
      href: '/local-rank-tracking',
    },
    {
      icon: Map,
      title: 'Local Listing Aggregation',
      description: 'Manage and track your business listings across all major directories and platforms.',
      features: [
        'Listing consistency check',
        'Multi-platform management',
        'NAP verification',
        'Update sync across platforms',
        'Citation building',
      ],
      href: '/local-listing-aggregation',
    },
    {
      icon: TrendingUp,
      title: 'Reputation Management Tracking',
      description: 'Keep your finger on the pulse of your online reputation with real-time monitoring and alerts.',
      features: [
        'Real-time review alerts',
        'Sentiment tracking',
        'Review trend analysis',
        'Historical data',
        'Custom dashboards',
      ],
      href: '/reputation-management-tracking',
    },
  ];

  return (
    <section className="py-24 max-md:py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 max-md:text-2xl">
            Business Analytics & Tracking
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-base">
            Monitor, analyze, and optimize your online reputation with data-driven insights and real-time tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700 flex flex-col hover:-translate-y-1"
              >
                <div className="mb-5 w-12 h-12 bg-gradient-to-br from-cyan-100 to-primary-100 dark:from-cyan-900/30 dark:to-primary-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 flex-grow">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <div className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all font-semibold">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
