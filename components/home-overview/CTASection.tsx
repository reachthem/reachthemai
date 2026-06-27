'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import AuthAwareLinkButton from '@/components/shared/AuthAwareLinkButton';

export default function CTASection() {
  return (
    <section className="py-24 max-md:py-16 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-md:text-2xl">
            Ready to Transform Your Reputation?
          </h2>

          <p className="text-xl text-slate-300 mb-8 max-md:text-base">
            Start with a free review scan to see how many of your negative reviews can be removed, then choose the right combination of services for your business.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex items-start gap-4 bg-primary-900/30 rounded-xl p-6 border border-primary-500/20">
              <CheckCircle2 className="h-6 w-6 text-primary-400 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">No Credit Card Required</h3>
                <p className="text-sm text-slate-400">Start your free scan today</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-primary-900/30 rounded-xl p-6 border border-primary-500/20">
              <CheckCircle2 className="h-6 w-6 text-primary-400 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Expert Support</h3>
                <p className="text-sm text-slate-400">Get personalized recommendations</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthAwareLinkButton
              authenticatedHref="/app/scanner"
              unauthenticatedHref="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/40 hover:-translate-y-0.5 max-md:w-full"
            >
              Free Review Scan
              <ArrowRight className="h-5 w-5" />
            </AuthAwareLinkButton>
            <Link
              href="/#services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary-500/80 bg-primary-900/30 text-white font-semibold text-lg hover:bg-primary-800/50 hover:border-primary-400 transition-all max-md:w-full"
            >
              Browse All Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
