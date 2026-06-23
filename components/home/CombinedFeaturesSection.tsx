import { ShieldCheck, Zap, Scale, TrendingUp } from 'lucide-react';

export default function CombinedFeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary-500" />,
      title: '100% Legitimate & Safe',
      description:
        'We strictly follow platform content policies. No bots, no fake reports, and no black-hat tactics that could get your account banned.',
    },
    {
      icon: <Scale className="h-8 w-8 text-primary-500" />,
      title: 'Policy-Based Removal',
      description:
        'Our AI analyzes reviews against 50+ specific platform violations and legal statutes (defamation, terms of service) to find valid grounds for removal.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-500" />,
      title: 'AI-Powered Precision',
      description:
        'We use advanced Natural Language Processing (NLP) to detect policy violations that human moderators often miss.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-500" />,
      title: 'Boost Your Reputation',
      description:
        'Removing unfair negative reviews improves your star rating, builds trust with customers, and directly impacts your bottom line.',
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            The Smartest Way to Manage Reviews
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Whether you choose our AI Advisor or Full Service Removal, you get the benefit of our cutting-edge technology and expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 bg-white dark:bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
