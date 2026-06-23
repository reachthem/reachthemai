import { ClipboardList, Search, CheckCircle2, TrendingUp } from 'lucide-react';

function buildSteps(removalPrice: string) {
  return [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Submit Your Review',
    description:
      "Tell us which negative review is hurting your business. We'll assess it for policy violations and removal eligibility at no cost.",
    detail: 'Free, no-obligation assessment',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
  {
    step: '02',
    icon: Search,
    title: 'AI Builds Your Case',
    description:
      'Our AI algorithms and legal research engine analyze the review, identify every applicable policy violation or legal ground, and engineer the strongest possible removal application.',
    detail: 'AI-powered case strategy',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Review Removed',
    description:
      `We submit the removal application directly to the platform. Once approved, the review is permanently gone — and you pay only $${removalPrice}.`,
    detail: `Pay $${removalPrice} only on success — full refund if we cannot remove the review`,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Protect & Grow',
    description:
      'Use our platform tools to monitor new reviews, automate review requests, generate AI responses, and maintain a strong reputation going forward.',
    detail: 'Ongoing reputation management',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
  },
];
}

interface HowItWorksSectionProps {
  removalPrice?: string;
}

export default function HowItWorksSection({ removalPrice = '299' }: HowItWorksSectionProps) {
  const steps = buildSteps(removalPrice);
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="how-it-works-title text-4xl font-bold text-slate-900 dark:text-white">
            From Submission to Removal in 4 Simple Steps
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A transparent, risk-free process. You only pay when we deliver results.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-green-200 dark:from-blue-800 dark:via-violet-800 dark:to-green-800" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-2 ${step.border} ${step.bg} mb-6`}>
                  <Icon className={`h-6 w-6 ${step.color}`} />
                </div>

                <span className={`text-xs font-bold uppercase tracking-widest ${step.color} mb-2`}>
                  Step {step.step}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {step.description}
                </p>
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${step.bg} ${step.color}`}>
                  {step.detail}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical stack — icon over step */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex flex-col">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${step.border} ${step.bg} flex-shrink-0 mb-4`}>
                  <Icon className={`h-5 w-5 ${step.color}`} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step.color}`}>
                  Step {step.step}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700 mt-6" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
