import {
  Bell,
  Bot,
  BarChart3,
  Mail,
  Flag,
  Users2,
} from 'lucide-react';

const features = [
  {
    icon: Bell,
    title: 'Review Monitoring',
    description:
      'Aggregate reviews from Google, Yelp, Facebook, and Trustpilot into one dashboard. Get real-time alerts the moment a new negative review appears — so you can act immediately.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Mail,
    title: 'Review Solicitation',
    description:
      'Automated review request campaigns via email, SMS, and QR codes. Build a steady stream of positive reviews to offset negatives and grow your overall rating.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description:
      'Generate professional, on-brand responses to any review in seconds. Customize tone, review before sending, and let AI handle the heavy lifting of reputation management.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: BarChart3,
    title: 'Sentiment Analytics',
    description:
      'Visualize your review trends, rating distribution, and keyword patterns. Understand what customers love and what needs attention with AI-driven insights.',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Users2,
    title: 'Competitor Benchmarking',
    description:
      'See how your ratings stack up against local competitors. Track review volume and rating trends side-by-side to identify opportunities and stay ahead.',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: Flag,
    title: 'Flagging & Dispute Tools',
    description:
      'Guided forms to formally report policy-violating reviews with document uploads and evidence. Track the status of every dispute through to resolution.',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white max-md:text-[1.75rem]">
            Everything You Need to Protect Your Reputation
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto max-md:text-[1.1rem]">
            Beyond review removal — a complete reputation management platform to monitor, respond,
            and grow your online presence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all max-md:text-center"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-5 max-md:mx-auto`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
