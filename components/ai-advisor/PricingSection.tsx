import Link from 'next/link';
import { CheckCircle2, Lock, Shield, Star, Brain } from 'lucide-react';

const included = [
  'Unlimited analyses — submit as many reviews as you need',
  'Platform-specific instructions for Google, Yelp, Facebook, Trustpilot & more',
  'Strongest legal & policy-based grounds identified automatically',
  'Follow-up AI chat to dig deeper into your specific case',
  'Case tracking dashboard — all your removal efforts in one place',
  'Confidence scoring so you know your odds before you file',
];

const platforms = ['Google', 'Yelp', 'Facebook', 'Trustpilot', 'TripAdvisor'];

interface PricingSectionProps {
  advisorPrice?: string;
}

export default function PricingSection({ advisorPrice = '19' }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Simple, Affordable Pricing
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            One flat monthly subscription. Unlimited analyses. Cancel anytime.
          </p>
        </div>

        <div className="relative mx-auto max-w-lg">
          <div className="absolute inset-0 bg-primary-600/10 blur-2xl rounded-3xl" />
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl border-2 border-primary-500 shadow-2xl overflow-hidden">
            <div className="bg-primary-600 py-2.5 px-8 text-center">
              <span className="text-white text-sm font-semibold">
                Unlimited AI-Guided Removal
              </span>
            </div>

            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-1">
                <Brain className="h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  AI Removal Advisor
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Monthly subscription — unlimited analyses
              </p>

              {/* Price */}
              <div className="mt-6 text-center py-6 border-y border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-3xl font-bold text-primary-600 mt-3">$</span>
                  <span className="text-8xl font-extrabold text-slate-900 dark:text-white">{advisorPrice}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">per month</p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-4 py-2.5 max-w-xs mx-auto">
                  Reputation Management Agencies charge{' '}
                  <strong className="text-slate-700 dark:text-slate-300">$250–$1,500 per review removed</strong>.
                  {' '}Get AI-powered instructions, plans and follow-up for ${'$'}
                  {advisorPrice}.
                </p>
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Platform support */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">
                  Works with reviews from
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {platforms.map((p) => (
                    <span
                      key={p}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/auth/register"
                className="mt-8 w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5"
              >
                Subscribe
              </Link>

              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  Secure payments via Stripe
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Cancel anytime
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  No long-term contract
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
