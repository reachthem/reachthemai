'use client';

import Link from 'next/link';
import { BookOpen, AlertCircle, Zap, ArrowRight } from 'lucide-react';

export default function EducationalResourcesSection() {
  const resources = [
    {
      icon: BookOpen,
      title: 'What is Online Reputation Management?',
      description: 'Learn the fundamentals of reputation management and why it matters for your business success.',
      href: '/what-is-online-reputation-management',
      tag: 'Educational',
    },
    {
      icon: AlertCircle,
      title: 'The Impact of Negative Reviews',
      description: 'Understand how negative reviews affect your business and what you can do about them.',
      href: '/negative-reviews-impact',
      tag: 'Educational',
    },
    {
      icon: Zap,
      title: 'The Machine - Reputation Acceleration',
      description: 'Discover our integrated pipeline that combines review removal, generation, and management for maximum impact.',
      href: '/the-machine',
      tag: 'Platform',
    },
  ];

  return (
    <section className="py-24 max-md:py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 max-md:text-2xl">
            Learn & Explore
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-base">
            Dive deeper into reputation management concepts and how Reach Them AI brings it all together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Link
                key={index}
                href={resource.href}
                className="group relative bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700 flex flex-col hover:-translate-y-1"
              >
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
                    {resource.tag}
                  </span>
                </div>

                <div className="mb-6 w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {resource.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                  {resource.description}
                </p>

                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all font-semibold">
                  Read more
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
