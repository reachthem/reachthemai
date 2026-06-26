import { CheckCircle2 } from 'lucide-react';
import AdvisorPricingCard from '@/components/pricing/AdvisorPricingCard';

const advisorBenefits = [
  'Full plan of action for every review',
  'Platform-specific step-by-step guidance',
  'Follow-up recommendations and next-step outlines',
  'Answers to case-specific follow-up questions',
  'Unlimited analyses across major review platforms',
  'Confidence scoring before you file',
];

interface AdvisorServiceSectionProps {
  advisorPrice?: string;
}

export default function AdvisorServiceSection({
  advisorPrice = '49',
}: AdvisorServiceSectionProps) {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-4">
            Self-Service AI Tool
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            AI Review Removal Advisor
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
            Don&apos;t let fake or policy-violating reviews damage your reputation. Get a full plan of action,
            step by step guide, follow up recommendations, next step outline and answers to any follow-up
            question for each and every review across the internet.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
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
                  The AI Review Advisor analyzes each review, identifies the strongest policy and legal
                  grounds available, then gives you a tailored action plan with platform-specific
                  instructions, follow-up recommendations, next steps, and answers to your case-specific
                  questions.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3 max-md:text-[1.2rem]">
                  What you get:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-md:text-[1.1rem] max-md:mt-5">
                  {advisorBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          <div className="flex justify-center">
            <AdvisorPricingCard advisorPrice={advisorPrice} className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
