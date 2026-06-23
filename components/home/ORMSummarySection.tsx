import Link from 'next/link';
import { ArrowRight, Globe, Shield, TrendingUp } from 'lucide-react';

const highlights = [
  {
    icon: Globe,
    stat: '97%',
    text: 'of consumers read online reviews before choosing a business',
  },
  {
    icon: Shield,
    stat: '70%',
    text: 'of potential customers lost when 4+ negative articles appear in search results',
  },
  {
    icon: TrendingUp,
    stat: '53%',
    text: 'of customers expect businesses to respond to negative reviews within one week',
  },
];

export default function ORMSummarySection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
              Understanding ORM
            </span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              What is Online Reputation Management?
            </h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Online Reputation Management (ORM) is the strategic practice of monitoring, influencing,
              and improving how your business appears across the internet. It encompasses review management,
              search result optimization, social media monitoring, and proactive content strategies that
              shape public perception of your brand.
            </p>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              In today&apos;s digital-first economy, your online reputation is often the first — and sometimes
              only — impression potential customers have of your business. A strong ORM strategy protects
              revenue, builds trust, and creates a sustainable competitive advantage.
            </p>
            <Link
              href="/what-is-online-reputation-management"
              className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Read the Complete Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-6">
            {highlights.map((item) => (
              <div
                key={item.stat}
                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                    {item.stat}
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
