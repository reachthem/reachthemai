'use client';

import Link from 'next/link';
import { Zap, Globe, Mic, MessageSquare, Smartphone, ArrowRight } from 'lucide-react';

export default function AIServicesSection() {
  const services = [
    {
      icon: Zap,
      title: 'AI Local Business Website Builder',
      description: 'Create a professional website for your local business in minutes using AI. No coding required.',
      features: [
        'AI-generated website copy',
        'Mobile-responsive design',
        'Built-in SEO optimization',
        'Contact forms and integrations',
        'Fast hosting included',
      ],
      href: '/ai-local-business-website-builder',
    },
    {
      icon: Globe,
      title: 'AI Local SEO Content Generation',
      description: 'Generate high-ranking SEO content for your local service areas automatically.',
      features: [
        'Location-based content',
        'Keyword optimization',
        'Service area pages',
        'Blog post generation',
        'Meta descriptions',
      ],
      href: '/ai-local-seo-content-generation',
    },
    {
      icon: Smartphone,
      title: 'AI Phone Agents',
      description: 'Never miss a customer call again. AI-powered phone agents handle inquiries 24/7.',
      features: [
        '24/7 call availability',
        'Appointment booking',
        'Lead qualification',
        'Multi-language support',
        'Voicemail transcription',
      ],
      href: '/ai-phone-agents',
    },
    {
      icon: MessageSquare,
      title: 'Social Media Management AI Posting',
      description: 'Automate your social media presence. Generate and schedule AI-powered posts.',
      features: [
        'AI post generation',
        'Multi-platform scheduling',
        'Content calendar',
        'Engagement tracking',
        'Brand voice customization',
      ],
      href: '/social-media-management-ai-posting',
    },
    {
      icon: Mic,
      title: 'Google Business AI Profile Optimization',
      description: 'Maximize your Google Business Profile visibility with AI-powered optimization.',
      features: [
        'Profile optimization',
        'AI description generation',
        'Photo organization',
        'Posts scheduling',
        'Review response templates',
      ],
      href: '/google-business-ai-profile-optimization',
    },
  ];

  return (
    <section className="py-24 max-md:py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 max-md:text-2xl">
            AI-Powered Business Growth
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-base">
            Leverage artificial intelligence to build your online presence, generate content, and grow your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="group relative bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700 flex flex-col hover:-translate-y-1"
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

                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all font-semibold">
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
