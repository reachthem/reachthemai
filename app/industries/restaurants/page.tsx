import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  ArrowRight,
  UtensilsCrossed,
  Star,
  TrendingUp,
  ShieldAlert,
  Users,
  MessageCircle,
  BarChart3,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Restaurant Reputation Management — Remove Bad Restaurant Reviews | Reach Them AI',
  description:
    'Protect your restaurant from unfair negative reviews. 67% of diners check reviews before visiting. Our AI-powered platform removes policy-violating reviews from Google, Yelp & TripAdvisor.',
  keywords: [
    'restaurant reputation management',
    'remove restaurant reviews',
    'yelp review removal',
    'google restaurant reviews',
    'tripadvisor review removal',
    'restaurant review management',
    'hospitality reputation management',
    'negative restaurant review removal',
    'restaurant online reputation',
  ],
  openGraph: {
    title:
      'Restaurant Reputation Management — Remove Bad Restaurant Reviews | Reach Them AI',
    description:
      '67% of diners won\'t visit a restaurant with bad reviews. Protect your revenue with AI-powered review removal for Google, Yelp, and TripAdvisor.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Restaurant Reputation Management',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  description:
    'AI-powered reputation management and review removal service for restaurants and hospitality businesses.',
  areaServed: 'US',
  serviceType: 'Reputation Management',
  audience: {
    '@type': 'Audience',
    audienceType: 'Restaurants, Cafes, Bars, and Hospitality Businesses',
  },
};

const painPoints = [
  {
    icon: UtensilsCrossed,
    title: 'Unfair Food Complaints',
    description:
      'Customers leaving exaggerated or fabricated complaints about food quality that don\'t reflect your kitchen\'s standards or daily operations.',
  },
  {
    icon: Users,
    title: 'Ex-Employee Retaliation',
    description:
      'Former staff posting fake reviews to damage your reputation after parting ways, often creating multiple accounts to amplify the harm.',
  },
  {
    icon: ShieldAlert,
    title: 'Competitor Sabotage',
    description:
      'Rival restaurants planting negative reviews to steal your customers, a growing problem in saturated dining markets.',
  },
  {
    icon: AlertTriangle,
    title: 'Service Misrepresentations',
    description:
      'One-off incidents blown out of proportion in reviews, giving potential diners a distorted picture of your typical guest experience.',
  },
];

const platforms = [
  { name: 'Google Maps', description: 'The #1 platform diners use to discover local restaurants and read reviews before visiting.' },
  { name: 'Yelp', description: 'Yelp drives significant foot traffic to restaurants — a single star increase can boost revenue 5-9%.' },
  { name: 'TripAdvisor', description: 'Critical for restaurants in tourist areas, TripAdvisor reviews directly impact bookings and walk-ins.' },
  { name: 'Facebook', description: 'Social recommendations on Facebook influence dining decisions within local community networks.' },
];

export default function RestaurantsPage() {
  return (
    <>
      <Script
        id="restaurants-jsonld"
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
                <UtensilsCrossed className="h-4 w-4" />
                Restaurants &amp; Hospitality
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Restaurants &amp; Hospitality
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                67% of diners check online reviews before choosing where to eat.
                Don&apos;t let unfair or fake reviews cost you covers — protect
                your restaurant&apos;s online presence with AI-powered review management.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 hero-buttons">
                <Link
                  href="/free-assessment"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25 min-w-[12rem] justify-center"
                >
                  Get a Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/what-is-online-reputation-management"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all min-w-[12rem] justify-center"
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
                  { stat: '67%', label: 'of diners check online reviews before choosing a restaurant', icon: Star },
                  { stat: '5–9%', label: 'revenue increase per 1-star improvement on Yelp (Harvard Business School)', icon: TrendingUp },
                  { stat: '33%', label: 'of customers avoid restaurants with less than 4 stars on Google', icon: BarChart3 },
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

          {/* Why Restaurants Are Vulnerable */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Why Restaurants Are Uniquely Vulnerable to Negative Reviews
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  The restaurant industry faces a disproportionate review problem.
                  Dining is deeply personal — taste, mood, and expectations vary wildly
                  from guest to guest. A single bad experience (or a fabricated one) can
                  generate a scathing review that lives online indefinitely. Unlike
                  product businesses, restaurants can&apos;t offer a simple return or
                  exchange. The damage from a viral one-star review compounds quickly:
                  fewer reservations, empty tables during peak hours, and a declining
                  reputation that takes months to rebuild organically. Competitors know
                  this vulnerability and increasingly exploit it through coordinated fake
                  review campaigns.
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
                  How Reach Them AI Protects Your Restaurant
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Our AI-driven platform analyzes every review against platform guidelines
                  and flags removable content — from obvious fakes to subtle policy
                  violations that human eyes miss.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: MessageCircle,
                    title: 'AI Review Analysis',
                    description:
                      'Our proprietary AI scans your reviews in real-time, identifying policy violations, fake patterns, and competitor-driven attacks across Google, Yelp, and TripAdvisor simultaneously.',
                  },
                  {
                    icon: ShieldAlert,
                    title: 'Strategic Removal Requests',
                    description:
                      'We build platform-specific removal cases citing exact policy violations. Our success rate for flagged restaurant reviews exceeds industry averages because we understand how each platform evaluates food-service complaints.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Reputation Monitoring',
                    description:
                      'Track your ratings, review velocity, and sentiment trends across every platform in one dashboard. Get instant alerts when a new review drops so you can respond before it impacts bookings.',
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
                  Platforms We Monitor for Restaurants
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Your diners discover you across multiple platforms. We cover the ones
                  that matter most for restaurant visibility and revenue.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <MapPin className="h-6 w-6 text-primary-600 mb-3" />
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
                The Real Cost of Negative Restaurant Reviews
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300">
                  For restaurant owners, every negative review carries a measurable
                  financial toll. Research from Harvard Business School shows that a
                  one-star increase on Yelp leads to a 5–9% increase in revenue — meaning
                  the inverse is equally devastating. A restaurant dropping from 4.5 to
                  3.5 stars could see a revenue decline of 15–25% within months. Womply
                  research found that restaurants with fewer than 3 stars earn 27% less
                  revenue than the average restaurant in their category.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Beyond direct revenue loss, negative reviews create a cascading effect.
                  Delivery platforms like DoorDash and Uber Eats surface higher-rated
                  restaurants first, meaning a lower rating reduces your digital
                  visibility precisely when you need it most. Social media amplification
                  means a particularly harsh review can go viral in local food groups,
                  reaching thousands of potential diners who may never walk through your
                  door. In the hospitality industry, where margins are already razor-thin
                  (typically 3-9%), losing even a handful of covers per night due to
                  review damage can mean the difference between profitability and closure.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Identify and flag fake competitor reviews',
                  'Remove policy-violating Yelp and Google reviews',
                  'Monitor new reviews across all major platforms',
                  'Respond professionally to legitimate feedback',
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
                Protect Your Restaurant&apos;s Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Don&apos;t let unfair reviews empty your tables. Get a free
                assessment and discover which of your reviews qualify for removal.
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
