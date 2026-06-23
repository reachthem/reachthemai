import type { Metadata } from 'next';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  Users,
  FileText,
  Brain,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Analytics',
  description:
    'View sentiment trends, rating distribution, and competitor benchmarking. Understand how your reviews and reputation perform over time.',
  openGraph: {
    title: 'Analytics | Reach Them AI',
    description: 'Sentiment trends, rating distribution, and competitor benchmarking.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const upcomingFeatures = [
  {
    icon: TrendingUp,
    title: 'Sentiment Trend Analysis',
    description:
      'Visualize how customer sentiment evolves over time with interactive charts. Spot positive and negative trends before they become patterns.',
  },
  {
    icon: PieChart,
    title: 'Rating Distribution',
    description:
      'See your star rating breakdown across all platforms. Understand the distribution of 1-star through 5-star reviews and track shifts over time.',
  },
  {
    icon: Brain,
    title: 'Keyword Extraction',
    description:
      'Automatically identify the most common words and phrases in your reviews. Discover what customers love — and what needs improvement.',
  },
  {
    icon: Users,
    title: 'Competitor Benchmarking',
    description:
      'Compare your ratings, review volume, and sentiment against competitors in your industry and location. Identify competitive advantages and gaps.',
  },
  {
    icon: BarChart2,
    title: 'Spike Detection',
    description:
      'Get alerted when there is an unusual increase in negative reviews. Detect potential review attacks or service issues early and respond fast.',
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    description:
      'Generate PDF and CSV reports on review performance, rating trends, response rates, and ROI metrics. Schedule weekly email digests for your team.',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <BarChart2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Reputation Analytics</CardTitle>
              <CardDescription>
                Data-driven insights into your online reputation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10 p-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
              <Clock className="h-4 w-4" />
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Sentiment & Trend Analytics
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building a comprehensive analytics suite that transforms your review data
              into actionable insights. Visualize sentiment trends over time, see your rating
              distribution across all platforms, extract common keywords from customer feedback,
              benchmark your reputation against local competitors, detect review spikes early,
              and generate automated reports — giving you the data you need to make smarter
              business decisions and protect your online reputation.
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
              <feature.icon className="h-5 w-5 text-emerald-600 mb-3" />
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
