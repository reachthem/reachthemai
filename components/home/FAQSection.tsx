import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQSectionProps {
  removalPrice?: string;
}

function buildFaqs(removalPrice: string) {
  return [
  {
    id: 'faq-1',
    question: 'How do you remove negative reviews?',
    answer:
      'For each review our expert team performs deep research into the specific review and the best method for getting it taken down through legal and regulatory means. We submit formal removal applications directly to the review platform (Google, Yelp, Facebook, or Trustpilot), demonstrating that the review violates their content policies. This is a completely legitimate process — we identify the exact policy violation, build a documented case, and file a removal request through official channels. We do not use incentives or manipulation.',
  },
  {
    id: 'faq-2',
    question: 'How much does it cost?',
    answer:
      `$${removalPrice} per review removal. We do require an upfront fee, but we back every engagement with a 100% money back guarantee — if we cannot remove the review, you receive a full refund. Our model aligns our success with yours.`,
  },
  {
    id: 'faq-3',
    question: 'How long does it take?',
    answer:
      'Most removals complete within 1–4 weeks, depending on the platform and the nature of the review. Some straightforward violations resolve in 24–48 hours. We keep you updated throughout the process and you can track status in your dashboard.',
  },
  {
    id: 'faq-4',
    question: 'Is it legal to remove reviews?',
    answer:
      'Yes. We follow entirely legitimate processes in accordance with each platform\'s content policies and terms of service. We never use incentives, threaten reviewers, or employ any manipulative tactics. We simply demonstrate to the platform that a review violates their own guidelines — the same way you could report a review yourself, but with expert knowledge and a higher success rate.',
  },
  {
    id: 'faq-5',
    question: 'What types of reviews can be removed?',
    answer:
      'We can remove fake reviews, spam, competitor sabotage, reviews with personal attacks or offensive content, reviews that violate platform policies, reviews posted by non-customers, and reviews that contain false or defamatory statements. If a review is a genuine, authentic customer experience — even an unfavorable one — we will let you know it cannot be removed.',
  },
  {
    id: 'faq-6',
    question: 'What if the removal is unsuccessful?',
    answer:
      'You receive a full refund. We offer a 100% money back guarantee on every removal engagement. If we cannot get the review removed, your payment is returned in full. We\'ll also explain why the removal was unsuccessful and recommend alternative strategies.',
  },
  {
    id: 'faq-7',
    question: 'What platforms do you support?',
    answer:
      'We support Google My Business, Yelp, Facebook, Trustpilot, TripAdvisor, BBB, Glassdoor, Amazon, and many more. These cover the vast majority of consumer review activity. We are continually expanding platform support — contact us if you need removal from a platform not listed.',
  },
  {
    id: 'faq-8',
    question: 'What is included in the free review audit?',
    answer:
      'Our free audit includes a comprehensive analysis of all your reviews across major platforms. Our AI scans each negative review for policy violations, assigns a removal probability score, and provides a detailed report with our recommended strategy, estimated timeline, and expected outcomes — all at no cost and no obligation.',
  },
  {
    id: 'faq-9',
    question: 'Why do you charge an upfront fee?',
    answer:
      'The upfront fee covers the extensive research, AI analysis, legal review, and formal submission work required for each removal case. Unlike companies that charge monthly retainers with no guarantees, we back every engagement with a 100% money back guarantee. If we don\'t remove the review, you get your full payment back.',
  },
  {
    id: 'faq-10',
    question: 'How does your AI technology improve removal success?',
    answer:
      'Our AI analyzes reviews against comprehensive databases of platform policies, legal precedents, and enforcement patterns. It identifies the most effective removal grounds, drafts evidence-backed arguments, and scores removal probability before we submit. This systematic approach consistently achieves a 92% success rate — far above the industry average.',
  },
  {
    id: 'faq-11',
    question: 'Can you remove reviews for businesses in any industry?',
    answer:
      'Yes. We serve businesses across every industry including restaurants, healthcare, legal services, home services, automotive, real estate, retail, financial services, hotels, education, and more. Each industry has unique review challenges and platform dynamics — our team has specialized expertise across all verticals.',
  },
  {
    id: 'faq-12',
    question: 'Do you offer bulk or enterprise pricing?',
    answer:
      'Yes. Businesses with multiple locations or a high volume of reviews to remove can request custom enterprise pricing. Contact our team for a tailored quote that fits your specific needs and budget.',
  },
];
}

export default function FAQSection({ removalPrice = '299' }: FAQSectionProps) {
  const faqs = buildFaqs(removalPrice);
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
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-md:text-[1.75rem]">
            Everything you need to know about our review removal service.
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
            <a href="mailto:support@reviewmanager.com" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
