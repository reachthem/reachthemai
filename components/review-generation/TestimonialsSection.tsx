import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'We went from 12 Google reviews to over 90 in just two months. New patients tell us all the time that our reviews were what made them choose us over a competitor.',
    name: 'Sarah M.',
    role: 'Owner, Riverside Dental',
  },
  {
    quote:
      'The automated follow-up feature is a game-changer. We send requests after every service appointment and our response rate is incredible. Our Google rating jumped from 3.9 to 4.6.',
    name: 'James T.',
    role: 'General Manager, Peak Auto Group',
  },
  {
    quote:
      'Managing reviews across 8 locations used to be a nightmare. Now everything is automated and centralized. TripAdvisor ranking went up by 14 positions across our portfolio.',
    name: 'Linda K.',
    role: 'Director of Marketing, Horizon Hotels',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Trusted by Businesses Like Yours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 hover:shadow-lg transition-shadow"
            >
              <Quote className="h-8 w-8 text-primary-400 mb-4" />
              <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
