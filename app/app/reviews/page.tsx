import type { Metadata } from 'next';
import {
  Star,
  Bell,
  Search,
  Globe,
  Smartphone,
  Filter,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'Monitor your reviews across Google, Yelp, Facebook, and Trustpilot. Track new reviews, ratings, and sentiment in one dashboard.',
  openGraph: {
    title: 'Reviews | Reach Them AI',
    description: 'Monitor reviews across Google, Yelp, Facebook, and Trustpilot.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const upcomingFeatures = [
  {
    icon: Globe,
    title: 'Multi-Platform Aggregation',
    description:
      'See every review from Google, Yelp, Facebook, Trustpilot, TripAdvisor, and more — all in one unified dashboard. No more switching between platforms.',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description:
      'Get instant email and push notifications the moment a new review is posted. React to negative reviews within minutes instead of days.',
  },
  {
    icon: Search,
    title: 'Full-Text Search',
    description:
      'Search across all your reviews by keyword, rating, date, platform, or sentiment. Find exactly what you need in seconds.',
  },
  {
    icon: Filter,
    title: 'Advanced Filtering & Sorting',
    description:
      'Filter reviews by star rating, sentiment score, platform, date range, and response status. Sort by newest, most critical, or highest impact.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Companion',
    description:
      'Monitor reviews on the go with our mobile app. Receive push notifications and quickly respond to reviews from your phone.',
  },
  {
    icon: Clock,
    title: 'Review Timeline',
    description:
      'Track how your reviews evolve over time with a visual timeline. Spot trends, identify review spikes, and correlate with business events.',
  },
];

export default function ReviewsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>Review Monitoring Dashboard</CardTitle>
              <CardDescription>
                All your reviews from every platform — in one place
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10 p-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
              <Clock className="h-4 w-4" />
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Multi-Platform Review Tracking
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building a centralized review dashboard that aggregates reviews from Google,
              Yelp, Facebook, Trustpilot, and other major platforms into a single, searchable feed.
              You&apos;ll get real-time alerts for new reviews, powerful filtering tools, sentiment
              analysis, and a complete timeline of your online reputation — all without ever
              leaving the app.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          What&apos;s Coming
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <feature.icon className="h-5 w-5 text-amber-500 mb-3" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
