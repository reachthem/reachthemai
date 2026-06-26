import Link from 'next/link';
import { Shield, Sparkles, PhoneCall } from 'lucide-react';

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
            <PhoneCall className="h-4 w-4 text-primary-300" />
            <span>Always-on call handling for modern service businesses</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI Phone Agents That
            <span className="mt-3 block bg-gradient-to-r from-primary-300 to-blue-300 bg-clip-text text-transparent">
              Answer Every Call
            </span>
          </h1>

          <p className="mx-auto mt-6 text-lg leading-8 text-slate-300">
            Give every caller a fast, polished experience with an AI receptionist that can greet visitors, qualify leads, book appointments, and hand off complex issues to a real person when needed.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-500"
            >
              Book a Demo
            </Link>
            <Link
              href="#ai-integration"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              See What It Can Do
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span>24/7 availability</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Sparkles className="h-4 w-4 text-primary-300" />
              <span>Natural, human-sounding conversations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
