import Link from 'next/link';
import { Check, ArrowRight, Bot, UserCheck } from 'lucide-react';
import AdvisorCheckoutButton from '@/components/shared/AdvisorCheckoutButton';

interface TwoPathsRemovalSectionProps {
  advisorPrice?: string;
  removalPrice?: string;
  advisorButtonHref?: string;
  advisorButtonText?: string;
  advisorCheckoutWhenAuthenticated?: boolean;
  removalButtonHref?: string;
  removalButtonText?: string;
}

/**
 * Side-by-side block with "Two Paths to Removal" / "Choose Your Removal Strategy" headline
 * and the AI Review Advisor + Full Service Removal cards (same card design as home ServiceSelectionSection).
 */
export default function TwoPathsRemovalSection({
  advisorPrice = '19',
  removalPrice = '299',
  advisorButtonHref = '/ai-advisor',
  advisorButtonText = 'Get AI Advisor',
  advisorCheckoutWhenAuthenticated = false,
  removalButtonHref = '/review-removal-services',
  removalButtonText = 'Get Full Service',
}: TwoPathsRemovalSectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-primary-600 uppercase tracking-widest font-medium mb-3">
            Two Paths to Removal
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary-900 mb-4">
            Choose Your Removal Strategy
          </h2>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Every flagged review gives you two options — handle it yourself with AI guidance,
            or let our experts do everything for you.
          </p>
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
                AI Review Advisor
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Self-service tool for instant analysis and step-by-step removal guidance.
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
              {[
                'Instant policy violation analysis',
                'Step-by-step removal instructions',
                'Customized response templates',
                'Unlimited review analysis',
                'Works for Google, Yelp, Facebook & more',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {advisorCheckoutWhenAuthenticated ? (
              <AdvisorCheckoutButton
                unauthenticatedHref={advisorButtonHref}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                <>
                  {advisorButtonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              </AdvisorCheckoutButton>
            ) : (
              <Link
                href={advisorButtonHref}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                {advisorButtonText}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Full Service Card */}
          <div className="relative group bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-800 dark:border-slate-600 flex flex-col text-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-t-2xl" />

            <div className="mb-6">
              <div className="w-14 h-14 bg-primary-900/50 rounded-xl flex items-center justify-center mb-4 text-primary-400">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Full Service Removal
              </h3>
              <p className="text-slate-300">
                We handle the entire removal process for you. Professional & risk-free.
              </p>
            </div>

            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${removalPrice}</span>
                <span className="text-slate-300">/removal</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Pay only for successful removals.
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {[
                'Dedicated removal specialist',
                'We file all disputes & appeals',
                '100% Money-back guarantee',
                'No upfront fees',
                'Results in 1-4 weeks typically',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={removalButtonHref}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20"
            >
              {removalButtonText}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
