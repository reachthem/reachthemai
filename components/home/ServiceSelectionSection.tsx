import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight, Bot, UserCheck } from 'lucide-react';

interface ServiceSelectionSectionProps {
  advisorPrice?: string;
  removalPrice?: string;
}

export default function ServiceSelectionSection({ advisorPrice = '19', removalPrice = '299' }: ServiceSelectionSectionProps) {
  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 max-md:text-base">
            Choose Your Path to a Better Reputation
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-base max-md:leading-6">
            Whether you prefer a DIY approach with AI guidance or want us to handle everything for you, we have a solution.
          </p>
          <div className="mt-8 flex justify-center">
            <Image src="/guarantee.png" alt="Guarantee" width={350} height={200} className="max-w-[350px] w-full h-auto" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* AI Advisor Card */}
          <div className="relative group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-t-2xl" />
            
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Review Generation Platform
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                $19 per month for access to all review generation tools and campaign features.
              </p>
            </div>

            <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">${advisorPrice}</span>
                <span className="text-slate-500 dark:text-slate-400">/month</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Cancel anytime. No long-term contracts.
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  Access to All Review Generation Features (See Below)
                  <ul className="mt-2 ml-6 list-disc text-sm text-slate-500 dark:text-slate-400 space-y-1">
                    <li>Branded review landing pages</li>
                    <li>Bulk review request campaigns</li>
                    <li>Social sharing and amplification</li>
                    <li>Real-time alerts and responses</li>
                    <li>Review analytics and trends</li>
                    <li>AI-powered review intelligence</li>
                  </ul>
                </span>
              </li>
            </ul>

            <Link
              href="/review-generation"
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
            >
              More Details
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Managed Review Campaigns Card */}
          <div className="relative group bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-800 dark:border-slate-600 flex flex-col text-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-t-2xl" />
            
            <div className="mb-6">
              <div className="w-14 h-14 bg-primary-900/50 rounded-xl flex items-center justify-center mb-4 text-primary-400">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Fully Managed Review Campaigns
              </h3>
              <p className="text-slate-300">
                Guaranteed results for positive review growth with hands-off execution.
              </p>
            </div>

            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${removalPrice}</span>
                <span className="text-slate-300">/month</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Guaranteed 50 positive reviews per month or you don&apos;t pay.
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {[
                'Guaranteed 50 5-Star Reviews Per Month or You Don\'t Pay',
                'Fully Managed Review Campaigns',
                'Weekly Reports Emailed Showing Positive Reviews',
                'Weekly Reports on Google Business KPI Improvements',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/business-review-scan"
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20"
            >
              Start Managed Growth
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
