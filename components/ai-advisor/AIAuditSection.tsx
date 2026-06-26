import {
  ClipboardPaste,
  BrainCog,
  FileBarChart,
  ListChecks,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const auditSteps = [
  {
    step: '01',
    icon: ClipboardPaste,
    title: 'Paste Your Review',
    description:
      'Copy the review text and URL from any supported platform — Google, Yelp, Facebook, Trustpilot, TripAdvisor, or BBB. No login to those platforms required.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    ring: 'ring-blue-200 dark:ring-blue-800',
  },
  {
    step: '02',
    icon: BrainCog,
    title: 'AI Scans for Violations',
    description:
      'The AI analyzes the review against the platform\'s content policy, terms of service, and applicable legal frameworks — returning results in seconds, not days.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    ring: 'ring-violet-200 dark:ring-violet-800',
  },
  {
    step: '03',
    icon: FileBarChart,
    title: 'Get Your Audit Report',
    description:
      'Receive a detailed report: violation categories detected, removal probability score, legal grounds summary, and the platform\'s exact flagging process — all in one place.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    ring: 'ring-green-200 dark:ring-green-800',
  },
  {
    step: '04',
    icon: ListChecks,
    title: 'Follow the Action Plan',
    description:
      'Your report includes step-by-step instructions tailored to the specific platform. Follow the AI\'s suggested actions, or ask follow-up questions in the AI chat.',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    ring: 'ring-orange-200 dark:ring-orange-800',
  },
];

const deliverables = [
  'Policy violation assessment with specific clauses cited',
  'Removal probability score (Low / Medium / High)',
  'Legal grounds summary (defamation, FTC, CDA §230)',
  'Platform-specific flagging instructions',
  'Suggested response templates',
  'Follow-up AI chat for questions',
];

export default function AIAuditSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Self-Service AI Audit
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Your AI-Guided Review Audit — $49/month
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            No waiting for a consultant. No retainer fees. Submit a review, get an AI-powered
            audit report, and take action yourself — on your schedule.
          </p>
        </div>

        {/* Self-service vs full-service callout */}
        <div className="mb-16 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Self-Service AI Audit&nbsp;
              <span className="text-primary-600 dark:text-primary-400">($49/mo)</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              You submit reviews, review the AI audit report, and follow the step-by-step
              removal instructions at your own pace. Unlimited analyses, AI chat support,
              and a case-tracking dashboard included.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Full-Service Removal&nbsp;
              <span className="text-slate-500 dark:text-slate-400">(Custom)</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Need someone to handle everything? Our full-service tier pairs AI analysis
              with a dedicated reputation specialist who files disputes, drafts appeals, and
              monitors outcomes for you.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop vertical line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-violet-200 to-orange-200 dark:from-blue-800 dark:via-violet-800 dark:to-orange-800" />

          <div className="space-y-10">
            {auditSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative flex gap-6 md:gap-8 items-start">
                  <div
                    className={`relative z-10 flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full ${item.bg} ring-4 ${item.ring} bg-white dark:bg-slate-900`}
                  >
                    <Icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <div className="pt-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${item.color} mb-1 block`}>
                      Step {item.step}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What you receive */}
        <div className="mt-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 md:p-10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            What You Receive in Every Audit
          </h3>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/app/removal-advisor"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/30 hover:shadow-primary-600/30 hover:-translate-y-0.5"
            >
              Start Your First Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
