import Link from 'next/link';
import { Brain, CheckCircle2, DollarSign, Shield, Sparkles } from 'lucide-react';

const advisorIncluded = [
  'Unlimited analyses — submit as many reviews as you need',
  'Platform-specific instructions for Google, Yelp, Facebook, Trustpilot & more',
  'Strongest legal & policy-based grounds identified automatically',
  'Follow-up AI chat to dig deeper into your specific case',
  'Case tracking dashboard — all your removal efforts in one place',
  'Confidence scoring so you know your odds before you file',
];

const removalIncluded = [
  'Expert case preparation',
  'Direct platform submission',
  'Follow-up and status tracking',
  'Results typically in 24 to 48 hours',
  'Full refund if removal is unsuccessful',
];

interface PricingBlocksProps {
  advisorPrice?: string;
  removalPrice?: string;
  className?: string;
}

export default function PricingBlocks({
  advisorPrice = '49',
  removalPrice = '49',
  className = '',
}: PricingBlocksProps) {
  return (
    <div className={`grid gap-8 lg:grid-cols-2 ${className}`.trim()}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary-600/10 blur-2xl rounded-3xl" />
        <div className="relative bg-white dark:bg-slate-800 rounded-3xl border-2 border-primary-500 shadow-2xl overflow-hidden">
          <div className="bg-primary-600 py-2.5 px-8 text-center">
            <span className="text-white text-sm font-semibold">Unlimited AI-Guided Removal</span>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-1">
              <Brain className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Removal Advisor</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Monthly subscription — unlimited analyses
            </p>

            <div className="mt-6 text-center py-6 border-y border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-center gap-1">
                <span className="text-3xl font-bold text-primary-600 mt-3 max-md:text-2xl">$</span>
                <span className="text-8xl font-extrabold text-slate-900 dark:text-white max-md:text-[4rem]">
                  {advisorPrice}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">per month</p>
            </div>

            <ul className="mt-6 space-y-3">
              {advisorIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-primary-600/10 blur-2xl rounded-3xl" />
        <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          <div className="bg-slate-900 dark:bg-slate-700 py-2.5 px-8 text-center">
            <span className="text-white text-sm font-semibold">Results Guaranteed</span>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Review Removal Service</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              One-time payment per review successfully removed
            </p>

            <div className="mt-6 text-center py-6 border-y border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-center gap-1">
                <DollarSign className="h-8 w-8 text-primary-600 mt-3 max-md:h-6 max-md:w-6" />
                <span className="text-8xl font-extrabold text-slate-900 dark:text-white max-md:text-[4rem]">
                  {removalPrice}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">per review successfully removed</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                <Shield className="h-4 w-4" />
                100% money-back guarantee
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {removalIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
            >
              Request a Removal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
