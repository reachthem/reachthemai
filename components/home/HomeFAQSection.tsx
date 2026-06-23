import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HomeFAQSectionProps {
  advisorPrice?: string;
  removalPrice?: string;
}

function buildFaqs(advisorPrice: string, removalPrice: string) {
  return [
  {
    id: 'faq-1',
    question: 'What is the difference between the AI Advisor and Full Service Removal?',
    answer:
      `The AI Advisor ($${advisorPrice}/mo) is a self-service tool that analyzes your reviews and gives you step-by-step instructions to remove them yourself. Full Service Removal ($${removalPrice}/removal) is a "done-for-you" service where our experts handle the entire dispute and removal process for you.`,
  },
  {
    id: 'faq-2',
    question: 'How does the AI Advisor work?',
    answer:
      'You paste the review text into our tool. Our AI analyzes it against platform policies (Google, Yelp, etc.) to find violations. It then generates a custom report with the exact language you need to use when flagging the review, significantly increasing your chances of removal.',
  },
  {
    id: 'faq-3',
    question: 'Is the Full Service Removal guaranteed?',
    answer:
      'Yes. Our Full Service Removal comes with a 100% money-back guarantee. If we cannot get the review removed, you do not pay (or are refunded in full). The AI Advisor is a monthly subscription tool and does not offer a removal guarantee, but provides the best possible guidance.',
  },
  {
    id: 'faq-4',
    question: 'Is it legal to remove reviews?',
    answer:
      'Yes. We strictly follow platform content policies and terms of service. We do not use bots, fake reports, or "black hat" tactics. We simply identify legitimate policy violations (like hate speech, conflict of interest, or spam) and report them through the proper channels.',
  },
  {
    id: 'faq-5',
    question: 'Which platforms do you support?',
    answer:
      'We support removal for Google, Yelp, Facebook, Trustpilot, TripAdvisor, and BBB. Our AI Advisor works for these platforms plus many others by analyzing general policy violations common across the web.',
  },
  {
    id: 'faq-6',
    question: 'Can I upgrade from AI Advisor to Full Service?',
    answer:
      'Absolutely. If you try the AI Advisor and decide you would rather have us handle it, you can easily request a Full Service removal for any specific review directly from your dashboard.',
  },
];
}

export default function HomeFAQSection({ advisorPrice = '19', removalPrice = '299' }: HomeFAQSectionProps) {
  const faqs = buildFaqs(advisorPrice, removalPrice);
  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            Common questions about our services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-slate-200 dark:border-slate-700 rounded-xl px-6 data-[state=open]:border-primary-300 dark:data-[state=open]:border-primary-700 transition-colors bg-slate-50 dark:bg-slate-800/50"
            >
              <AccordionTrigger className="text-left text-slate-900 dark:text-white font-medium hover:no-underline hover:text-primary-600 dark:hover:text-primary-400 py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
