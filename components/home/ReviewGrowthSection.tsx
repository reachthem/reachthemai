import { ArrowUpRight, Bell, Clipboard, Mail, Share2, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Clipboard,
    title: 'Branded review landing pages',
    description:
      'Customers are guided to leave feedback on Google, Facebook, Yelp and other platforms, while lower ratings are routed to private feedback forms first.',
  },
  {
    icon: Mail,
    title: 'Bulk review requests',
    description:
      'Send personalized email campaigns from our dashboard with AI-optimized messaging, or let our managed service handle it for you.',
  },
  {
    icon: Share2,
    title: 'Social sharing and amplification',
    description:
      'Turn positive feedback into brand visibility with one-click sharing to social channels and review platforms.',
  },
  {
    icon: Bell,
    title: 'Real-time alerts and responses',
    description:
      'Get notified instantly when new reviews arrive and use AI suggestions to reply quickly and professionally.',
  },
  {
    icon: Sparkles,
    title: 'Review analytics and trends',
    description:
      'Track total reviews, star rating velocity, sentiment, and high-impact opportunities in one simple dashboard.',
  },
];

export default function ReviewGrowthSection() {
  return (
    <section id="review-growth" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            Review Growth
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Increase 5-Star Reviews and Reduce Negative Feedback
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We help local businesses collect more positive reviews on Google Business, Yelp, Facebook and other top platforms while routing low ratings into private feedback before they go public.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/business-review-scan"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-300 font-semibold hover:text-primary-500 transition-colors"
          >
            Learn how our review growth tools work
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
