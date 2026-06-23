import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const trustSignals = [
  'No credit card required',
  'Free to get started',
  'Cancel anytime',
];

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Ready to Start Generating Reviews?
        </h2>

        <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto">
          Join hundreds of businesses building trust and attracting new customers with automated
          review generation. Setup takes less than 5 minutes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-300">
          {trustSignals.map((signal) => (
            <div key={signal} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span>{signal}</span>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold text-lg hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Start Generating Reviews Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/#pricing"
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            See Pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
