'use client';

import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-20 max-md:pt-12 pb-24 max-md:pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-800/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="flex flex-col gap-y-2 max-md:gap-y-1 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-md:text-3xl max-md:leading-snug text-center">
            <span className="text-white">All Your Business Growth</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-300 leading-snug">& Digital Marketing Solutions</span>
            <span className="text-white">in One Platform - Powered by AI</span>
          </h1>

          <p className="mt-6 text-xl leading-relaxed max-md:text-base text-slate-300 max-w-3xl mx-auto">
            We combine everything businesses need to grow online in a single, powerful, AI driven platform. We offer both Self Serve Software and fully managed services that cover every aspect of your online presence and growth.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/40 hover:-translate-y-0.5 max-md:w-full"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/free-assessment"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary-500/80 bg-primary-900/30 text-white font-semibold text-lg hover:bg-primary-800/50 hover:border-primary-400 transition-all max-md:w-full"
            >
              Free Business Scan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
