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
  TrendingDown,
  Eye,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Yelp Review Removal Service | Remove Negative Yelp Reviews | Reach Them AI',
  description:
    'Remove fake and policy-violating Yelp reviews. With 178M monthly visitors, Yelp reviews directly impact restaurants and local service businesses. Expert navigation of Yelp\'s unique recommendation algorithm.',
  keywords: [
    'Yelp review removal',
    'remove Yelp reviews',
    'Yelp recommendation algorithm',
    'fake Yelp reviews',
    'Yelp content policy',
    'Yelp not recommended reviews',
    'negative Yelp review removal',
    'Yelp business page',
  ],
  openGraph: {
    title: 'Yelp Review Removal Service | Reach Them AI',
    description:
      'Expert Yelp review removal. Navigate Yelp\'s complex recommendation algorithm and content policies to remove harmful reviews.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Yelp Review Removal Service',
  description:
    'Professional service for removing fake and policy-violating Yelp reviews, including navigation of Yelp\'s recommendation algorithm.',
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
    title: 'Compensated Reviews',
    description:
      'Yelp strictly prohibits incentivized reviews — including those offered in exchange for discounts, freebies, or other benefits. These violate Yelp\'s Terms of Service and can be flagged for removal.',
  },
  {
    icon: AlertTriangle,
    title: 'Irrelevant Content',
    description:
      'Reviews that focus on a business\'s political affiliations, social media posts, or other matters unrelated to the actual product or service experience.',
  },
  {
    icon: Flag,
    title: 'Threats & Harassment',
    description:
      'Content containing personal threats, bullying, hate speech, or graphic descriptions intended to intimidate business owners or staff members.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy Violations',
    description:
      'Reviews that disclose private information such as full names of employees, home addresses, phone numbers, or medical information without consent.',
  },
  {
    icon: Eye,
    title: 'Promotional Content',
    description:
      'Reviews that exist primarily to promote another business, website, or service rather than provide a genuine assessment of the customer experience.',
  },
  {
    icon: TrendingDown,
    title: 'Competitor Sabotage',
    description:
      'Coordinated campaigns by competitors who post or solicit negative reviews to undermine your rating and drive customers to their own business.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'Algorithm & Content Audit',
    description:
      'We analyze both your "Recommended" and "Not Recommended" reviews, identifying which ones violate Yelp\'s Content Guidelines and which have been incorrectly filtered by the algorithm.',
  },
  {
    step: '02',
    title: 'Report via Yelp for Business',
    description:
      'We submit detailed reports through Yelp\'s business owner tools, specifying the exact guideline violation and attaching any supporting evidence.',
  },
  {
    step: '03',
    title: 'Yelp Support Escalation',
    description:
      'When standard reports are insufficient, we escalate to Yelp\'s content moderation team with comprehensive evidence packages and legal documentation when applicable.',
  },
  {
    step: '04',
    title: 'Ongoing Algorithm Monitoring',
    description:
      'Yelp\'s algorithm constantly reclassifies reviews. We monitor your listing to catch newly surfaced negative reviews and act quickly when previously removed content reappears.',
  },
];

const faqs = [
  {
    question: 'What is Yelp\'s "Not Recommended" filter and how does it work?',
    answer:
      'Yelp uses a proprietary recommendation algorithm that automatically filters reviews it considers less trustworthy into a hidden "Not Recommended" section. Factors include reviewer activity level, account age, and perceived authenticity. Unfortunately, this algorithm sometimes suppresses legitimate positive reviews while leaving fake negative ones visible.',
  },
  {
    question: 'Can Yelp directly delete reviews on request?',
    answer:
      'Yelp does not offer a direct deletion mechanism for business owners. Reviews can only be removed by Yelp\'s moderation team after a content guideline violation is confirmed. This makes it essential to build a strong, evidence-backed case rather than simply requesting removal.',
  },
  {
    question: 'Why do my positive reviews keep disappearing on Yelp?',
    answer:
      'Yelp\'s recommendation algorithm filters reviews from accounts with limited activity, new accounts, or those it flags as potentially solicited. This disproportionately affects positive reviews from casual users who only post when they have a great experience.',
  },
  {
    question: 'How long does Yelp take to review a flagged post?',
    answer:
      'Yelp typically takes 2 to 4 weeks to investigate flagged content. Complex cases involving legal claims or coordinated attacks may take longer. We track every submission and escalate proactively when response times exceed expected windows.',
  },
];

export default function YelpReviewsPage() {
  return (
    <>
      <Script
        id="yelp-reviews-jsonld"
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
                  style={{ backgroundColor: '#D32323' }}
                />
                Yelp Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Navigate Yelp&apos;s Algorithm &amp; Remove Unfair Reviews
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                Yelp draws 178 million monthly visitors and remains the go-to
                platform for restaurants, home services, and local businesses.
                Its unique recommendation algorithm creates challenges no other
                platform presents — we know how to overcome them.
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
                  { stat: '178M', label: 'Monthly unique visitors' },
                  { stat: '244M+', label: 'Cumulative reviews on the platform' },
                  { stat: '97%', label: 'Of users make a purchase after visiting Yelp' },
                  { stat: '2–4 Weeks', label: 'Typical removal timeline' },
                ].map((item) => (
                  <div key={item.label} className="p-6">
                    <div className="text-3xl font-bold text-primary-600">{item.stat}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Yelp Matters */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                Why Yelp Reviews Present Unique Challenges
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  Unlike any other review platform, Yelp employs an automated recommendation algorithm
                  that independently decides which reviews are shown prominently and which are relegated
                  to a hidden &ldquo;Not Recommended&rdquo; section. This algorithm considers factors
                  like the reviewer&apos;s account history, connections to other users, and perceived
                  review patterns — but its decisions are opaque and cannot be manually overridden by
                  business owners or even Yelp&apos;s own staff.
                </p>
                <p>
                  For restaurants, the stakes are exceptionally high. Harvard Business School research
                  found that a one-star increase in Yelp rating leads to a 5–9% increase in revenue.
                  Conversely, a sudden drop caused by fake or malicious reviews can devastate a
                  restaurant&apos;s bottom line during its most critical periods. Yelp is the number one
                  source of restaurant reviews in the United States, making it impossible for food
                  service businesses to ignore.
                </p>
                <p>
                  Beyond restaurants, service-based businesses like plumbers, electricians, dentists, and
                  auto repair shops depend heavily on Yelp for lead generation. Yelp&apos;s strong domain
                  authority means its listings frequently outrank even a business&apos;s own website in
                  search results, giving Yelp reviews outsized influence on consumer decisions regardless
                  of your SEO efforts.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Yelp Content Violations We Target for Removal
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Yelp&apos;s Content Guidelines cover a range of prohibited behaviors.
                  Our team identifies actionable violations and builds evidence-based removal cases.
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
                Our Yelp Review Removal Process
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
              <div className="mt-12 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-red-600 flex-shrink-0" />
                <p className="text-red-800 dark:text-red-300">
                  <strong>Typical timeline:</strong> 2–4 weeks. Yelp&apos;s moderation process
                  is slower than most platforms due to their algorithm-first approach to content filtering.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About Yelp Review Removal
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
                Explore More Resources
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
                Remove Your Negative Yelp Reviews
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Yelp&apos;s algorithm doesn&apos;t have to control your reputation. Let our experts
                analyze your Yelp profile and identify every review eligible for removal — at no cost.
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
