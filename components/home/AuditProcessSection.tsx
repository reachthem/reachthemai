import Link from 'next/link';
import { ArrowRight, Search, Brain, FileCheck, BarChart3, Send } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Review Collection',
    description: 'We gather all your reviews across Google, Yelp, Facebook, Trustpilot, and other relevant platforms into a single comprehensive profile.',
  },
  {
    icon: Brain,
    title: 'AI Policy Analysis',
    description: 'Our AI engine scans each negative review against the full library of platform content policies, terms of service, and applicable legal grounds.',
  },
  {
    icon: FileCheck,
    title: 'Violation Identification',
    description: 'Every policy violation is documented with specific citations, evidence mapping, and the precise clause each review violates.',
  },
  {
    icon: BarChart3,
    title: 'Success Probability Scoring',
    description: 'Each review receives a removal probability score based on violation severity, platform enforcement patterns, and historical success rates.',
  },
  {
    icon: Send,
    title: 'Strategy & Report Delivery',
    description: 'You receive a detailed audit report with our findings, recommended removal strategy, estimated timeline, and a clear breakdown of expected outcomes.',
  },
];

export default function AuditProcessSection() {
  return (
    <section className="py-24 bg-[#182825] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-600/20 text-primary-300 text-sm font-medium mb-4">
            Our Audit Process
          </span>
          <h2 className="text-4xl font-bold">
            How We Evaluate Your Reviews for Removal
          </h2>
          <p className="mt-4 text-xl text-slate-300 max-w-3xl mx-auto">
            Every engagement starts with a free, comprehensive review audit. Our AI-powered process
            identifies exactly which reviews can be removed and builds the strategy before we begin.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-600/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-7 w-7 text-primary-400" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-green-300 text-sm mb-6">
            Free · No obligation · Results in 24–48 hours
          </div>
          <br />
          <Link
            href="/free-assessment"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Request Your Free Audit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
