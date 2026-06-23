'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const questions = [
  {
    question: 'Can you really remove Google reviews?',
    answer: 'Yes. Google has specific content policies that prohibit fake reviews, spam, off-topic content, conflicts of interest, and other violations. When a review violates these policies, Google will remove it upon receiving a properly documented removal request. Our AI analyzes each review against Google\'s full policy library and builds the strongest possible case — which is why our success rate for Google review removals is over 90%.',
  },
  {
    question: 'How long does it take to remove a negative review?',
    answer: 'Most reviews are removed within 1–4 weeks, though timelines vary by platform. Google removals typically resolve in 1–3 weeks, Yelp takes 2–4 weeks due to their recommendation algorithm, Facebook is often the fastest at 1–2 weeks, and TripAdvisor averages 2–4 weeks. Some clear-cut policy violations can be resolved in as little as 24–48 hours.',
  },
  {
    question: 'Is it legal to pay someone to remove reviews?',
    answer: 'Yes, it is completely legal to hire a reputation management company to request the removal of reviews that violate a platform\'s terms of service. This is analogous to hiring a lawyer to dispute an inaccurate credit report. We never engage in bribery, threats, or manipulation — we simply identify policy violations and file formal removal requests through each platform\'s official channels.',
  },
  {
    question: 'How much does online reputation management cost?',
    answer: 'At Reach Them AI, review removal is $299 per successfully removed review with a 100% money back guarantee. Our AI Review Advisor self-service tool is $19/month. Enterprise and multi-location businesses can request custom pricing. Unlike many competitors, we charge a flat rate per removal rather than expensive monthly retainers.',
  },
  {
    question: 'What happens if a review can\'t be removed?',
    answer: 'If we determine that a review cannot be removed — typically because it reflects a genuine customer experience and doesn\'t violate any platform policy — we will let you know upfront during the free assessment. If we accept the case but are ultimately unsuccessful, you receive a 100% money back guarantee. We also recommend alternative strategies like professional response and review solicitation.',
  },
  {
    question: 'Can business owners remove Yelp reviews?',
    answer: 'Business owners can flag Yelp reviews for policy violations, but Yelp is notoriously difficult to work with. Their recommendation algorithm automatically filters some reviews, and their content moderation team applies strict standards. Our team has deep expertise in Yelp\'s specific policies and knows exactly how to frame removal requests for the highest chance of success.',
  },
  {
    question: 'How do fake reviews affect my business?',
    answer: 'Fake reviews can devastate a business. Research from Harvard Business School shows that a one-star decrease in Yelp rating leads to a 5–9% decrease in revenue. Fake negative reviews erode consumer trust, lower your search rankings, reduce click-through rates, and give competitors an unfair advantage. The longer fake reviews remain visible, the more damage they cause.',
  },
  {
    question: 'What is the difference between review removal and suppression?',
    answer: 'Review removal means the review is permanently deleted from the platform — it no longer exists. Suppression means pushing negative content lower in search results through SEO and positive content strategies, but the original review remains online. Reach Them AI focuses primarily on permanent removal, which is the most effective and lasting solution.',
  },
  {
    question: 'Do removed reviews come back?',
    answer: 'In the vast majority of cases, once a review is removed by the platform, it stays removed permanently. However, a determined reviewer could theoretically post a new review. We monitor for this and can address repeat violations quickly. Our platform also includes ongoing review monitoring tools to alert you to any new negative reviews the moment they appear.',
  },
  {
    question: 'How do I know if a review violates platform policies?',
    answer: 'Each platform has detailed content policies covering fake reviews, spam, conflicts of interest, harassment, off-topic content, and more. Our free assessment analyzes your reviews against these policies and identifies which ones have valid grounds for removal. You can also use our AI Review Advisor tool ($19/month) for instant AI-powered policy violation analysis on any review.',
  },
];

export default function PeopleAlsoAskSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
            People Also Ask
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Common Questions About Review Removal
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            Get answers to the most common questions businesses ask about online reputation management.
          </p>
        </div>

        <div className="space-y-3">
          {questions.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden transition-colors hover:border-primary-300 dark:hover:border-primary-600"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-slate-900 dark:text-white pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
