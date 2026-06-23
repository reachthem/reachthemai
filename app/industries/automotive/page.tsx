import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  ArrowRight,
  Car,
  Star,
  ShieldAlert,
  DollarSign,
  BarChart3,
  Wrench,
  CheckCircle2,
  ThumbsDown,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Automotive Reputation Management — Remove Dealership & Shop Reviews | Reach Them AI',
  description:
    '95% of car buyers research online before purchasing. Remove unfair dealership, auto repair & body shop reviews from Google, DealerRater, Cars.com & Edmunds with AI-powered management.',
  keywords: [
    'automotive reputation management',
    'remove dealership reviews',
    'car dealer review removal',
    'auto repair reputation management',
    'dealerater review removal',
    'cars.com review management',
    'auto shop online reputation',
    'dealership reputation management',
    'automotive review removal',
  ],
  openGraph: {
    title:
      'Automotive Reputation Management — Remove Dealership & Shop Reviews | Reach Them AI',
    description:
      '95% of car buyers use digital channels before purchasing. Protect your dealership or shop with AI-powered review management.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Automotive Reputation Management',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  description:
    'AI-powered reputation management and review removal service for car dealerships, auto repair shops, and automotive service centers.',
  areaServed: 'US',
  serviceType: 'Reputation Management',
  audience: {
    '@type': 'Audience',
    audienceType: 'Car Dealerships, Auto Repair Shops, Body Shops, and Automotive Service Centers',
  },
};

const painPoints = [
  {
    icon: DollarSign,
    title: 'Pricing & Negotiation Frustrations',
    description:
      'Customers leaving negative reviews when they feel they didn\'t get the deal they wanted, regardless of how fairly the transaction was conducted or market conditions.',
  },
  {
    icon: Wrench,
    title: 'Repair Quality Disputes',
    description:
      'Vehicle owners blaming your shop for pre-existing conditions, manufacturer defects, or issues that emerge after service due to unrelated component failures.',
  },
  {
    icon: ThumbsDown,
    title: 'Sales Tactics Accusations',
    description:
      'Reviews alleging high-pressure sales or hidden fees that misrepresent your transparent business practices, often posted by shoppers who visited but never purchased.',
  },
  {
    icon: Clock,
    title: 'Service Timeline Complaints',
    description:
      'Customers penalizing your business for repair timelines affected by parts availability, manufacturer backlogs, or insurance approval processes outside your control.',
  },
];

const platforms = [
  { name: 'Google Business', description: 'The first place car buyers and vehicle owners search when looking for dealerships and repair shops in their area.' },
  { name: 'DealerRater', description: 'The largest automotive-specific review platform, directly embedded in many dealer websites and search results.' },
  { name: 'Cars.com', description: 'Major vehicle marketplace where dealer reviews sit alongside inventory listings, directly influencing purchase decisions.' },
  { name: 'Edmunds & Yelp', description: 'Edmunds provides expert and consumer reviews while Yelp covers independent shops and service centers extensively.' },
];

export default function AutomotivePage() {
  return (
    <>
      <Script
        id="automotive-jsonld"
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
                <Car className="h-4 w-4" />
                Automotive
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Automotive Businesses
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                95% of car buyers use digital channels before making a purchase
                decision. Dealerships and shops with 4+ star ratings see 25% more
                bookings. Protect your automotive business from reviews that drive
                customers to competitors.
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
                  { stat: '95%', label: 'of car buyers use digital channels to research before visiting a dealership', icon: Star },
                  { stat: '25%', label: 'more service bookings for automotive businesses with 4+ star ratings', icon: BarChart3 },
                  { stat: '$1,200', label: 'average revenue lost per deterred service customer over their vehicle lifecycle', icon: DollarSign },
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

          {/* Why Automotive Is Vulnerable */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Why Automotive Businesses Are Especially Exposed to Review Damage
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  The automotive industry has a long-standing trust deficit that makes
                  online reviews disproportionately powerful. Decades of negative
                  stereotypes about car salespeople and repair shops mean consumers
                  approach automotive transactions with higher skepticism than almost
                  any other industry. A single negative review confirming those
                  preconceptions carries outsized weight — research from DealerRater
                  shows that one negative dealership review can require up to seven
                  positive reviews to neutralize its impact on prospective buyers.
                  Automotive transactions also involve significant financial commitment,
                  with average new car purchases exceeding $48,000 and even routine
                  service visits averaging $200-$500, making consumers particularly
                  cautious and review-reliant. The high-emotion nature of car buying
                  and repair experiences means reviews are often written at peak
                  frustration, resulting in language and ratings that don&apos;t
                  accurately reflect the overall business quality.
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
                  How Reach Them AI Drives More Customers to Your Lot &amp; Shop
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Our platform understands the automotive review ecosystem — from
                  dealership sales reviews to service department feedback — and builds
                  targeted strategies for each.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Car,
                    title: 'Automotive-Specific AI',
                    description:
                      'Our algorithms are trained on automotive review patterns, distinguishing between genuine service complaints and the emotional reactions common after high-stakes vehicle purchases or unexpected repair bills.',
                  },
                  {
                    icon: ShieldAlert,
                    title: 'Cross-Platform Protection',
                    description:
                      'Simultaneous monitoring and management across Google, DealerRater, Cars.com, Edmunds, and Yelp — the platforms that drive test drives, service appointments, and purchase decisions.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Sales & Service Analytics',
                    description:
                      'Separate dashboards for sales and service department reviews, letting you track sentiment trends and identify operational improvements that drive organic rating growth.',
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
                  Platforms We Monitor for Automotive Businesses
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Car buyers and vehicle owners research across general and
                  automotive-specific platforms. We cover every review site that
                  influences automotive purchasing and service decisions.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <Car className="h-6 w-6 text-primary-600 mb-3" />
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
                How Negative Reviews Impact Automotive Revenue
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300">
                  In the automotive industry, the revenue impact of negative reviews
                  operates on a different scale than most businesses. A single lost new
                  car sale can represent $2,000-$5,000 in gross profit, while the
                  lifetime value of a service customer — oil changes, tire rotations,
                  brake jobs, and major repairs over 5-10 years of vehicle ownership —
                  can exceed $10,000. DealerRater data indicates that dealerships with
                  4.5+ star ratings generate 25% more service bookings than those rated
                  below 4 stars, translating to hundreds of thousands in annual service
                  department revenue. For independent repair shops, Google reviews are
                  often the sole discovery channel, and a drop below 4 stars can reduce
                  new customer walk-ins by over 50%.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  The competitive density of the automotive market intensifies the
                  review impact. Most metro areas have dozens of dealerships and hundreds
                  of repair shops within a reasonable drive, giving consumers abundant
                  alternatives. When faced with a choice between two similar shops —
                  one rated 4.6 stars and another rated 3.8 — the overwhelming majority
                  of consumers choose the higher-rated option without further research.
                  The automotive industry also faces unique challenges with reviews from
                  people who visited but didn&apos;t purchase, tire-kickers upset about
                  trade-in valuations, and customers confusing manufacturer warranty
                  limitations with dealer service quality. These review patterns are
                  common across the industry, and our AI is specifically trained to
                  identify and address them.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Remove reviews from non-customers who never transacted',
                  'Flag policy-violating content across automotive review platforms',
                  'Separate sales and service reputation tracking',
                  'Monitor competitor review activity for industry benchmarking',
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
                Protect Your Automotive Business&apos;s Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Don&apos;t let unfair reviews steer customers to your competitors.
                Get a free assessment and discover which reviews qualify for removal.
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
