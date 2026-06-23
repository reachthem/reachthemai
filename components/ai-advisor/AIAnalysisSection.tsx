import {
  BrainCircuit,
  ScanSearch,
  Fingerprint,
  Globe,
  Scale,
  Zap,
} from 'lucide-react';

const capabilities = [
  {
    icon: ScanSearch,
    title: 'Natural Language Processing',
    description:
      'Our AI reads every word of a review the way a human expert would — extracting sentiment, intent, and factual claims to determine if the content crosses platform policy lines.',
    stat: '95%+ accuracy',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Fingerprint,
    title: 'Pattern Recognition',
    description:
      'Detects fake reviewer fingerprints — newly created accounts, copy-paste language, competitor-driven review bombing, and coordinated attack patterns that platforms flag for removal.',
    stat: '200k+ patterns indexed',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: Globe,
    title: 'Platform Policy Matching',
    description:
      'Each platform enforces different content policies. The AI maps review content against the specific guidelines for Google, Yelp, Facebook, Trustpilot, TripAdvisor, and BBB in real time.',
    stat: '15+ platforms',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: Scale,
    title: 'Legal Database Cross-Referencing',
    description:
      'The AI cross-references review content with defamation statutes, FTC guidelines, and CDA Section 230 precedents to surface the strongest legal arguments for removal.',
    stat: 'Updated in real time',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Zap,
    title: 'Instant Confidence Scoring',
    description:
      'Every analysis produces a removal probability score so you know exactly where your case stands — no guesswork, no wasted effort on low-odds disputes.',
    stat: 'Results in under 30s',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: BrainCircuit,
    title: 'Continuously Learning Model',
    description:
      'Every resolved case feeds back into the model. As platforms update their policies and enforcement patterns, the AI adapts — so your guidance is always current.',
    stat: '10k+ cases trained on',
    color: 'text-primary-600 dark:text-primary-400',
    bg: 'bg-primary-50 dark:bg-primary-900/20',
  },
];

export default function AIAnalysisSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Under the Hood
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            How the AI Reads &amp; Evaluates Reviews
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our AI doesn&apos;t just keyword-match — it understands context, intent, and
            platform-specific rules to find the strongest path to removal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="group bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all"
              >
                <div className={`inline-flex p-3 rounded-xl ${cap.bg} mb-5`}>
                  <Icon className={`h-6 w-6 ${cap.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {cap.description}
                </p>
                <span
                  className={`inline-block text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${cap.bg} ${cap.color}`}
                >
                  {cap.stat}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
