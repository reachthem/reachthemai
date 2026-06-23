import Link from 'next/link';
import { ArrowRight, Radar } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#182825] via-primary-900 to-[#182825] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
          <Radar className="h-8 w-8 text-primary-300" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Ready to Scan Your Reviews?
        </h2>
        <p className="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto">
          Find out how many of your Google reviews violate platform policies.
          Start your free scan today and take control of your online reputation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5 text-lg"
          >
            Start Free Scan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/free-assessment"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-lg"
          >
            Get Free Assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
