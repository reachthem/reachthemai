'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
  advisorPrice?: string;
  removalPrice?: string;
}

function buildFaqs(advisorPrice: string, removalPrice: string) {
  return [
  {
    question: 'What is The Machine and how does it work?',
    answer:
      'The Machine is our automated Google Review scanning pipeline. It pulls every review for your business, runs AI-powered policy classification on each one, assigns a confidence score, and generates a threat report with actionable removal strategies.',
  },
  {
    question: 'How many reviews can The Machine scan?',
    answer:
      'There is no practical limit. The Machine can scan businesses with thousands of reviews regardless of how many there are.',
  },
  {
    question: 'What policy categories does the AI check for?',
    answer:
      'We check for 8 violation categories: Spam & Fake Reviews, Off-Topic Content, Restricted Content, Illegal Activity, Sexually Explicit Content, Conflict of Interest, Impersonation, and Harassment & Threats. These align directly with Google\'s Maps User Contributed Content Policy.',
  },
  {
    question: 'Will legitimate negative reviews be flagged?',
    answer:
      'No. Our AI is calibrated to be conservative. A negative review — even a 1-star review — is legitimate if it reflects a real customer experience. Only reviews that genuinely violate Google\'s content policies are flagged.',
  },
  {
    question: 'What happens after a review is flagged?',
    answer:
      `Each flagged review shows the violation type, confidence score, policy citation, and a recommended removal strategy. You can use our AI Removal Advisor ($${advisorPrice}/month) for DIY guidance, or submit the review to our professional removal team ($${removalPrice} per review with a 100% money-back guarantee).`,
  },
  {
    question: 'How long does a scan take?',
    answer:
      'Most scans complete in 1–3 minutes. The exact time depends on how many reviews your business has. Businesses with 500+ reviews may take slightly longer.',
  },
  {
    question: 'Can The Machine monitor for new reviews?',
    answer:
      'Yes. You can set up continuous monitoring that automatically re-scans your business on a daily schedule. If a new policy-violating review is detected, you\'ll be notified immediately.',
  },
  {
    question: 'Is this service available for platforms other than Google?',
    answer:
      'Currently, The Machine supports Google reviews. Support for Yelp, Facebook, Trustpilot, and other platforms is on our roadmap.',
  },
];
}

export default function FAQSection({ advisorPrice = '49', removalPrice = '299' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const FAQS = useMemo(() => buildFaqs(advisorPrice, removalPrice), [advisorPrice, removalPrice]);

  return (
    <section id="faq" className="py-24 bg-secondary-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-primary-600 uppercase tracking-widest font-medium mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-secondary-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-secondary-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-secondary-400 flex-shrink-0 transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-4">
                  <p className="text-secondary-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
