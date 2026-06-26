import Link from 'next/link';
import { BellRing } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0A2540] to-[#0074D9] text-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
          <BellRing className="w-4 h-4 text-white/90" />
          <span>Monitor reviews, mentions and sentiment across the web in real time</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Reputation Management Tracking</h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto text-slate-100">
          Centralize review monitoring, sentiment analysis, and alerts so you can respond faster, protect your brand, and amplify positive customer experiences.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold">
            Get Platform Access — $49
          </Link>
          <Link href="/contact" className="px-6 py-3 rounded-xl border border-white/20 text-white">
            Request Fully Managed — $499
          </Link>
        </div>
      </div>
    </section>
  );
}
