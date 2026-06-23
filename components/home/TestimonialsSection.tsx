"use client";

import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote:
      "A competitor left us 3 fake 1-star reviews over a weekend. Reach Them AI got all three removed within 10 days. Our rating went from 3.8 back to 4.7 stars.",
    name: 'Maria Santos',
    business: 'Santos Family Restaurant, Miami',
    industry: 'Restaurant',
    before: '3.8',
    after: '4.7',
  },
  {
    quote:
      "We had a vindictive ex-employee leave a flood of fake reviews. The team identified every single violation and had them removed. Completely professional process.",
    name: 'Dr. James Okafor',
    business: 'Okafor Family Dentistry',
    industry: 'Healthcare',
    before: '4.1',
    after: '5.0',
  },
  {
    quote:
      "I was skeptical about whether reviews could actually be removed. But they handled everything — submitted the case, followed up with Google, and the reviews are gone.",
    name: 'Tom Kirchner',
    business: 'Kirchner Plumbing & HVAC',
    industry: 'Home Services',
    before: '4.2',
    after: '4.8',
  },
  {
    quote:
      "The AI response tool alone saves my team hours every week. Combined with the monitoring alerts, we never miss a review and always respond professionally.",
    name: 'Sarah Chen',
    business: 'Chen & Associates Law Group',
    industry: 'Legal Services',
    before: '3.9',
    after: '4.6',
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const testimonial = testimonials[current];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Overall rating badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-col items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-8 py-5 shadow-sm">
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">5.0</div>
            <StarRating />
            <p className="text-sm text-slate-500 dark:text-slate-400">Based on 200+ verified reviews</p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white max-md:text-[1.5rem]">
            Trusted by Businesses Like Yours
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            Real results from real business owners across every industry.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 shadow-lg min-h-[280px] flex flex-col justify-between">
            <div>
              <StarRating />
              <blockquote className="mt-6 text-xl text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-md:text-[0.6rem]">{testimonial.business}</p>
              </div>

              {/* Before/After */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-4 py-2">
                <div className="text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Before</p>
                  <p className="text-lg font-bold text-red-500">★ {testimonial.before}</p>
                </div>
                <div className="text-slate-300 dark:text-slate-600">→</div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500">After</p>
                  <p className="text-lg font-bold text-green-500">★ {testimonial.after}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? 'w-6 bg-primary-600'
                      : 'w-2 bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
