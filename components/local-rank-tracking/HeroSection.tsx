import Link from 'next/link';
import { Shield, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-primary-950 to-slate-900 pt-32 pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary-300" />
            <span>Hyper-local visibility that drives growth</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            See where you rank
          </h1>

          <p className="mx-auto mt-6 text-lg leading-8 text-slate-300">
            Track performance in the Local Pack, Google Maps, organic results, and AI answer engines so you can make smarter local marketing decisions.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-500">
              Book a Demo
            </Link>
            <Link href="#ai-integration" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10">
              Explore the AI Layer
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Built for local businesses</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Sparkles className="h-4 w-4 text-primary-300" />
              <span>Designed to scale with your team</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
