import { Search, Brain, FileBarChart, Flag, Shield, RefreshCw } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    step: 1,
    icon: Search,
    title: 'SCRAPE',
    headline: 'Pull Every Review',
    description:
      'We connect to Google and pull every single review for your business — not just the first page. Reviewer names, ratings, timestamps, responses, and full review text.',
    detail: 'Supports businesses with hundreds or even thousands of reviews.',
  },
  {
    step: 2,
    icon: Brain,
    title: 'ANALYZE',
    headline: 'AI Policy Classification',
    description:
      'Each review is analyzed by our AI against Google\'s Maps User Contributed Content Policy. We check for 9 distinct violation categories including spam, fake reviews, conflicts of interest, harassment, and more.',
    detail: 'Conservative classification — negative reviews are legitimate unless they violate policy.',
  },
  {
    step: 3,
    icon: FileBarChart,
    title: 'SCORE',
    headline: 'Confidence & Threat Scoring',
    description:
      'Every flagged review receives a confidence score (0–100%) indicating how likely it is to violate Google\'s policies. Higher scores mean stronger removal cases. We also identify the specific policy citation and removal ground.',
    detail: 'Prioritize your effort on the reviews most likely to be removed.',
  },
  {
    step: 4,
    icon: Flag,
    title: 'REPORT',
    headline: 'Detailed Threat Report',
    description:
      'Your dashboard shows a complete breakdown: total reviews scanned, threats identified, violation types, and a per-review analysis. Filter by threat type, confidence level, or rating.',
    detail: 'Exportable data for your records or legal team.',
  },
  {
    step: 5,
    icon: Shield,
    title: 'REMOVE',
    headline: 'Take Action',
    description:
      'REMOVE_DESCRIPTION_PLACEHOLDER',
    detail: 'Two paths: self-service AI guidance or full-service professional removal.',
  },
  {
    step: 6,
    icon: RefreshCw,
    title: 'MONITOR',
    headline: 'Continuous Protection',
    description:
      'New reviews appear daily. The Machine runs scheduled re-scans to catch new threats as they appear. Get notified when a new policy-violating review is posted so you can act fast.',
    detail: 'Stay protected 24/7 with automated monitoring.',
  },
];

interface PipelineSectionProps {
  removalPrice?: string;
}

function getPipelineSteps(removalPrice: string) {
  const description = `Every flagged review has one-click paths to removal. Use our AI Removal Advisor for DIY step-by-step guidance, or hand it off to our professional removal team for $${removalPrice} per review with a 100% money-back guarantee.`;
  return PIPELINE_STEPS.map((step) =>
    step.step === 5 ? { ...step, description } : step
  );
}

export default function PipelineSection({ removalPrice = '299' }: PipelineSectionProps) {
  const steps = getPipelineSteps(removalPrice);

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-primary-600 uppercase tracking-widest font-medium mb-3">
            The 6-Step Pipeline
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary-900 mb-4">
            How The Machine Works
          </h2>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            From scan to removal — a fully automated pipeline that identifies every
            policy-violating review and gives you the tools to remove them.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className={`flex flex-col md:flex-row items-start gap-6 p-8 rounded-2xl border transition-shadow hover:shadow-md ${
                idx % 2 === 0
                  ? 'bg-white border-secondary-200'
                  : 'bg-secondary-50 border-secondary-100'
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-center mt-2 text-xs font-bold text-primary-600 uppercase tracking-widest">
                  Step {step.step}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">
                  {step.title}
                </p>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{step.headline}</h3>
                <p className="text-secondary-600 leading-relaxed mb-2">{step.description}</p>
                <p className="text-sm text-secondary-500 italic">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
