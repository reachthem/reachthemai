import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  Star,
  Flag,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ShoppingCart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trustpilot Review Removal Service | Remove Negative Trustpilot Reviews | Reach Them AI',
  description:
    'Remove fake and policy-violating Trustpilot reviews. With 120M+ reviews, Trustpilot is critical for e-commerce trust. Expert navigation of Trustpilot\'s flagging system and content integrity policies.',
  keywords: [
    'Trustpilot review removal',
    'remove Trustpilot reviews',
    'Trustpilot TrustScore',
    'fake Trustpilot reviews',
    'Trustpilot content policy',
    'negative Trustpilot review removal',
    'Trustpilot flagging system',
    'Trustpilot business profile',
  ],
  openGraph: {
    title: 'Trustpilot Review Removal Service | Reach Them AI',
    description:
      'Expert Trustpilot review removal. Protect your TrustScore and e-commerce credibility by removing fake and policy-violating reviews.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Trustpilot Review Removal Service',
  description:
    'Professional service for removing fake and policy-violating Trustpilot reviews to protect your TrustScore and e-commerce reputation.',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  serviceType: 'Online Reputation Management',
  areaServed: 'Worldwide',
};

const violationTypes = [
  {
    icon: XCircle,
    title: 'Fraudulent Reviews',
    description:
      'Reviews posted by individuals who did not have a genuine buying or service experience, including purchased reviews and bot-generated content designed to tank your TrustScore.',
  },
  {
    icon: AlertTriangle,
    title: 'Harmful & Illegal Content',
    description:
      'Reviews containing defamatory statements, discriminatory language, threats, or content that violates applicable laws in the reviewer\'s or business\'s jurisdiction.',
  },
  {
    icon: Flag,
    title: 'Competitor Interference',
    description:
      'Reviews written by direct competitors or their affiliates with the intent to damage your TrustScore and divert customers to competing businesses.',
  },
  {
    icon: ShieldCheck,
    title: 'Personal Information Exposure',
    description:
      'Reviews that disclose personal data such as employee names, private email addresses, phone numbers, or other identifying information without authorization.',
  },
  {
    icon: ShoppingCart,
    title: 'Wrong Company Reviews',
    description:
      'Reviews intended for a different company that were posted on your profile by mistake, which unfairly impact your TrustScore and mislead potential customers.',
  },
  {
    icon: Award,
    title: 'Incentivized Reviews',
    description:
      'Reviews obtained through incentives like discounts, free products, or payment — a clear violation of Trustpilot\'s guidelines that undermines the platform\'s integrity.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'TrustScore Impact Assessment',
    description:
      'We calculate exactly how each negative review impacts your TrustScore and prioritize removals based on the most damaging content that violates Trustpilot\'s policies.',
  },
  {
    step: '02',
    title: 'Flag Through Business Tools',
    description:
      'We use Trustpilot\'s business flagging system to report each violating review, categorizing the infraction and attaching evidence that demonstrates the policy breach.',
  },
  {
    step: '03',
    title: 'Content Integrity Team Engagement',
    description:
      'For complex cases, we engage directly with Trustpilot\'s Content Integrity team, providing detailed documentation including transaction records, IP evidence, and pattern analysis.',
  },
  {
    step: '04',
    title: 'TrustScore Recovery Tracking',
    description:
      'After successful removals, we monitor your TrustScore recovery and advise on strategies to encourage verified customers to leave authentic reviews.',
  },
];

const faqs = [
  {
    question: 'How does Trustpilot\'s TrustScore affect my business?',
    answer:
      'Your TrustScore is a weighted average of all your reviews and is prominently displayed alongside your business name across the internet — in Google search results, Google Ads, and partner integrations. A low TrustScore directly reduces click-through rates on paid advertising and organic search results, increasing your cost per acquisition.',
  },
  {
    question: 'Can Trustpilot verify if a reviewer was actually a customer?',
    answer:
      'Trustpilot distinguishes between "verified" reviews (triggered by an automated invitation through their integration) and "organic" reviews (posted voluntarily). You can flag organic reviews as not from genuine customers and request verification. If the reviewer cannot prove their purchase, Trustpilot may remove the review.',
  },
  {
    question: 'How long does Trustpilot take to investigate flagged reviews?',
    answer:
      'Trustpilot generally processes flagged reviews within 1 to 3 weeks. Cases involving their Content Integrity team may take longer. Reviews flagged as being from non-customers require the reviewer to provide proof of experience within a set deadline — failure to respond can result in removal.',
  },
  {
    question: 'What is Trustpilot\'s transparency policy?',
    answer:
      'Trustpilot publishes a transparency report detailing the number of fake reviews detected and removed. They use automated fraud detection technology alongside human moderators. Businesses that abuse the flagging system by reporting legitimate reviews may face penalties, which is why precision in identifying genuine violations is critical.',
  },
];

export default function TrustpilotReviewsPage() {
  return (
    <>
      <Script
        id="trustpilot-reviews-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-900 platform-page">
        <Navbar background="white" />
        <main>
          {/* Hero */}
          <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm mb-6">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#00B67A' }}
                />
                Trustpilot Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Protect Your TrustScore — Remove Fake Trustpilot Reviews
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                Trustpilot hosts over 120 million reviews and is the dominant
                trust signal for e-commerce businesses worldwide. A declining
                TrustScore means lost conversions, higher ad costs, and eroded
                customer confidence. We fight to restore it.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/free-assessment"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Get a Free Assessment
                </Link>
              </div>
            </div>
          </section>

          {/* Platform Stats */}
          <section className="py-16 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { stat: '120M+', label: 'Reviews hosted on the platform' },
                  { stat: '67%', label: 'Of consumers more likely to buy with a high TrustScore' },
                  { stat: '4M+', label: 'Fake reviews removed annually by Trustpilot' },
                  { stat: '1–3 Weeks', label: 'Typical removal timeline' },
                ].map((item) => (
                  <div key={item.label} className="p-6">
                    <div className="text-3xl font-bold text-primary-600">{item.stat}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Trustpilot Matters */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                Why Your Trustpilot Score Is a Revenue Driver
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  Trustpilot has established itself as the default trust layer for online commerce. Its
                  review widgets appear on tens of thousands of e-commerce websites, in Google Shopping
                  results, and integrated directly into Google Ads through seller ratings extensions. When
                  a potential customer sees your Trustpilot star rating next to a competitor&apos;s in search
                  results, that rating can determine which listing gets the click — and which gets ignored.
                </p>
                <p>
                  The financial impact is measurable. Businesses with a Trustpilot rating above 4.0 stars
                  see up to 35% higher conversion rates compared to those below that threshold. For
                  e-commerce companies spending thousands on paid advertising, the cost difference between
                  a 3.5 and 4.5 TrustScore can translate to tens of thousands in wasted ad spend each month
                  as lower trust scores reduce click-through rates on Google Ads by an average of 17%.
                </p>
                <p>
                  Trustpilot&apos;s influence extends beyond direct consumer search. B2B buyers, wholesale
                  partners, and procurement teams frequently reference Trustpilot scores during vendor
                  evaluation. Enterprise deals worth hundreds of thousands of dollars have been won or lost
                  based on a company&apos;s public review reputation on the platform, making Trustpilot
                  management a strategic business priority far beyond retail consumer sales.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Trustpilot Policy Violations We Target
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Trustpilot takes review integrity seriously and provides clear policies
                  on what constitutes a violation. We leverage these policies to build
                  removal cases with the highest possible success rate.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {violationTypes.map((v) => (
                  <div
                    key={v.title}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    <v.icon className="h-8 w-8 text-primary-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Removal Process */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Our Trustpilot Review Removal Process
              </h2>
              <div className="space-y-8">
                {removalSteps.map((s) => (
                  <div key={s.step} className="flex flex-col gap-3">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-700 dark:text-primary-300">{s.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-green-600 flex-shrink-0" />
                <p className="text-green-800 dark:text-green-300">
                  <strong>Typical timeline:</strong> 1–3 weeks. Trustpilot&apos;s Content Integrity
                  team prioritizes cases with clear evidence of policy violations.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About Trustpilot Review Removal
              </h2>
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="py-16 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
                More Reputation Management Resources
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <Link
                  href="/what-is-online-reputation-management"
                  className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow text-center"
                >
                  <Search className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <span className="font-semibold text-slate-900 dark:text-white">What Is ORM?</span>
                </Link>
                <Link
                  href="/free-assessment"
                  className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow text-center"
                >
                  <CheckCircle2 className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <span className="font-semibold text-slate-900 dark:text-white">Free Assessment</span>
                </Link>
                <Link
                  href="/"
                  className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow text-center"
                >
                  <Star className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <span className="font-semibold text-slate-900 dark:text-white">Reach Them AI Home</span>
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary-600">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Remove Your Negative Trustpilot Reviews
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Your TrustScore is more than a number — it&apos;s a revenue multiplier. Let our
                specialists identify every policy-violating review and fight for its removal so you
                can convert more customers and reduce wasted ad spend.
              </p>
              <Link
                href="/free-assessment"
                className="mt-8 inline-flex items-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Get a Free Assessment
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
