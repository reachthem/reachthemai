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
  Package,
  ShoppingCart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Amazon Review Removal Service | Remove Negative Amazon Reviews | Reach Them AI',
  description:
    'Remove fake and policy-violating Amazon product reviews. With 300M+ active customers and 79% of consumers starting product searches on Amazon, reviews directly control your Buy Box placement and sales velocity.',
  keywords: [
    'Amazon review removal',
    'remove Amazon reviews',
    'Amazon Buy Box',
    'fake Amazon reviews',
    'Amazon community guidelines',
    'negative Amazon review removal',
    'Amazon Brand Registry',
    'Amazon Report Abuse',
  ],
  openGraph: {
    title: 'Amazon Review Removal Service | Reach Them AI',
    description:
      'Expert Amazon review removal. Protect your product listings, Buy Box eligibility, and sales velocity by removing fake and policy-violating reviews.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Amazon Review Removal Service',
  description:
    'Professional service for removing fake and policy-violating Amazon product reviews to protect listings, Buy Box placement, and seller reputation.',
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
    title: 'Competitor Sabotage Reviews',
    description:
      'Negative reviews orchestrated by competing sellers to damage your product ranking, suppress your Buy Box eligibility, and divert sales to their listings — a widespread tactic in competitive Amazon categories.',
  },
  {
    icon: AlertTriangle,
    title: 'Unverified Purchase Reviews',
    description:
      'One-star reviews from accounts that never purchased your product, often posted as part of black-hat seller strategies or by individuals reviewing a completely different product variation.',
  },
  {
    icon: Flag,
    title: 'Shipping & Fulfillment Complaints',
    description:
      'Reviews that blame the seller for Amazon FBA shipping delays, damaged packaging by carriers, or fulfillment errors that are entirely Amazon\'s responsibility — not a product quality issue.',
  },
  {
    icon: ShieldCheck,
    title: 'Incentivized Negative Reviews',
    description:
      'Reviews solicited and paid for by competitors through underground review services, review farms, or social media groups that coordinate attacks against specific product listings.',
  },
  {
    icon: Package,
    title: 'Wrong Product Reviews',
    description:
      'Reviews describing a completely different product that were posted on your listing by mistake — particularly common with products that have multiple variations, colors, or sizes.',
  },
  {
    icon: ShoppingCart,
    title: 'Promotional & Spam Content',
    description:
      'Reviews that primarily promote competing products, include affiliate links, or consist of copied content from other listings rather than providing a genuine customer assessment.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'Listing & Review Audit',
    description:
      'We analyze every review on your product listings, cross-referencing reviewer profiles, purchase verification status, and review patterns to identify policy violations and coordinated attacks.',
  },
  {
    step: '02',
    title: 'Report Abuse Submissions',
    description:
      'We submit detailed Report Abuse requests for each violating review through Amazon\'s dedicated reporting system, specifying the exact Community Guideline breached with supporting evidence.',
  },
  {
    step: '03',
    title: 'Brand Registry & Seller Support Escalation',
    description:
      'For Brand Registry members, we leverage enhanced brand protection tools. For all sellers, we escalate through Seller Support with comprehensive evidence packages demonstrating review manipulation.',
  },
  {
    step: '04',
    title: 'Listing Health Monitoring',
    description:
      'After successful removals, we monitor your listing health metrics — star rating recovery, Best Seller Rank impact, and Buy Box eligibility — ensuring sustained improvements.',
  },
];

const faqs = [
  {
    question: 'How do Amazon reviews affect Buy Box placement?',
    answer:
      'Amazon\'s Buy Box algorithm considers multiple factors, and product reviews are among the most influential. Products with consistently high ratings and recent positive reviews receive preferential Buy Box placement. Since approximately 82% of Amazon sales go through the Buy Box, a drop in review quality can directly translate to a proportional drop in revenue — even if your pricing and fulfillment metrics remain strong.',
  },
  {
    question: 'What is Amazon Brand Registry and how does it help with review removal?',
    answer:
      'Amazon Brand Registry provides registered brand owners with enhanced tools for protecting their listings, including advanced review monitoring, IP violation reporting, and dedicated support channels. Brand Registry members have access to the Report a Violation tool that processes review abuse claims more efficiently than standard seller channels.',
  },
  {
    question: 'Can Amazon detect coordinated review attacks?',
    answer:
      'Amazon invests heavily in machine learning systems to detect review manipulation, removing millions of fake reviews annually. However, sophisticated attacks using established reviewer accounts, varied IP addresses, and staggered timing can evade automated detection. Our analysis helps identify patterns that Amazon\'s automated systems may miss, allowing us to provide targeted evidence for manual review.',
  },
  {
    question: 'How long does Amazon take to process review removal requests?',
    answer:
      'Amazon typically processes review removal requests within 1 to 4 weeks. Reports submitted through Brand Registry tools often receive faster responses. Complex cases involving coordinated attack evidence may be escalated to Amazon\'s Investigation team, which can take additional time but results in more thorough enforcement action.',
  },
];

export default function AmazonReviewsPage() {
  return (
    <>
      <Script
        id="amazon-reviews-jsonld"
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
                  style={{ backgroundColor: '#FF9900' }}
                />
                Amazon Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Protect Your Amazon Listings — Remove Fake Product Reviews
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                Amazon serves over 300 million active customers, and 79% of
                consumers start their product searches on the platform. Your
                product reviews control your Buy Box placement, search ranking,
                and conversion rate. We protect your listings from malicious
                review attacks.
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
                  { stat: '300M+', label: 'Active customer accounts worldwide' },
                  { stat: '79%', label: 'Of consumers start product searches on Amazon' },
                  { stat: '82%', label: 'Of Amazon sales go through the Buy Box' },
                  { stat: '1–4 Weeks', label: 'Typical removal timeline' },
                ].map((item) => (
                  <div key={item.label} className="p-6">
                    <div className="text-3xl font-bold text-primary-600">{item.stat}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Amazon Reviews Matter */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                Why Amazon Reviews Are Your Most Valuable Sales Asset
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  On Amazon, reviews are not just social proof — they are the algorithm. Amazon&apos;s A9
                  search algorithm heavily weights product review quality, quantity, and recency when
                  determining organic search placement. A product with a 4.5-star average and 500 reviews
                  will dramatically outrank a similar product with 4.0 stars and 200 reviews, even if the
                  lower-rated product has superior pricing or features. This makes your review profile the
                  single most important factor in your Amazon sales velocity.
                </p>
                <p>
                  The financial impact of Amazon reviews is staggering. Research from Profitero shows that
                  products moving from a 3-star to a 4-star average see sales increases of 24% or more.
                  For private label sellers and brand owners, this can represent hundreds of thousands of
                  dollars in annual revenue difference. Conversely, a coordinated negative review attack
                  can crash a product&apos;s Best Seller Rank within days, creating a downward spiral where
                  reduced visibility leads to fewer sales, which further reduces ranking — a cycle that
                  can be extraordinarily difficult to reverse.
                </p>
                <p>
                  Amazon&apos;s Buy Box adds another critical dimension. The Buy Box — which captures
                  approximately 82% of all Amazon sales — considers seller feedback and product reviews
                  in its eligibility algorithm. Sellers with products suffering from poor review profiles
                  risk losing Buy Box placement entirely, effectively rendering their products invisible
                  to the vast majority of Amazon shoppers who purchase through the default &ldquo;Add to
                  Cart&rdquo; button. For marketplace sellers competing against multiple offers on the
                  same listing, review quality can be the tiebreaker that determines Buy Box ownership.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Amazon Review Policy Violations We Target
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Amazon&apos;s Community Guidelines provide specific protections against review
                  manipulation. We leverage these policies to protect your product listings.
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
                Our Amazon Review Removal Process
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
              <div className="mt-12 flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600 flex-shrink-0" />
                <p className="text-orange-800 dark:text-orange-300">
                  <strong>Typical timeline:</strong> 1–4 weeks. Brand Registry members often see
                  faster processing through enhanced brand protection channels.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About Amazon Review Removal
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
                E-Commerce Reputation Resources
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
                Remove Your Negative Amazon Reviews
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Your Amazon reviews control your visibility, Buy Box placement, and conversion
                rate. Let our e-commerce specialists identify every removable review and restore
                your product listings to peak performance.
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
