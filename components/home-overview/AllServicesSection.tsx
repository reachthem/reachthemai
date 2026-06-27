'use client';

import Link from 'next/link';
import { RotateCw, Shield, Map, TrendingUp, Mic, Globe, Zap, MessageSquare, ArrowRight } from 'lucide-react';

export default function AllServicesSection() {
  const services = [
    {
      icon: RotateCw,
      title: 'Review Generation',
      description: 'Automatically collect new reviews from your customers via SMS and email. Build momentum with positive feedback.',
      features: [
        'Automate review request campaigns',
        'Support for 50+ platforms',
        'Personalized SMS and email templates',
        'Real-time alerts and analytics',
        'Bulk campaign management',
      ],
      href: '/review-generation',
    },
    {
      icon: Shield,
      title: 'Review Removal',
      description: 'Our expert team handles removal from start to finish. We identify policy violations and manage the entire dispute process.',
      features: [
        'Google, Yelp, Facebook, Trustpilot removal',
        'Expert case preparation and submission',
        'Direct platform communication',
        '100% money-back guarantee',
        'Results in 24-48 hours',
      ],
      href: '/review-removal-services',
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
      title: 'Reputation Management & Tracking',
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
      href: '/rank-tracking',
    },
    {
      icon: Mic,
      title: 'Google Business Profile Optimization',
      description: 'Maximize your Google Business Profile visibility with AI-powered optimization.',
      features: [
        'Profile optimization',
        'AI description generation',
        'Photo organization',
        'Posts scheduling',
        'Review response templates',
      ],
      href: '/google-business-optimization',
    },
    {
      icon: Globe,
      title: 'AI Content Generation',
      description: 'Generate high-ranking SEO content for your local service areas automatically.',
      features: [
        'Location-based content',
        'Keyword optimization',
        'Service area pages',
        'Blog post generation',
        'Meta descriptions',
      ],
      href: '/content-generation',
    },
    {
      icon: Zap,
      title: 'AI Site Builder',
      description: 'Create a professional website for your local business in minutes using AI. No coding required.',
      features: [
        'AI-generated website copy',
        'Mobile-responsive design',
        'Built-in SEO optimization',
        'Contact forms and integrations',
        'Fast hosting included',
      ],
      href: '/ai-website-builder',
    },
    {
      icon: MessageSquare,
      title: 'Social Media Management',
      description: 'Automate your social media presence. Generate and schedule AI-powered posts.',
      features: [
        'AI post generation',
        'Multi-platform scheduling',
        'Content calendar',
        'Engagement tracking',
        'Brand voice customization',
      ],
      href: '/ai-social-media-management',
    },
  ];

  return (
    <section className="py-24 max-md:py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 max-md:text-2xl">
            All Our Services
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-base">
            A complete suite of reputation management and business growth tools designed to help your business succeed.
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
                <div className="mb-5 w-12 h-12 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
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
                      <div className="w-1 h-1 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all font-semibold text-sm">
                  Learn more
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
