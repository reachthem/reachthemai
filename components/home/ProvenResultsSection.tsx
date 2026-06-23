import { Star, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const overallStats = [
  { value: '4,700+', label: 'Negative Reviews Removed' },
  { value: '92%', label: 'Removal Success Rate' },
  { value: '1.4★', label: 'Average Rating Increase' },
  { value: '60 days', label: 'Average Time to Results' },
];

const caseStudies = [
  {
    industry: 'Multi-Location Restaurant Chain',
    icon: '🍽️',
    challenge: 'Competitors planted 47 fake negative reviews across 6 locations, dropping the average rating to 3.2 stars.',
    result: 'All 47 fraudulent reviews removed within 4 weeks.',
    beforeRating: 3.2,
    afterRating: 4.6,
    metric: '38% increase in monthly reservations',
  },
  {
    industry: 'Medical Practice',
    icon: '🏥',
    challenge: 'A disgruntled former employee posted 12 defamatory reviews across Google and Healthgrades, threatening patient acquisition.',
    result: 'All 12 reviews removed in 3 weeks with documented policy violations.',
    beforeRating: 3.5,
    afterRating: 4.8,
    metric: '52% increase in new patient bookings',
  },
  {
    industry: 'Law Firm',
    icon: '⚖️',
    challenge: 'Opposing counsel in 3 cases encouraged clients to leave negative reviews. 8 reviews identified as violating conflict-of-interest policies.',
    result: 'All 8 reviews successfully removed through platform dispute processes.',
    beforeRating: 3.9,
    afterRating: 4.7,
    metric: '34% increase in client inquiries',
  },
  {
    industry: 'Auto Dealership',
    icon: '🚗',
    challenge: 'A rival dealership orchestrated a review attack with 23 fake reviews from accounts with no purchase history.',
    result: '23 policy-violating reviews flagged and removed across Google and DealerRater.',
    beforeRating: 3.7,
    afterRating: 4.5,
    metric: '28% increase in test drive bookings',
  },
];

function RatingBar({ rating, max = 5 }: { rating: number; max?: number }) {
  const percentage = (rating / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-bold text-slate-900 dark:text-white">{rating}</span>
      </div>
    </div>
  );
}

export default function ProvenResultsSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-4">
            Proven Results
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Real Results for Real Businesses
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            These are real outcomes from businesses that trusted Reach Them AI to restore their
            online reputation and recover lost revenue.
          </p>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {overallStats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
            >
              <div className="text-3xl font-extrabold text-primary-700 dark:text-primary-300">
                {stat.value}
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Case studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <div
              key={study.industry}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{study.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {study.industry}
                </h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Challenge:</strong> {study.challenge}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                <strong className="text-green-600 dark:text-green-400">Result:</strong> {study.result}
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Before</p>
                  <RatingBar rating={study.beforeRating} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">After</p>
                  <RatingBar rating={study.afterRating} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                {study.metric}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/free-assessment"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Get Results Like These
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
