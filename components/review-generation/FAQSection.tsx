import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    id: 'rg-faq-1',
    question: 'How does the review generation software work?',
    answer:
      'We automatically send personalized review requests to your customers via SMS or Email after a transaction or appointment. Customers click a direct link to your chosen platform and leave feedback in seconds.',
  },
  {
    id: 'rg-faq-2',
    question: 'Which review platforms do you support?',
    answer:
      'We support 50+ platforms including Google, Yelp, Facebook, Trustpilot, TripAdvisor, and many more. You choose which platforms matter most to your business.',
  },
  {
    id: 'rg-faq-3',
    question: 'How quickly will I see new reviews?',
    answer:
      'Most businesses see their first new reviews within 24–48 hours of sending their first campaign. Volume builds significantly within the first 30 days.',
  },
  {
    id: 'rg-faq-4',
    question: 'Will this get my account flagged or penalized?',
    answer:
      'No. Our approach is fully compliant with all major platform guidelines. We never pay for reviews, never incentivize customers, and never gate negative feedback — practices that violate FTC guidelines and platform terms.',
  },
  {
    id: 'rg-faq-5',
    question: 'Can I customize the review request messages?',
    answer:
      "Yes. You have full control over your message templates. Personalize with the customer's name, your business name, and a direct link to your preferred review platform.",
  },
  {
    id: 'rg-faq-6',
    question: 'Do I need technical skills to set this up?',
    answer:
      'Not at all. Setup takes less than 5 minutes. Import your customer list, pick a template, and hit send. No coding, no IT team required.',
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            Everything you need to know about our review generation software.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-slate-200 dark:border-slate-700 rounded-xl px-6 data-[state=open]:border-primary-300 dark:data-[state=open]:border-primary-700 transition-colors"
            >
              <AccordionTrigger className="text-left text-slate-900 dark:text-white font-medium hover:no-underline hover:text-primary-600 dark:hover:text-primary-400">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Still have questions?{' '}
            <a
              href="mailto:support@reviewmanager.com"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
