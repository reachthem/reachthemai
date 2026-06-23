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
  Scale,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'BBB Complaint & Review Removal Service | Remove Negative BBB Reviews | Reach Them AI',
  description:
    'Remove unjust BBB complaints and negative reviews. With 5.4M business profiles and 100+ years of consumer trust, your BBB rating impacts credibility, partnerships, and government contracts. Expert dispute resolution navigation.',
  keywords: [
    'BBB complaint removal',
    'remove BBB reviews',
    'BBB rating improvement',
    'Better Business Bureau complaints',
    'BBB dispute resolution',
    'BBB accreditation',
    'negative BBB review removal',
    'BBB A+ rating',
  ],
  openGraph: {
    title: 'BBB Complaint & Review Removal Service | Reach Them AI',
    description:
      'Expert BBB complaint and review management. Navigate the Better Business Bureau\'s dispute resolution process and protect your business rating.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'BBB Complaint & Review Removal Service',
  description:
    'Professional service for resolving BBB complaints, removing unjust reviews, and improving Better Business Bureau ratings.',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  serviceType: 'Online Reputation Management',
  areaServed: 'United States',
};

const violationTypes = [
  {
    icon: XCircle,
    title: 'Fraudulent Complaints',
    description:
      'Complaints filed by individuals who never conducted business with your company, including fabricated transaction details and invented service failures that can be disproven with records.',
  },
  {
    icon: AlertTriangle,
    title: 'Competitor-Filed Complaints',
    description:
      'Strategic complaints submitted by competitors or their associates to damage your BBB grade. These often follow patterns in timing and language that our analysis can detect.',
  },
  {
    icon: Flag,
    title: 'Resolved Dispute Misrepresentation',
    description:
      'Complaints where the underlying issue was fully resolved but the complainant refuses to update the BBB, leaving a negative record that doesn\'t reflect the actual outcome.',
  },
  {
    icon: ShieldCheck,
    title: 'Factually Inaccurate Claims',
    description:
      'Complaints containing provably false statements about your products, services, or business practices — claims that can be refuted with documentation, contracts, or communication records.',
  },
  {
    icon: Scale,
    title: 'Unreasonable Demands',
    description:
      'Complaints where the consumer demands compensation far exceeding the value of the transaction or requests remedies outside the scope of your business agreement.',
  },
  {
    icon: FileText,
    title: 'Duplicate & Repeat Complaints',
    description:
      'Multiple complaints filed by the same individual about the same incident, artificially inflating your complaint count and disproportionately impacting your BBB grade.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'BBB Profile & Grade Analysis',
    description:
      'We conduct a thorough review of your BBB profile, analyzing every complaint, customer review, and the factors that determine your current letter grade from A+ to F.',
  },
  {
    step: '02',
    title: 'Formal Dispute Response',
    description:
      'We craft detailed, professional responses to each complaint through the BBB\'s dispute resolution portal, addressing allegations point by point with supporting documentation.',
  },
  {
    step: '03',
    title: 'Mediation & Arbitration Support',
    description:
      'When informal resolution isn\'t possible, we guide you through the BBB\'s formal mediation and arbitration processes, ensuring your position is presented with maximum clarity and evidence.',
  },
  {
    step: '04',
    title: 'Grade Recovery Strategy',
    description:
      'Beyond individual complaint resolution, we develop a comprehensive strategy to improve your BBB letter grade — including complaint response time optimization and proactive consumer engagement.',
  },
];

const faqs = [
  {
    question: 'How does the BBB letter grade system work?',
    answer:
      'The BBB grades businesses from A+ to F based on 13 factors including complaint history, complaint resolution, time in business, type of business, and advertising practices. Unanswered complaints have the most significant negative impact on your grade. A business with even a few unresolved complaints can drop from A+ to a C or lower.',
  },
  {
    question: 'Can BBB complaints be removed entirely?',
    answer:
      'BBB complaints can be removed if they are found to be fraudulent, filed against the wrong business, or if the complainant agrees to withdraw. Resolved complaints remain on your profile but display a "Resolved" status that is significantly less damaging. The BBB also removes complaints automatically after 3 years.',
  },
  {
    question: 'Does BBB accreditation matter for my business?',
    answer:
      'BBB accreditation carries significant weight in several contexts. Government contracts often require or prefer BBB-accredited vendors. B2B partnerships frequently reference BBB ratings during due diligence. And for consumers over 45 — one of the highest-spending demographics — the BBB seal remains a primary trust indicator.',
  },
  {
    question: 'How long does the BBB dispute resolution process take?',
    answer:
      'The standard BBB complaint process gives businesses 14 days to respond, followed by a 14-day consumer response window. The full cycle typically takes 2 to 6 weeks. Complex cases involving mediation or arbitration can extend to several months, though most resolutions are achieved within the initial response period.',
  },
];

export default function BBBReviewsPage() {
  return (
    <>
      <Script
        id="bbb-reviews-jsonld"
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
                  style={{ backgroundColor: '#005A78' }}
                />
                Better Business Bureau
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Resolve BBB Complaints &amp; Protect Your Business Grade
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                The Better Business Bureau has profiled 5.4 million businesses
                over more than 100 years. Your BBB grade affects partnerships,
                government contracts, and consumer trust. We navigate the dispute
                resolution process to resolve complaints and restore your rating.
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
                  { stat: '5.4M', label: 'Business profiles maintained' },
                  { stat: '100+', label: 'Years of consumer trust established' },
                  { stat: '87%', label: 'Of consumers trust BBB-rated businesses more' },
                  { stat: '2–6 Weeks', label: 'Typical resolution timeline' },
                ].map((item) => (
                  <div key={item.label} className="p-6">
                    <div className="text-3xl font-bold text-primary-600">{item.stat}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why BBB Matters */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                Why Your BBB Rating Carries Outsized Influence
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  The Better Business Bureau occupies a unique space in the consumer trust ecosystem. Unlike
                  platforms where star ratings and review counts dominate, the BBB assigns a letter grade
                  that carries institutional authority built over a century of consumer advocacy. For many
                  Americans — particularly homeowners hiring contractors, patients choosing healthcare
                  providers, and businesses vetting suppliers — a BBB grade is the definitive credibility
                  check before committing to a purchase or partnership.
                </p>
                <p>
                  The stakes extend well beyond consumer perception. Federal, state, and municipal
                  governments frequently reference BBB ratings in procurement decisions. Many RFPs
                  (Requests for Proposal) explicitly ask for BBB status, and a grade below B can
                  disqualify a business from lucrative contracts. Insurance companies also consider
                  BBB complaints when assessing business risk profiles, potentially impacting your
                  premiums and coverage terms.
                </p>
                <p>
                  What makes BBB complaints particularly damaging is their structured, formal nature.
                  Unlike a casual Google or Yelp review, a BBB complaint creates a quasi-legal record
                  that appears in your business profile for three years. Each unanswered complaint
                  directly lowers your letter grade according to a weighted formula, meaning that even
                  a handful of unresolved complaints can drag an A+ business down to a C — visible to
                  every consumer who searches your company name on the BBB website.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Types of BBB Complaints We Help Resolve
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Not every BBB complaint is legitimate. We identify and challenge complaints
                  that misrepresent your business or violate the BBB&apos;s own filing standards.
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
                Our BBB Complaint Resolution Process
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
              <div className="mt-12 flex items-center gap-3 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-cyan-600 flex-shrink-0" />
                <p className="text-cyan-800 dark:text-cyan-300">
                  <strong>Typical timeline:</strong> 2–6 weeks for standard complaint resolution.
                  Mediation and arbitration cases may take additional time.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About BBB Complaint Resolution
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
                Business Reputation Resources
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
                Remove Your Negative BBB Complaints
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Your BBB grade influences contracts, partnerships, and consumer trust.
                Our team will analyze your complaint history and develop a resolution
                strategy to restore your rating to where it belongs.
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
