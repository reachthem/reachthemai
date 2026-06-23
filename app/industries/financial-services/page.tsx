import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  TrendingDown,
  Search,
  ShieldAlert,
  DollarSign,
  FileWarning,
  Scale,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Reputation Management for Financial Services & Insurance | Reach Them AI',
  description:
    'Protect your financial services firm or insurance agency from negative reviews on Google, Yelp, BBB, Trustpilot, and NerdWallet. 78% of consumers read reviews before choosing a financial advisor.',
  keywords: [
    'financial services reputation management',
    'insurance review management',
    'financial advisor reviews',
    'bank reputation management',
    'insurance negative reviews',
    'financial advisor online reputation',
    'NerdWallet review management',
    'BBB financial services',
  ],
  openGraph: {
    title: 'Reputation Management for Financial Services & Insurance | Reach Them AI',
    description:
      '78% read reviews before choosing a financial advisor. Protect your firm on Google, Yelp, BBB, Trustpilot, and NerdWallet.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Financial Services Reputation Management',
  description:
    'AI-powered reputation management for financial advisors, insurance agents, banks, and investment firms. Monitor and manage reviews across Google, BBB, NerdWallet, and more.',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  areaServed: 'US',
  serviceType: 'Online Reputation Management',
};

const stats = [
  {
    icon: Search,
    value: '78%',
    label: 'of consumers read online reviews before choosing a financial advisor, accountant, or insurance agent',
    source: 'BrightLocal Financial Services Report',
  },
  {
    icon: Star,
    value: '88%',
    label: 'of consumers say trust is the single most important factor when selecting a financial services provider',
    source: 'Edelman Trust Barometer',
  },
  {
    icon: TrendingDown,
    value: '52%',
    label: 'of potential clients will not consider a financial professional with fewer than 4 stars on Google',
    source: 'ReviewTrackers Industry Data',
  },
  {
    icon: DollarSign,
    value: '$50K+',
    label: 'average lifetime value of a single financial advisory client — making each lost lead extraordinarily costly',
    source: 'Kitces Financial Planning Research',
  },
];

const painPoints = [
  {
    icon: DollarSign,
    title: 'Investment Return Disappointment',
    description:
      'Financial markets are inherently unpredictable, but clients often blame their advisor when returns fall below expectations. A client who loses money during a market downturn may leave a review stating their advisor "lost their savings" — a misleading characterization that can devastate trust with future prospects. These reviews are especially damaging because financial decisions involve the highest levels of personal trust.',
  },
  {
    icon: FileWarning,
    title: 'Fee Transparency Disputes',
    description:
      'Fee structures in financial services can be complex — advisory fees, fund expense ratios, transaction costs, and insurance premiums all create opportunities for perceived overcharging. Even when fees are fully disclosed, clients who feel surprised by the total cost frequently express their frustration through negative reviews that characterize the firm as "hidden fees" or "overpriced."',
  },
  {
    icon: ShieldAlert,
    title: 'Insurance Claims Handling',
    description:
      'Insurance claims are high-emotion events. Policyholders filing claims are often dealing with car accidents, property damage, health issues, or loss. When a claim is denied, delayed, or pays less than expected, the resulting review is written from a place of genuine distress. These reviews carry enormous weight because they speak to the core promise of insurance: "Will they be there when I need them?"',
  },
  {
    icon: Scale,
    title: 'Regulatory and Compliance Constraints',
    description:
      'Financial services firms face unique challenges in responding to reviews. Compliance regulations like SEC and FINRA rules restrict what advisors can say publicly about client accounts, performance, and transactions. This means firms often cannot provide context or correct misinformation in review responses without risking regulatory violations — leaving damaging reviews to stand unchallenged.',
  },
];

const platforms = [
  { name: 'Google Business Profile', description: 'The primary search platform where clients find financial advisors, insurance agents, and local bank branches' },
  { name: 'Yelp', description: 'High-authority review platform that frequently ranks on page one for financial service searches' },
  { name: 'Better Business Bureau (BBB)', description: 'Accreditation and rating system that signals legitimacy and trustworthiness to conservative financial consumers' },
  { name: 'Trustpilot', description: 'Independent review platform increasingly used by consumers comparing insurance providers and fintech services' },
  { name: 'NerdWallet', description: 'Financial comparison platform where reviews and ratings directly influence which providers consumers choose' },
];

export default function FinancialServicesPage() {
  return (
    <>
      <Script
        id="financial-services-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-slate-900 industry-page">
        <Navbar background="white" />
        <main>
          {/* Hero */}
          <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-primary-300 text-sm font-medium mb-6">
                Financial Services & Insurance
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Financial Services &amp; Insurance
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                Trust is the currency of financial services. When 78% of consumers read reviews
                before choosing a financial advisor or insurance agent, your online reputation
                directly determines your ability to attract and retain high-value clients.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 hero-buttons">
                <Link
                  href="/free-assessment"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all"
                >
                  Get a Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Industry Stats */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">
                Why Trust and Reviews Are Inseparable in Financial Services
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
                Financial services require a higher threshold of trust than almost any other industry.
                Consumers are entrusting you with their savings, investments, and financial futures —
                and they use reviews to decide whether you deserve that trust.
              </p>
              <div className="mt-12 grid sm:grid-cols-2 gap-8">
                {stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{stat.label}</p>
                    <p className="mt-2 text-xs text-slate-500">— {stat.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pain Points */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Common Reputation Challenges in Financial Services
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Financial professionals navigate a unique intersection of high-stakes decisions,
                complex products, and strict regulatory environments. These factors create reputation
                vulnerabilities that are distinct from any other industry.
              </p>
              <div className="mt-10 grid gap-6">
                {painPoints.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex items-start gap-5"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="py-20 bg-[#182825] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                The Amplified Cost of Negative Reviews in Financial Services
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                The lifetime value of a financial services client is measured in tens of thousands of
                dollars. A wealth management client may generate $5,000–$15,000 annually in fees over
                a 10–20 year relationship. When negative reviews cost you even one new client per
                quarter, the compounding loss is staggering.
              </p>
              <div className="mt-8 space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Referral Pipeline Contamination</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Financial advisors rely heavily on client referrals. When a referred prospect
                    Googles your name and finds a review alleging poor returns or hidden fees, the
                    referral dies instantly. The referring client may never know, and you lose not
                    just one prospect but the entire future referral chain that client would have
                    generated. In financial services, one negative review can cost you a six-figure
                    lifetime revenue stream.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Compliance-Restricted Responses</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Unlike a restaurant that can freely explain what happened with a bad meal,
                    financial professionals cannot discuss specific client situations, account
                    performance, or transaction details in public review responses. This regulatory
                    constraint means negative reviews often go contextually unchallenged, leaving
                    future prospects with only one side of the story.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Competitor Advantage Acceleration</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    In financial services, consumers compare very few providers before making a
                    decision — typically 2–3. If your Google profile shows 3.8 stars while a
                    competitor shows 4.7 stars, you are eliminated from consideration before anyone
                    even reviews your credentials, certifications, or track record. The competitor
                    wins by default, not by merit.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-lg text-slate-300 leading-relaxed">
                Explore the full financial impact of negative reviews in our{' '}
                <Link
                  href="/negative-reviews-impact"
                  className="text-primary-400 font-medium hover:underline"
                >
                  data-backed revenue impact analysis
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Platforms */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Key Review Platforms for Financial Services
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Financial services professionals must maintain strong review profiles across platforms
                that consumers use to evaluate trustworthiness, legitimacy, and service quality.
              </p>
              <div className="mt-10 grid gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{platform.name}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{platform.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How We Help */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                How Reach Them AI Protects Financial Reputations
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Our platform understands the unique constraints of financial services — from
                compliance-sensitive review responses to the critical importance of trust signals.
                We help you build and protect the online presence your credentials deserve.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Compliance-aware review response templates that address client concerns without violating SEC, FINRA, or state insurance regulations.',
                  'AI-powered detection of policy-violating reviews including false claims, defamatory content, and reviews from non-clients across Google, BBB, and NerdWallet.',
                  'Proactive review generation that systematically collects testimonials from satisfied clients to build a review profile that reflects your true service quality.',
                  'Real-time monitoring across all critical platforms with instant alerts so you can respond to new reviews within hours, not weeks.',
                  'Competitive intelligence showing how your review profile compares to other advisors, agents, and firms in your market area.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                    <span className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn the fundamentals of reputation strategy in our{' '}
                <Link
                  href="/what-is-online-reputation-management"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  complete guide to Online Reputation Management
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary-600">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Protect Your Financial Services Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                In financial services, trust is everything. Get a free assessment and discover how
                many of your harmful reviews qualify for removal — before they cost you another
                high-value client.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 hero-buttons">
                <Link
                  href="/free-assessment"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-all"
                >
                  Get a Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
