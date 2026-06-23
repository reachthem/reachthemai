import {
  Search,
  FileCheck,
  Scale,
  BarChart3,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Deep Review Analysis',
    description:
      'AI scans the full review text for platform policy violations, fake review signals, and legal removal grounds — surfacing the strongest angles automatically.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: FileCheck,
    title: 'Platform-Specific Instructions',
    description:
      'Every platform has a different flagging process. Get step-by-step instructions tailored to Google, Yelp, Facebook, Trustpilot, TripAdvisor, and more.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Scale,
    title: 'Legal & Policy Grounds',
    description:
      'The AI identifies the strongest legal and terms-of-service arguments for removal — defamation, fake reviewer signals, off-topic content, and more.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: BarChart3,
    title: 'Confidence Scoring',
    description:
      'Know your odds before you file. Each analysis includes a confidence score so you can prioritize your strongest cases and set realistic expectations.',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: MessageSquare,
    title: 'Follow-Up AI Chat',
    description:
      'Have more questions about your case? Ask the AI directly. Get follow-up clarification, alternative strategies, or help drafting your platform dispute.',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: LayoutDashboard,
    title: 'Case Tracking Dashboard',
    description:
      'Stay organized. Track every removal case — active, reported, pending, or resolved — from a single dashboard so nothing slips through the cracks.',
    color: 'text-primary-600 dark:text-primary-400',
    bg: 'bg-primary-50 dark:bg-primary-900/20',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            What&apos;s Included
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Everything You Need to Fight Back
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            One subscription. Unlimited AI analyses. All the tools to identify, challenge, and track
            the removal of negative reviews across every major platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-5`}>
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
