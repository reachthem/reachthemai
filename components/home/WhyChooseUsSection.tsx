import Link from 'next/link';
import { ArrowRight, Bot, Shield, Zap, Award, Clock, BadgeDollarSign } from 'lucide-react';

const reasons = [
  {
    icon: Bot,
    title: 'AI-Powered Case Analysis',
    description: 'Our proprietary AI engine analyzes every review against platform policies and legal precedents, identifying the strongest grounds for removal before we ever submit a request.',
  },
  {
    icon: BadgeDollarSign,
    title: '100% Money Back Guarantee',
    description: 'We stand behind our work completely. If we cannot remove your review, you receive a full refund — no questions asked, no fine print.',
  },
  {
    icon: Shield,
    title: 'Legitimate, Policy-Based Approach',
    description: 'We never use threats, incentives, or manipulation. Every removal is based on documented policy violations and filed through official platform channels.',
  },
  {
    icon: Zap,
    title: 'Multi-Platform Expertise',
    description: 'Specialized knowledge across Google, Yelp, Facebook, Trustpilot, TripAdvisor, BBB, Glassdoor, Amazon, and more. Each platform has unique policies — we know them all.',
  },
  {
    icon: Clock,
    title: 'Fast Results',
    description: 'Most reviews are removed within 1–4 weeks. Some straightforward violations are resolved in as little as 24–48 hours through our expedited review process.',
  },
  {
    icon: Award,
    title: 'Proven Track Record',
    description: 'Over 4,700 reviews successfully removed with a 92% success rate. Businesses we work with see an average 1.4-star rating increase within 60 days.',
  },
];

const stats = [
  { value: '4,700+', label: 'Reviews Removed' },
  { value: '92%', label: 'Success Rate' },
  { value: '1.4★', label: 'Avg. Rating Increase' },
  { value: '$2.3M+', label: 'Client Revenue Recovered' },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Why Reach Them AI
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Why Businesses Choose Reach Them AI for Reputation Management
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We combine advanced AI technology with deep platform expertise to deliver the highest
            removal success rates in the industry — backed by a 100% money back guarantee.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                {stat.value}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <reason.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/free-assessment"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Get Your Free Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            No credit card required · 100% money back guarantee · Results in 1–4 weeks
          </p>
        </div>
      </div>
    </section>
  );
}
