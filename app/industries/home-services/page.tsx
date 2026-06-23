import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  ArrowRight,
  Hammer,
  Star,
  ShieldAlert,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Wrench,
  CheckCircle2,
  ThumbsDown,
  CalendarX,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Home Services Reputation Management — Remove Contractor Reviews | Reach Them AI',
  description:
    '88% of homeowners trust online reviews for home services. Remove unfair plumber, electrician, HVAC & contractor reviews from Google, Angi, HomeAdvisor & Yelp with AI-powered management.',
  keywords: [
    'home services reputation management',
    'remove contractor reviews',
    'plumber review removal',
    'HVAC reputation management',
    'electrician review removal',
    'angi review removal',
    'homeadvisor review management',
    'home services online reputation',
    'contractor reputation management',
  ],
  openGraph: {
    title:
      'Home Services Reputation Management — Remove Contractor Reviews | Reach Them AI',
    description:
      '88% of homeowners trust online reviews when hiring home service professionals. Protect your business with AI-powered review management.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Home Services Reputation Management',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  description:
    'AI-powered reputation management and review removal service for home service professionals including plumbers, electricians, HVAC technicians, and general contractors.',
  areaServed: 'US',
  serviceType: 'Reputation Management',
  audience: {
    '@type': 'Audience',
    audienceType: 'Plumbers, Electricians, HVAC Technicians, Roofers, and General Contractors',
  },
};

const painPoints = [
  {
    icon: DollarSign,
    title: 'Pricing Complaints',
    description:
      'Homeowners leaving negative reviews over pricing without understanding material costs, licensing requirements, or the complexity of specialized labor involved.',
  },
  {
    icon: ThumbsDown,
    title: 'Warranty Disputes',
    description:
      'Customers posting damaging reviews when warranty claims involve manufacturer limitations or conditions outside the scope of your original installation or repair.',
  },
  {
    icon: CalendarX,
    title: 'Scheduling Frustrations',
    description:
      'Reviews penalizing your business for scheduling delays caused by supply chain issues, permit requirements, or weather — factors beyond any contractor\'s control.',
  },
  {
    icon: AlertTriangle,
    title: 'Unrealistic Expectations',
    description:
      'Homeowners expecting showroom-perfect results on renovation projects constrained by existing structural conditions, building codes, or budget limitations.',
  },
];

const platforms = [
  { name: 'Google Business', description: 'The dominant platform where homeowners search for and evaluate local service providers before making a call.' },
  { name: 'Angi (Angie\'s List)', description: 'A trusted home services marketplace where reviews directly influence lead generation and premium placement.' },
  { name: 'HomeAdvisor', description: 'Merged with Angi, HomeAdvisor still maintains separate review profiles that impact contractor visibility and lead costs.' },
  { name: 'Yelp & BBB', description: 'Yelp drives local discovery while BBB accreditation reviews carry weight with quality-conscious homeowners.' },
];

export default function HomeServicesPage() {
  return (
    <>
      <Script
        id="home-services-jsonld"
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
                <Hammer className="h-4 w-4" />
                Home Services
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Home Service Professionals
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                88% of homeowners trust online reviews when hiring contractors.
                Businesses with 4+ stars receive twice as many calls. Protect your
                home services company from unfair reviews that cost you jobs.
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
                  { stat: '88%', label: 'of homeowners trust online reviews as much as personal referrals for home services', icon: Star },
                  { stat: '2×', label: 'more phone calls for home service businesses with 4+ star ratings vs. lower-rated competitors', icon: BarChart3 },
                  { stat: '$4,000+', label: 'average job value lost each time a negative review deters a homeowner from calling', icon: DollarSign },
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

          {/* Why Home Services Are Vulnerable */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Why Home Service Businesses Are Review-Dependent
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Home service businesses face a review landscape where trust is
                  everything. Homeowners are inviting strangers into their most personal
                  space — their home — and rely heavily on peer experiences to make that
                  decision. Unlike retail purchases with easy returns, a botched plumbing
                  job or electrical installation can mean thousands in additional repairs,
                  making customers hyper-cautious and review-dependent. The seasonal
                  nature of many home services means a cluster of negative reviews during
                  your peak season can devastate annual revenue. A plumber averaging 4.7
                  stars who drops to 3.9 after a few unfair reviews may see their lead
                  pipeline from Google and Angi shrink by 40-60%, as homeowners skip past
                  sub-4-star providers entirely. Compounding the issue, lead aggregators
                  like HomeAdvisor adjust lead pricing and placement based on review
                  scores, creating a double penalty for lower-rated businesses.
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
                  How Reach Them AI Grows Your Home Services Business
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Our platform is built to understand the unique challenges home service
                  professionals face — from seasonal review patterns to platform-specific
                  lead generation dynamics.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Wrench,
                    title: 'Trade-Specific Analysis',
                    description:
                      'Our AI understands the difference between a legitimate plumbing complaint and an unreasonable expectation. We flag reviews that violate platform policies while respecting valid customer feedback.',
                  },
                  {
                    icon: ShieldAlert,
                    title: 'Multi-Platform Defense',
                    description:
                      'We manage your reputation simultaneously across Google, Angi, HomeAdvisor, Yelp, and BBB — ensuring a consistent, accurate representation of your work quality everywhere homeowners look.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Lead Impact Tracking',
                    description:
                      'See the direct correlation between your review improvements and lead volume. Our dashboard tracks how rating changes on each platform impact your phone calls and booking requests.',
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
                  Platforms We Monitor for Home Services
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Homeowners check multiple platforms before hiring. We protect your
                  reputation on every site that generates leads for your trade.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <Hammer className="h-6 w-6 text-primary-600 mb-3" />
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
                The Revenue Impact of Reviews on Home Service Businesses
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300">
                  For home service professionals, online reviews have replaced the
                  word-of-mouth referrals that once drove the industry. BrightLocal
                  research shows that 88% of homeowners trust online reviews as much as
                  a recommendation from a friend or neighbor. This means your digital
                  reputation is effectively your referral network — but one that&apos;s
                  visible to thousands of potential customers simultaneously. A single
                  unfair one-star review can offset the positive impact of five
                  five-star reviews when it comes to your overall rating, and
                  homeowners consistently report that they weight negative reviews more
                  heavily than positive ones when making hiring decisions.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  The financial math is stark: home service businesses with 4+ star
                  ratings receive approximately twice the call volume of competitors
                  rated below 4 stars. For an HVAC company where the average service
                  ticket is $300-$500 and installation projects range from $5,000 to
                  $15,000, the difference between a 4.5 and a 3.8 star rating can
                  represent $100,000+ in lost annual revenue. On lead platforms like
                  Angi and HomeAdvisor, lower-rated businesses also pay more per lead
                  while receiving fewer of them — creating a punishing cycle where
                  review damage increases your customer acquisition costs at the same
                  time it reduces your volume.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Remove reviews from customers who never hired your business',
                  'Flag policy-violating content across Google, Angi, and Yelp',
                  'Monitor seasonal review trends that impact peak-season bookings',
                  'Track lead volume correlation with rating improvements',
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
                Protect Your Home Services Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Don&apos;t let unfair reviews cost you jobs. Get a free assessment
                and see which reviews on your profile qualify for removal.
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
