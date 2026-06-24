import { AlertCircle, Clock, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const painPoints = [
  {
    icon: AlertCircle,
    title: 'Reviews Fall Through the Cracks',
    description:
      'Happy customers mean to leave a review but forget. Without a timely nudge, most never do — and your star count stagnates.',
  },
  {
    icon: Clock,
    title: "Manual Follow-Up Doesn't Scale",
    description:
      'Chasing customers one by one via phone or text is time-consuming, inconsistent, and impossible to maintain as you grow.',
  },
  {
    icon: TrendingDown,
    title: 'Stale Reviews Hurt Rankings',
    description:
      'Google and Yelp favor businesses with recent, ongoing review activity. Old reviews signal inactivity and drag down your local ranking.',
  },
];

export default function PainPointsSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">
            The Challenge
          </span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Businesses Struggle to Get Reviews
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Most happy customers never leave a review — and the ones who do aren&apos;t always the
            ones you want representing your business online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card
                key={point.title}
                className="border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 mb-5">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {point.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            There&apos;s a Better Way
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Let our platform do the heavy lifting. Our fully managed service handles everything — from strategy and messaging to campaign scheduling and response management — so you can focus on your business while we grow your reviews on autopilot. Or take control with our self-service tools if you prefer a hands-on approach.
          </p>
        </div>
      </div>
    </section>
  );
}
