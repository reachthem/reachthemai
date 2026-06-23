import Link from 'next/link';
import { Brain, Shield, ArrowRight, Zap, DollarSign, Clock } from 'lucide-react';

interface RemovalPathsSectionProps {
  advisorPrice?: string;
  removalPrice?: string;
}

export default function RemovalPathsSection({ advisorPrice = '19', removalPrice = '299' }: RemovalPathsSectionProps) {
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* DIY Path */}
          <div className="bg-white border-2 border-secondary-200 rounded-2xl p-8 hover:border-primary-300 transition-colors">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
              <Brain className="h-7 w-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3">AI Removal Advisor</h3>
            <p className="text-secondary-600 mb-6 leading-relaxed">
              Our AI agent provides personalized, step-by-step removal instructions for each
              flagged review. It identifies the strongest removal ground, writes your flag report,
              and guides you through the platform&apos;s dispute process.
            </p>
            <div className="space-y-3 mb-6">
              {[
                { icon: Zap, text: 'Instant AI-generated removal strategy' },
                { icon: Brain, text: 'Policy citation & evidence guidance' },
                { icon: Clock, text: 'Ongoing chat support for follow-ups' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="text-sm text-secondary-700">{item.text}</span>
                </div>
              ))}
            </div>
            <p className="text-2xl font-bold text-secondary-900 mb-4">${advisorPrice}<span className="text-base font-normal text-secondary-500">/month</span></p>
            <Link
              href="/ai-advisor"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Professional Path */}
          <div className="bg-[#182825] text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-[#FCD0A1] text-[#182825] text-xs font-bold px-3 py-1 rounded-full uppercase">
                Most Popular
              </span>
            </div>
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-primary-300" />
            </div>
            <h3 className="text-xl font-bold mb-3">Professional Removal Service</h3>
            <p className="text-secondary-300 mb-6 leading-relaxed">
              Our expert team handles everything — from building the strongest possible case
              to submitting the removal application and following up with the platform.
              100% money-back guarantee if the review isn&apos;t removed.
            </p>
            <div className="space-y-3 mb-6">
              {[
                { icon: Shield, text: '100% money-back guarantee' },
                { icon: DollarSign, text: 'Pay only for successful removals' },
                { icon: Clock, text: 'Most removals in 1-4 weeks' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                  <span className="text-sm text-secondary-200">{item.text}</span>
                </div>
              ))}
            </div>
            <p className="text-2xl font-bold mb-4">${removalPrice}<span className="text-base font-normal text-secondary-400"> / per review</span></p>
            <Link
              href="/free-assessment"
              className="inline-flex items-center gap-2 text-primary-300 font-semibold hover:text-primary-200 transition-colors"
            >
              Get Free Assessment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
