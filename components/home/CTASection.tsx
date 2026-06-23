import Link from 'next/link';
import { ArrowRight, DollarSign } from 'lucide-react';

interface CTASectionProps {
  removalPrice?: string;
}

export default function CTASection({ removalPrice = '299' }: CTASectionProps) {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-blue-700">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-8">
          <DollarSign className="h-4 w-4" />
          <span>Only ${removalPrice} per review removal — 100% money back guarantee</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Take Control of Your
          <br />
          Online Reputation Today
        </h2>

        <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto">
          Join hundreds of businesses that have protected their reputation with our professional
          review removal service. Start with a free assessment — no commitment required.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/free-assessment"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold text-lg hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Get a Free Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all"
          >
            See Pricing
          </Link>
        </div>

        <p className="mt-8 text-primary-200 text-sm">
          Free assessment available &middot; Results in 1–4 weeks &middot; 100% money back guarantee
        </p>
      </div>
    </section>
  );
}
