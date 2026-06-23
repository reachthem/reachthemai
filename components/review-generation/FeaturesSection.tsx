import { Send, Users, BarChart2, Megaphone, CheckCircle2 } from 'lucide-react';

const features = [
  {
    badge: 'Automated Campaigns',
    title: 'Get More Reviews Faster',
    body: 'Create review request campaigns in minutes with customizable templates. Choose your feedback format — NPS, star rating, or thumbs up/down — and send instantly or on a schedule.',
    bullets: ['Customizable message templates', 'NPS, star rating & thumbs formats', 'Instant or scheduled delivery'],
    icon: Send,
  },
  {
    badge: 'Effortless Scale',
    title: 'Reach Every Customer, Every Time',
    body: 'Upload your customer list in bulk and let automated follow-up sequences do the heavy lifting. No lead falls through the cracks.',
    bullets: ['CSV & CRM bulk import', 'Automated follow-up sequences', 'Configurable send cadence'],
    icon: Users,
  },
  {
    badge: 'Smart Insights',
    title: "Learn What's Working",
    body: 'Detailed campaign reporting reveals open rates, response rates, and conversion data — so you can optimize every message for even better results.',
    bullets: ['Open & response rate tracking', 'Campaign performance analytics', 'Template A/B comparison'],
    icon: BarChart2,
  },
  {
    badge: 'Amplify Reviews',
    title: 'Turn Reviews Into New Customers',
    body: 'Showcase your best reviews with embeddable widgets, auto-share highlights to social media, and let your reputation do the selling.',
    bullets: ['Embeddable review widgets', 'Social media auto-sharing', 'Highlight top reviews on your site'],
    icon: Megaphone,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Generate Reviews at Scale
          </h2>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isOdd = index % 2 !== 0;

            return (
              <div
                key={feature.title}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
                <div className={isOdd ? 'lg:order-last' : ''}>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4">
                    {feature.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {feature.body}
                  </p>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={isOdd ? 'lg:order-first' : ''}>
                  <div className="bg-gradient-to-br from-primary-900 to-slate-900 rounded-2xl flex items-center justify-center aspect-[4/3]">
                    <Icon className="h-24 w-24 text-primary-400/50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
