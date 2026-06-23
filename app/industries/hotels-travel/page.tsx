import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import {
  ArrowRight,
  Hotel,
  Star,
  TrendingDown,
  Search,
  ShieldAlert,
  Bed,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Plane,
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Reputation Management for Hotels & Travel | Reach Them AI',
  description:
    'Protect your hotel, resort, or travel business from negative reviews on Google, TripAdvisor, Booking.com, and Expedia. 81% of travelers always read reviews before booking — manage yours proactively.',
  keywords: [
    'hotel reputation management',
    'travel review management',
    'TripAdvisor review removal',
    'hotel negative reviews',
    'Booking.com review management',
    'Expedia reputation management',
    'hospitality reviews',
    'hotel online reputation',
  ],
  openGraph: {
    title: 'Reputation Management for Hotels & Travel | Reach Them AI',
    description:
      '81% of travelers always read reviews before booking. Protect your hospitality brand on Google, TripAdvisor, Booking.com, and Expedia.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Hotel & Travel Reputation Management',
  description:
    'AI-powered reputation management for hotels, resorts, vacation rentals, and travel companies. Monitor and manage reviews across TripAdvisor, Booking.com, Google, and more.',
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
    value: '81%',
    label: 'of travelers always read reviews before booking a hotel, and the average guest reads 6–12 reviews before making a reservation',
    source: 'TripAdvisor Travel Insights',
  },
  {
    icon: Star,
    value: '11%',
    label: 'pricing power increase for every one-point improvement in review score — higher ratings let you charge more and maintain occupancy',
    source: 'Cornell Hospitality Research',
  },
  {
    icon: TrendingDown,
    value: '33%',
    label: 'of travelers will not book a hotel with fewer than 4 stars, regardless of price, location, or amenities offered',
    source: 'TrustYou Guest Feedback Study',
  },
  {
    icon: Hotel,
    value: '76%',
    label: 'of travelers willing to pay more for a hotel with higher review scores — review quality directly translates to revenue per available room',
    source: 'Expedia Group Research',
  },
];

const painPoints = [
  {
    icon: Bed,
    title: 'Room Quality Expectations',
    description:
      'Hotels face a unique challenge: guests arrive with expectations set by professional photos and marketing copy, then judge reality against that idealized version. A room that is perfectly clean and functional but does not match the glossy website photos generates complaints about "false advertising." Seasonal wear, renovation gaps between floors, and room-type variations all create mismatches that fuel negative reviews even at well-maintained properties.',
  },
  {
    icon: ShieldAlert,
    title: 'Service Inconsistency',
    description:
      'Hospitality is a 24/7 operation staffed by multiple shifts and seasonal employees. A guest who receives exceptional service at check-in but encounters an unhelpful night shift employee will focus their review on the negative interaction. Staffing challenges, training gaps, and the inherent variability of human service delivery mean that even five-star properties receive service complaints that become permanent fixtures on review platforms.',
  },
  {
    icon: Sparkles,
    title: 'Cleanliness Standards',
    description:
      'Post-pandemic travelers hold cleanliness to an unprecedented standard. A single review mentioning "dirty bathroom" or "stained sheets" can override hundreds of positive reviews in the minds of prospective guests. Cleanliness reviews are the most frequently searched and filtered review category on every major travel platform — meaning one bad cleanliness review gets disproportionate visibility.',
  },
  {
    icon: CreditCard,
    title: 'Pricing and Value Perception',
    description:
      'Dynamic pricing, resort fees, parking charges, and incidental holds create friction points that generate negative reviews. Guests who feel they paid a premium but received an average experience direct their frustration at the price, not the product. During peak seasons and events when rates naturally spike, the gap between expectations and perceived value widens further, driving review scores downward.',
  },
];

const platforms = [
  { name: 'Google Business Profile', description: 'The starting point for most hotel searches — Google Maps reviews directly influence booking decisions' },
  { name: 'TripAdvisor', description: 'The most influential travel review platform with 463 million monthly visitors researching hotels and destinations' },
  { name: 'Booking.com', description: 'Only verified guest reviews — high trust signal that directly affects your platform ranking and visibility' },
  { name: 'Expedia', description: 'One of the largest OTA platforms where review scores influence search sort order and featured placement' },
  { name: 'Yelp', description: 'Important for boutique hotels, B&Bs, and properties that attract local diners and event guests' },
];

export default function HotelsTravelPage() {
  return (
    <>
      <Script
        id="hotels-travel-jsonld"
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
                Hotels & Travel
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Hotels &amp; Travel
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                81% of travelers always read reviews before booking. In hospitality, a one-point
                improvement in your review score unlocks 11% pricing power — making your online
                reputation the single most valuable asset on your balance sheet.
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
                Why Reviews Dominate the Hospitality Industry
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
                Hotels and travel companies operate in the most review-dependent industry in the
                world. Guests cannot try before they buy — reviews are the only preview they have
                of the experience that awaits them.
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
                Common Reputation Challenges for Hotels &amp; Travel
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Hospitality businesses deliver experiential products that are inherently subjective.
                What delights one guest disappoints another. These are the most frequent sources of
                negative reviews in the travel industry.
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
                The Revenue Impact of Reviews in Hospitality
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                In few industries is the connection between reviews and revenue as well-documented
                as hospitality. Cornell University&apos;s landmark research proved that a one-point
                increase in a hotel&apos;s review score (on a 5-point scale) correlates with an 11.2%
                increase in average daily rate — without any decrease in occupancy.
              </p>
              <div className="mt-8 space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">OTA Ranking Algorithm Impact</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    On Booking.com, TripAdvisor, and Expedia, your review score is a primary input
                    into the search ranking algorithm. Hotels with higher scores appear first when
                    travelers filter by destination and dates. A 0.5-point difference in review score
                    can mean the difference between appearing on page one and being buried on page
                    three — where fewer than 5% of travelers ever look.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">RevPAR and Competitive Set Positioning</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Revenue per available room (RevPAR) is the hospitality industry&apos;s key
                    performance metric. Properties with review scores above their competitive set
                    average consistently outperform on RevPAR by 8–15%. Conversely, hotels with
                    below-average review scores must discount rates to maintain occupancy, compressing
                    margins and entering a downward spiral that is difficult to reverse.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Group and Event Business Loss</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Corporate event planners and wedding coordinators conduct extensive review research
                    before recommending venues. A hotel with strong facilities but a 3.7-star rating
                    will be passed over in favor of a 4.5-star competitor — even at a higher price
                    point. Group bookings represent the highest-margin revenue for most hotels, making
                    review-driven losses particularly painful.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-lg text-slate-300 leading-relaxed">
                Dive deeper into how negative reviews affect business revenue in our{' '}
                <Link
                  href="/negative-reviews-impact"
                  className="text-primary-400 font-medium hover:underline"
                >
                  comprehensive impact analysis
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Platforms */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Key Review Platforms for Hotels &amp; Travel
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Hospitality properties must manage their reputation across more review platforms
                than any other industry. Each platform has different review policies, audiences, and
                impact on your bookings.
              </p>
              <div className="mt-10 grid gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Plane className="h-5 w-5 text-primary-600 dark:text-primary-400" />
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
                How Reach Them AI Protects Hospitality Reputations
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Our platform is purpose-built for the multi-platform, high-volume reality of
                hospitality reputation management. From boutique inns to international hotel chains,
                we provide the tools to protect and grow your review scores.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Unified dashboard monitoring across Google, TripAdvisor, Booking.com, Expedia, and Yelp with real-time alerts for new reviews.',
                  'AI analysis that identifies reviews violating platform policies — including fake reviews from competitors, reviews from non-guests, and content that contains defamatory claims.',
                  'Hospitality-specific response templates that address common guest concerns professionally while encouraging future guests to book with confidence.',
                  'Post-stay review generation campaigns that capture positive guest sentiment at checkout, turning satisfied visitors into five-star advocates.',
                  'Sentiment trend analysis showing how your review profile evolves over time, with seasonal patterns and competitive benchmarking against your local market.',
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
                Explore the fundamentals of reputation strategy in our{' '}
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
                Protect Your Hotel &amp; Travel Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Every unfair negative review is a booking lost to a competitor. Get a free assessment
                and discover how many of your harmful reviews qualify for removal — and how much
                revenue you can recover.
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
