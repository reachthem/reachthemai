import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  ArrowRight,
  Scale,
  Star,
  ShieldAlert,
  Users,
  AlertTriangle,
  BarChart3,
  Gavel,
  CheckCircle2,
  FileX,
  UserX,
  DollarSign,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Law Firm Reputation Management — Remove Lawyer Reviews | Reach Them AI',
  description:
    '85% of clients rely on reviews when choosing a lawyer. Protect your law firm from opposing party reviews, disgruntled clients, and policy-violating content on Google and Avvo.',
  keywords: [
    'lawyer reputation management',
    'remove lawyer reviews',
    'law firm review removal',
    'avvo review removal',
    'attorney reputation management',
    'legal services reviews',
    'remove google reviews lawyer',
    'martindale hubbell reviews',
    'law firm online reputation',
  ],
  openGraph: {
    title:
      'Law Firm Reputation Management — Remove Lawyer Reviews | Reach Them AI',
    description:
      '85% of clients rely on reviews when choosing a lawyer. Protect your firm with AI-powered review management for Google, Avvo, and Martindale-Hubbell.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Legal Services Reputation Management',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  description:
    'AI-powered reputation management and review removal service for law firms, attorneys, and legal practices.',
  areaServed: 'US',
  serviceType: 'Reputation Management',
  audience: {
    '@type': 'Audience',
    audienceType: 'Law Firms, Attorneys, and Legal Practices',
  },
};

const painPoints = [
  {
    icon: UserX,
    title: 'Opposing Party Reviews',
    description:
      'Opposing parties in cases leaving retaliatory reviews — a problem unique to legal services where your adversary has personal motivation to damage your reputation.',
  },
  {
    icon: DollarSign,
    title: 'Billing Disputes',
    description:
      'Clients frustrated by legal fees leaving reviews that mischaracterize your billing practices without understanding the complexity of the work performed.',
  },
  {
    icon: FileX,
    title: 'Unfavorable Case Outcomes',
    description:
      'Clients blaming attorneys for outcomes influenced by evidence, opposing counsel, or judicial decisions far beyond any lawyer\'s control.',
  },
  {
    icon: AlertTriangle,
    title: 'Confidentiality Constraints',
    description:
      'Attorney-client privilege and professional ethics rules severely limit how lawyers can publicly respond to review claims, leaving false narratives unanswered.',
  },
];

const platforms = [
  { name: 'Google Business', description: 'The most visible platform for prospective clients searching for local attorneys and reading peer reviews.' },
  { name: 'Avvo', description: 'The leading legal-specific review site where clients research attorneys by practice area and peer endorsements.' },
  { name: 'Martindale-Hubbell', description: 'A long-standing legal directory where AV ratings and client reviews influence referral decisions among peers.' },
  { name: 'Yelp', description: 'Increasingly used for solo practitioners and small firms, particularly in consumer-facing practice areas.' },
];

export default function LegalPage() {
  return (
    <>
      <Script
        id="legal-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-900 industry-page">
        <Navbar background="white" />
        <main>
          {/* Hero */}
          <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-300 text-sm font-medium mb-6">
                <Scale className="h-4 w-4" />
                Legal Services
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Law Firms &amp; Attorneys
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                85% of potential clients rely on online reviews when selecting legal
                representation. Protect your firm from retaliatory reviews, opposing
                party attacks, and policy-violating content with AI-powered review
                management.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 hero-buttons">
                <Link
                  href="/free-assessment"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25"
                >
                  Get a Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/what-is-online-reputation-management"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  Learn About ORM
                </Link>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { stat: '85%', label: 'of people rely on online reviews when choosing a lawyer', icon: Star },
                  { stat: '76%', label: 'of legal consumers visit a law firm\'s website after reading positive reviews', icon: Users },
                  { stat: '$300+', label: 'average cost-per-lead for attorneys, making every lost prospect expensive', icon: DollarSign },
                ].map((item) => (
                  <div
                    key={item.stat}
                    className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <item.icon className="h-8 w-8 text-primary-600 mx-auto mb-4" />
                    <p className="text-4xl font-bold text-primary-600">{item.stat}</p>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Legal Is Vulnerable */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Why Law Firms Face Unique Reputation Risks
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  The legal profession operates under constraints that make reputation
                  management exceptionally challenging. Bar association rules and
                  attorney-client privilege create strict boundaries around what lawyers
                  can say publicly in response to reviews. Unlike a restaurant owner who
                  can apologize and offer a free meal, an attorney cannot discuss case
                  details, confirm or deny a client relationship, or explain the legal
                  reasoning behind strategic decisions. This one-sided dynamic means
                  dissatisfied clients — and especially opposing parties who were never
                  your clients — can publish misleading narratives that you cannot
                  directly refute. For firms investing heavily in client acquisition
                  through SEO and paid advertising, a few negative reviews can
                  dramatically increase cost-per-case by deterring the very leads your
                  marketing budget generates.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {painPoints.map((point) => (
                  <div
                    key={point.title}
                    className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <point.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How We Help */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  How Reach Them AI Defends Your Firm&apos;s Reputation
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  We understand the ethical boundaries unique to legal professionals and
                  build review management strategies that protect your reputation
                  without compromising your professional obligations.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Gavel,
                    title: 'Ethics-Conscious Approach',
                    description:
                      'Our review management process is designed with bar association rules in mind. We never request or require disclosure of privileged information, focusing solely on platform policy violations.',
                  },
                  {
                    icon: ShieldAlert,
                    title: 'Opposing Party Identification',
                    description:
                      'Our AI detects patterns consistent with opposing party reviews — non-client reviewers who never retained your services — a clear violation on most review platforms.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Legal Industry Analytics',
                    description:
                      'Track how your firm\'s reputation compares to competitors in your practice area and jurisdiction, with actionable insights to improve your review profile over time.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center"
                  >
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-7 w-7 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Platforms */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Platforms We Monitor for Legal Professionals
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Potential clients research law firms across general and legal-specific
                  platforms. We cover every review site that impacts client acquisition.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <Scale className="h-6 w-6 text-primary-600 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {platform.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {platform.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Real Impact */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-8">
                The Financial Impact of Negative Reviews on Law Firms
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300">
                  For law firms, negative reviews create a particularly expensive problem
                  because of the high lifetime value of each client. The average personal
                  injury case can generate $50,000–$500,000 in legal fees, and family law
                  cases often exceed $15,000. When a prospective client sees a damaging
                  review and chooses a competitor instead, the lost revenue dwarfs the
                  cost of any review management investment. A Thomson Reuters study found
                  that 76% of legal consumers visit a firm&apos;s website only after
                  reading positive reviews — meaning negative reviews act as a gatekeeper
                  that prevents prospects from ever discovering your expertise.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  The compounding effect is especially damaging in legal services. Unlike
                  restaurants or retail where volume compensates for individual losses,
                  law firms typically handle a limited number of cases simultaneously.
                  Losing two or three high-value clients per quarter to reputation damage
                  can represent a six-figure annual revenue gap. Additionally, Avvo
                  prominently displays ratings alongside attorney profiles in Google
                  search results through structured data, meaning your star rating appears
                  before potential clients even click through to your profile. In a
                  profession where trust is the foundation of every engagement, online
                  reputation has become inseparable from business development.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Identify and flag opposing party retaliatory reviews',
                  'Remove reviews from non-clients violating platform policies',
                  'Monitor legal-specific platforms like Avvo and Martindale',
                  'Build ethical response strategies within bar guidelines',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary-600">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Protect Your Law Firm&apos;s Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Don&apos;t let unfair reviews undermine the trust you&apos;ve spent
                years building. Get a free assessment of your firm&apos;s online
                reputation.
              </p>
              <Link
                href="/free-assessment"
                className="mt-8 inline-flex items-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-all shadow-lg"
              >
                Get a Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
