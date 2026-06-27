'use client';

import Link from 'next/link';
import { Shield, RotateCw, Brain, ArrowRight } from 'lucide-react';

interface ReviewServicesSectionProps {
  removalPrice?: string;
  advisorPrice?: string;
}

export default function ReviewServicesSection({ removalPrice = '299', advisorPrice = '49' }: ReviewServicesSectionProps) {
  const displayAdvisorPrice = advisorPrice === '19' ? '49' : advisorPrice;

  const services = [
    {
      icon: Shield,
      title: 'Review Removal Services',
      description: 'Our expert team handles removal from start to finish. We identify policy violations and manage the entire dispute process.',
      features: [
        'Google, Yelp, Facebook, Trustpilot removal',
        'Expert case preparation and submission',
        'Direct platform communication',
        '100% money-back guarantee',
        'Results in 24-48 hours',
      ],
      pricing: `$${removalPrice}`,
      href: '/review-removal-services',
      badge: 'Full Service',
    },
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
      pricing: '$49',
      href: '/review-generation',
      badge: 'Growth',
    },
    {
      icon: Brain,
      title: 'AI Review Advisor',
      description: 'Self-service AI analysis of negative reviews. Get platform-specific removal guidance with confidence scoring.',
      features: [
        'AI-powered policy analysis',
        'Platform-specific instructions',
        'Legal cross-referencing',
        'Confidence scoring',
        'Case tracking dashboard',
      ],
      pricing: `$${displayAdvisorPrice}`,
      href: '/ai-advisor',
      badge: 'Self-Service',
    },
  ];

  return (
    <section className="py-24 max-md:py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 max-md:text-2xl">
            Core Review Management
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-base">
            Manage your reviews with confidence. Remove negative reviews or generate new positive ones.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 flex flex-col hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold">
                  {service.badge}
                </div>

                <div className="mb-6 w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {service.pricing}
                    {service.pricing.startsWith('$') && !service.pricing.includes('month') && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">/removal</span>
                    )}
                    {service.pricing === '$49' && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">/month</span>
                    )}
                  </div>
                  <div className="text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-center text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Tip:</span> Start with a free review scan to see which negative reviews can be removed and get personalized recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}
