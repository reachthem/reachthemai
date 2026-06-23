import Link from 'next/link';
import { Shield, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-800/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/90">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span>Trusted by 500+ businesses across Google, Yelp &amp; Facebook</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Get More 5-Star Reviews
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-300 mt-2">
              On Autopilot
            </span>
          </h1>

          <p className="mt-6 text-[1.1rem] leading-[1.5rem] max-md:text-[1rem] text-slate-300 max-w-3xl mx-auto">
            Turn every happy customer into a published review. Our review generation software
            automatically sends personalized requests — so your star ratings grow while you
            focus on running your business.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-400" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Works on 50+ platforms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Results in days</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-600/40 hover:-translate-y-0.5"
            >
              Start Generating Reviews
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              See How It Works
            </Link>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm uppercase tracking-widest font-medium mb-6">
            We generate reviews on
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Google', 'Yelp', 'Facebook', 'Trustpilot', 'TripAdvisor'].map((platform) => (
              <span
                key={platform}
                className="text-slate-400 font-semibold text-lg hover:text-white transition-colors"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
