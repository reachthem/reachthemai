import Link from 'next/link';
import { ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';
import AuthAwareLinkButton from '@/components/shared/AuthAwareLinkButton';

const benefits = [
  'Fake and fraudulent reviews',
  'Competitor or spam reviews',
  'Reviews with personal attacks',
  'Content violating platform policies',
  'Reviews from non-customers',
  'Incentivized or manipulated reviews',
];

interface CoreServiceSectionProps {
  removalPrice?: string;
  freeAssessmentHref?: string;
  submitRemovalAuthenticatedHref?: string;
}

export default function CoreServiceSection({
  removalPrice = '299',
  freeAssessmentHref = '/auth/register',
  submitRemovalAuthenticatedHref = '/auth/register',
}: CoreServiceSectionProps) {
  return (
    <section id="service" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium mb-4">
            Flagship Service
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Professional Negative Review Removal
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Don&apos;t let fake or policy-violating reviews damage your reputation. We file formal removal
            applications directly with the platforms — the legitimate way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="space-y-6">
              <div className="max-md:text-center">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  The Problem
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Negative reviews damage revenue, deter new customers, and persist for years — even
                  when they&apos;re fake, fabricated by competitors, or clearly violate platform rules. A
                  single 1-star review can undo months of hard-earned positive ratings.
                </p>
              </div>

              <div className="max-md:text-center">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Our Solution
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We identify the specific platform policy or legal grounds for removal, build a
                  compelling case, and submit formal removal applications directly to Google, Yelp,
                  Facebook, and Trustpilot. Our team knows exactly what works.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3 max-md:text-[1.2rem] we-can-remove-heading">
                  We can remove:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-md:text-[1.1rem] max-md:mt-5 we-can-remove-list">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="max-md:flex max-md:justify-center">
            <Link
              href={freeAssessmentHref}
              className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Get a Free Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          </div>

          {/* Right: Pricing card */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary-600/20 blur-2xl rounded-3xl" />

              <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Review Removal
                  </h3>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    Results-based
                  </span>
                </div>

                <div className="text-center py-6 border-y border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-center gap-1">
                    <DollarSign className="h-8 w-8 text-primary-600 mt-2" />
                    <span className="text-7xl font-extrabold text-slate-900 dark:text-white">{removalPrice}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">per review successfully removed</p>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mt-3">
                    Our services are guaranteed: if we cannot get your review removed, you get a full refund.
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {[
                    '100% money back guarantee',
                    'Only pay for successful removals',
                    'Free initial assessment',
                    'Direct platform submissions',
                    'Removal typically in 1–4 weeks',
                    'All supported platforms included',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <AuthAwareLinkButton
                  authenticatedHref={submitRemovalAuthenticatedHref}
                  unauthenticatedHref="/auth/register"
                  className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                  Submit a Review for Removal
                </AuthAwareLinkButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
