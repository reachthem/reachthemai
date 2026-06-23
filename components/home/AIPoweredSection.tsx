import { Brain, Scale, FileSearch, ShieldCheck, Cpu, Database } from 'lucide-react';

const capabilities = [
  {
    icon: Brain,
    title: 'AI Case Analysis',
    description:
      'Our AI scans every word of the review against thousands of platform policies, past removal precedents, and violation patterns to identify every available removal pathway.',
    badge: 'Policy Intelligence',
    badgeColor: 'text-[#93c5fd]',
    badgeBg: 'bg-[#93c5fd]/10 border border-[#93c5fd]/20',
  },
  {
    icon: Scale,
    title: 'Legal Research Engine',
    description:
      'Cross-references applicable consumer protection laws, defamation statutes, and platform Terms of Service to surface the strongest legal grounds for your specific case.',
    badge: 'Legal Matching',
    badgeColor: 'text-[#FCD0A1]',
    badgeBg: 'bg-[#FCD0A1]/10 border border-[#FCD0A1]/20',
  },
  {
    icon: FileSearch,
    title: 'Evidence Intelligence',
    description:
      'Automatically compiles and structures supporting evidence — timestamps, reviewer patterns, cross-platform data, and behavioral signals — to build the most compelling removal application.',
    badge: 'Smart Evidence',
    badgeColor: 'text-[#93c5fd]',
    badgeBg: 'bg-[#93c5fd]/10 border border-[#93c5fd]/20',
  },
  {
    icon: ShieldCheck,
    title: 'Success Probability Scoring',
    description:
      'Before a single submission is filed, our AI scores the removal likelihood based on historical outcomes, policy strength, and platform-specific acceptance patterns.',
    badge: 'Predictive Accuracy',
    badgeColor: 'text-[#FCD0A1]',
    badgeBg: 'bg-[#FCD0A1]/10 border border-[#FCD0A1]/20',
  },
  {
    icon: Database,
    title: 'Platform Policy Database',
    description:
      'Continuously updated repository of every content guideline, moderation policy, and enforcement history across Google, Yelp, Facebook, and Trustpilot — so we always apply the latest rules.',
    badge: 'Always Current',
    badgeColor: 'text-[#93c5fd]',
    badgeBg: 'bg-[#93c5fd]/10 border border-[#93c5fd]/20',
  },
  {
    icon: Cpu,
    title: 'Strategy Optimization',
    description:
      'When multiple removal pathways exist, the AI ranks them by success rate and speed, selecting the optimal strategy that maximizes your chance of a fast, permanent removal.',
    badge: 'Best Path First',
    badgeColor: 'text-[#FCD0A1]',
    badgeBg: 'bg-[#FCD0A1]/10 border border-[#FCD0A1]/20',
  },
];

export default function AIPoweredSection() {
  return (
    <section className="py-24 bg-[#182825]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-[#FCD0A1]/20 border border-[#FCD0A1]/40 text-[#FCD0A1] rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Cpu className="h-4 w-4" />
            Powered by Sophisticated AI
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 max-md:text-[2.75rem] max-md:leading-[3rem]">
            We Don&apos;t Guess. Our AI{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] to-[#7ab8fc]">
              Finds the Winning Case
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed max-md:leading-[1.75rem]">
            Behind every removal application is a sophisticated AI engine that analyzes your review,
            researches applicable laws and policies, and determines the most effective legal and
            procedural strategy — before we ever submit a single request.
          </p>
        </div>

        {/* Capability grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#93c5fd]/30 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 p-2.5 bg-[#93c5fd]/10 border border-[#93c5fd]/20 rounded-xl">
                    <Icon className="h-5 w-5 text-[#93c5fd]" />
                  </div>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${cap.badgeBg} ${cap.badgeColor} mt-0.5`}>
                    {cap.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{cap.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{cap.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom callout strip */}
        <div className="bg-gradient-to-r from-[#93c5fd]/10 via-[#93c5fd]/5 to-[#93c5fd]/10 border border-[#93c5fd]/20 rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold text-white mb-2">
            The result? The strongest possible removal case, every single time.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Our AI doesn&apos;t just file a report — it engineers a precise, evidence-backed argument
            tailored to each platform&apos;s enforcement process. That&apos;s why we only charge when the review
            is gone.
          </p>
        </div>
      </div>
    </section>
  );
}
