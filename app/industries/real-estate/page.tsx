import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import {
  ArrowRight,
  Home,
  Star,
  TrendingDown,
  Search,
  ShieldAlert,
  MessageSquare,
  Users,
  Building2,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Reputation Management for Real Estate & Property Management | Reach Them AI',
  description:
    'Protect your real estate business from negative reviews on Google, Zillow, Realtor.com, and Apartments.com. 90% of buyers search online before contacting an agent — make sure they find a 4.5+ star rating.',
  keywords: [
    'real estate reputation management',
    'property management reviews',
    'Zillow review removal',
    'real estate negative reviews',
    'realtor reputation management',
    'property manager reviews',
    'real estate online reviews',
    'apartments.com review management',
  ],
  openGraph: {
    title: 'Reputation Management for Real Estate & Property Management | Reach Them AI',
    description:
      '90% of buyers search online before contacting an agent. Protect your real estate reputation on Google, Zillow, Realtor.com, and more.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Real Estate Reputation Management',
  description:
    'AI-powered reputation management for real estate agents, brokers, and property managers. Monitor and manage reviews across Zillow, Google, Realtor.com, and more.',
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
    value: '90%',
    label: 'of home buyers and renters search online before contacting an agent or property manager',
    source: 'National Association of Realtors',
  },
  {
    icon: Star,
    value: '4.5+',
    label: 'star rating generates 3x more inquiry calls and showing requests than profiles below 4 stars',
    source: 'BrightLocal Real Estate Survey',
  },
  {
    icon: TrendingDown,
    value: '44%',
    label: 'of potential clients will skip a real estate agent entirely if they find two or more negative reviews on Google',
    source: 'Moz Research',
  },
  {
    icon: Users,
    value: '73%',
    label: 'of consumers say they trust a local business more after reading positive online reviews',
    source: 'BrightLocal Consumer Survey',
  },
];

const painPoints = [
  {
    icon: MessageSquare,
    title: 'Transaction Disputes',
    description:
      'Real estate transactions are high-stakes and emotionally charged. A buyer who feels a closing went poorly or a seller unhappy with their final price may leave a scathing review that misrepresents your professionalism. These reviews carry outsized weight because each one is highly visible to future clients searching for agents in your area.',
  },
  {
    icon: Building2,
    title: 'Tenant Complaints',
    description:
      'Property managers deal with maintenance requests, lease disputes, and eviction processes daily. Frustrated tenants often turn to Google, Apartments.com, and Yelp to vent — sometimes leaving reviews that violate platform policies through personal attacks, false claims, or content posted by individuals who were never actual tenants.',
  },
  {
    icon: ShieldAlert,
    title: 'Communication Breakdowns',
    description:
      'The most common complaint in real estate reviews is poor communication — unreturned calls, delayed updates, or unclear timelines. Even when agents are juggling dozens of active clients, a single review alleging "they never called me back" can define your profile for months until enough positive reviews push it down.',
  },
  {
    icon: Home,
    title: 'Market Frustration Misdirected at Agents',
    description:
      'When buyers lose bidding wars or sellers receive offers below their expectations, agents often absorb the blame in review form. These reviews are not about service quality — they reflect market conditions — but they damage your rating just the same and can deter future clients who lack that context.',
  },
];

const platforms = [
  { name: 'Google Business Profile', description: 'The most visible platform for local real estate searches and map listings' },
  { name: 'Zillow', description: 'The largest real estate marketplace where agent profiles and reviews heavily influence buyer decisions' },
  { name: 'Realtor.com', description: 'NAR-affiliated platform where agents showcase credentials and collect client testimonials' },
  { name: 'Yelp', description: 'High-authority review site that ranks prominently in branded search results' },
  { name: 'Apartments.com', description: 'Critical for property managers — renters compare ratings before scheduling tours' },
];

export default function RealEstatePage() {
  return (
    <>
      <Script
        id="real-estate-jsonld"
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
                Real Estate & Property Management
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Real Estate Professionals
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                90% of home buyers and renters research agents online before making contact. In an
                industry built on trust and referrals, your online reputation is your most powerful
                marketing asset — or your biggest liability.
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
                Why Online Reviews Matter in Real Estate
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
                Real estate is one of the most review-sensitive industries. High transaction values
                mean clients research thoroughly — and a handful of negative reviews can cost you
                hundreds of thousands in lost commissions.
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
                Common Reputation Challenges in Real Estate
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Real estate professionals face unique reputation risks. Every transaction involves
                life-changing financial decisions, and emotions run high on both sides. Understanding
                these patterns is the first step toward protecting your online presence.
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

          {/* How Negative Reviews Impact Real Estate */}
          <section className="py-20 bg-[#182825] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                The Real Cost of Negative Reviews in Real Estate
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                Unlike restaurants or retail where a bad review might cost a $50 meal, a negative
                review for a real estate agent can cost a $15,000+ commission. The math is brutal:
                if your average commission is $12,000 and negative reviews cause you to lose just
                two clients per year, that is $24,000 in lost income — every single year.
              </p>
              <div className="mt-8 space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Listing Presentations Lost</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Sellers Google their potential listing agent before the first meeting. If negative
                    reviews appear, you may never get the chance to present. Research shows agents with
                    ratings below 4.0 stars receive 67% fewer listing inquiries from sellers who find
                    them through online searches.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Referral Network Damage</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Real estate thrives on referrals. When a past client&apos;s friend Googles your name
                    and finds negative reviews, the referral dies silently. The referring client may
                    never know, and you never learn about the opportunity you lost. Negative reviews
                    create an invisible ceiling on your referral pipeline.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Brokerage Reputation Impact</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    For brokerages and property management firms, individual agent reviews aggregate
                    into an overall brand perception. One agent with multiple negative reviews can
                    suppress the Google Maps ranking for the entire office, reducing visibility for
                    every agent on the team.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-lg text-slate-300 leading-relaxed">
                Learn more about the broader financial impact of negative reviews in our{' '}
                <Link
                  href="/negative-reviews-impact"
                  className="text-primary-400 font-medium hover:underline"
                >
                  comprehensive revenue impact analysis
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Platforms */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Key Review Platforms for Real Estate
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Real estate professionals must monitor reviews across multiple platforms
                simultaneously. Each has its own policies, removal processes, and impact on your
                business.
              </p>
              <div className="mt-10 grid gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
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
                How Reach Them AI Protects Real Estate Reputations
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Our AI-powered platform is built to handle the unique challenges real estate
                professionals face. From identifying policy-violating Zillow reviews to monitoring
                your Google Business Profile in real time, we provide the tools you need to take
                control of your online presence.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'AI-powered review analysis identifies policy violations across Google, Zillow, Realtor.com, Yelp, and Apartments.com simultaneously.',
                  'Automated monitoring alerts you to new reviews within minutes — not days — so you can respond before damage compounds.',
                  'Strategic response templates crafted specifically for real estate scenarios: transaction disputes, tenant complaints, and market frustration reviews.',
                  'Review generation campaigns that help you systematically collect positive reviews from satisfied buyers, sellers, and tenants.',
                  'Detailed analytics showing your review profile trends, competitor comparisons, and the ROI of your reputation management efforts.',
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
                Want to understand the full scope of reputation management?{' '}
                <Link
                  href="/what-is-online-reputation-management"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Read our complete guide to Online Reputation Management
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary-600">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Protect Your Real Estate Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Every day without reputation management is a day potential clients choose another
                agent based on what they find online. Get a free assessment and discover how many
                of your negative reviews qualify for removal.
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
