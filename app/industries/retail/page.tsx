import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import {
  ArrowRight,
  ShoppingCart,
  Star,
  TrendingDown,
  Search,
  Package,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Reputation Management for Retail & E-commerce | Reach Them AI',
  description:
    'Protect your retail or e-commerce brand from negative reviews on Google, Amazon, Trustpilot, and BBB. 93% of consumers say reviews influence purchasing — manage yours proactively.',
  keywords: [
    'retail reputation management',
    'e-commerce review management',
    'Amazon review removal',
    'Trustpilot review management',
    'online store reviews',
    'retail negative reviews',
    'e-commerce brand reputation',
    'product review management',
  ],
  openGraph: {
    title: 'Reputation Management for Retail & E-commerce | Reach Them AI',
    description:
      '93% of consumers say reviews influence purchasing decisions. Protect your retail brand on Google, Amazon, Trustpilot, and more.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Retail & E-commerce Reputation Management',
  description:
    'AI-powered reputation management for retail stores and e-commerce brands. Monitor and manage reviews across Google, Amazon, Trustpilot, BBB, and Facebook.',
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
    icon: Star,
    value: '93%',
    label: 'of consumers say online reviews influence their purchasing decisions when shopping for products',
    source: 'Podium Consumer Survey',
  },
  {
    icon: TrendingDown,
    value: '57%',
    label: 'less conversion for products with a 3-star average rating compared to those rated 4.5 stars or above',
    source: 'Spiegel Research Center',
  },
  {
    icon: Search,
    value: '79%',
    label: 'of shoppers trust online reviews as much as personal recommendations from friends and family',
    source: 'BrightLocal Consumer Survey',
  },
  {
    icon: ShoppingCart,
    value: '$2.8B',
    label: 'estimated annual revenue lost by U.S. retailers due to negative product reviews and low star ratings',
    source: 'PowerReviews Research',
  },
];

const painPoints = [
  {
    icon: Package,
    title: 'Product Quality Complaints',
    description:
      'In retail and e-commerce, product reviews are the first thing shoppers check before clicking "Add to Cart." A wave of complaints about product quality — even when limited to a single batch defect — can tank an otherwise strong product listing. On Amazon, a product that drops below 4.0 stars loses its organic search visibility dramatically, pushing it off the first page where 70% of all purchases happen.',
  },
  {
    icon: ShoppingCart,
    title: 'Shipping & Fulfillment Issues',
    description:
      'Late deliveries, damaged packages, and lost shipments generate the most emotionally charged reviews in e-commerce. These reviews are often left within minutes of a negative delivery experience, giving businesses little time to intervene. During peak seasons like holidays and sales events, shipping issues compound rapidly and can generate dozens of negative reviews in a single week.',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refund Disputes',
    description:
      'Return policies are a constant source of friction. Customers who feel a return was denied unfairly or a refund took too long frequently escalate their frustration to public review platforms. These reviews are particularly damaging because they signal to future buyers that "if something goes wrong, this store won\'t make it right" — a trust-breaking message that directly impacts conversion rates.',
  },
  {
    icon: Headphones,
    title: 'Customer Service Failures',
    description:
      'When customers cannot reach support, receive scripted responses, or feel their issue was not resolved, they turn to review platforms as a last resort. Customer service reviews tend to be the most detailed and emotional, making them highly influential. A single "they wouldn\'t help me" review can undo the goodwill built by hundreds of positive product reviews.',
  },
];

const platforms = [
  { name: 'Google Business Profile', description: 'Essential for brick-and-mortar retail stores and local shopping searches' },
  { name: 'Amazon', description: 'The dominant marketplace — product reviews directly control Buy Box eligibility and search ranking' },
  { name: 'Trustpilot', description: 'The leading independent review platform for e-commerce brands, often appearing in Google search results' },
  { name: 'Better Business Bureau (BBB)', description: 'Accreditation and reviews that signal legitimacy to cautious consumers' },
  { name: 'Facebook', description: 'Social proof that reaches customers in their daily feed and influences purchasing decisions' },
];

export default function RetailPage() {
  return (
    <>
      <Script
        id="retail-jsonld"
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
                Retail & E-commerce
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Retail &amp; E-commerce Brands
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                93% of consumers say reviews influence their purchasing decisions. In retail, your
                star rating is not just a vanity metric — it is a direct predictor of revenue,
                conversion rates, and long-term customer lifetime value.
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
                Why Reviews Make or Break Retail Businesses
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
                In retail and e-commerce, reviews are the digital equivalent of word-of-mouth. They
                determine whether a shopper adds your product to their cart or scrolls to a competitor.
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
                Common Reputation Challenges for Retailers
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Retail businesses face a volume challenge that most other industries do not:
                hundreds or thousands of transactions per week, each one an opportunity for a
                review. Even a 1% dissatisfaction rate can generate significant negative review
                volume at scale.
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
                How Negative Reviews Destroy Retail Revenue
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                In retail and e-commerce, the relationship between reviews and revenue is direct and
                quantifiable. Unlike service industries where trust is built through relationships,
                retail purchasing decisions happen in seconds — and reviews are the tipping point.
              </p>
              <div className="mt-8 space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Product Listing Suppression</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    On Amazon, products that fall below 4.0 stars lose algorithmic visibility. They
                    appear lower in search results, become ineligible for certain advertising
                    placements, and may lose Buy Box rotation. This creates a death spiral: fewer
                    views mean fewer sales, fewer sales mean fewer positive reviews, and the listing
                    continues to decline.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Cart Abandonment Correlation</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Research from the Baymard Institute shows that 18% of cart abandonment is driven
                    by trust concerns. When shoppers see negative reviews during their checkout
                    research — even after adding a product to their cart — many abandon the purchase.
                    For an e-commerce store doing $1M annually, that is $180,000 in recoverable
                    revenue tied directly to trust signals.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Brand Switching Acceleration</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Retail shoppers have near-zero switching costs. If your product has 3.5 stars and
                    a competitor offers a similar product at 4.6 stars, 82% of shoppers will choose
                    the higher-rated option — even at a higher price point. Negative reviews do not
                    just lose you one sale; they hand your customer to a competitor permanently.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-lg text-slate-300 leading-relaxed">
                See the full data on how reviews impact business revenue in our{' '}
                <Link
                  href="/negative-reviews-impact"
                  className="text-primary-400 font-medium hover:underline"
                >
                  detailed negative reviews impact guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Platforms */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Key Review Platforms for Retail &amp; E-commerce
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Retail brands must manage their reputation across marketplaces, search engines, and
                social platforms. Each platform has different policies and impact on your bottom line.
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
                How Reach Them AI Protects Retail Brands
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Our platform is designed for the high-volume, multi-platform reality of retail
                reputation management. Whether you are a single Shopify store or a national chain
                with hundreds of locations, we scale with you.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Multi-platform monitoring across Google, Amazon, Trustpilot, BBB, and Facebook — all in a single dashboard with real-time alerts.',
                  'AI-powered policy violation detection that identifies fake reviews, competitor sabotage, and reviews that violate platform guidelines.',
                  'Automated review response workflows that maintain your brand voice while responding at the speed your customers expect.',
                  'Review generation campaigns that turn your happiest customers into your most powerful marketing channel.',
                  'Competitive benchmarking that shows exactly how your review profile compares to your top competitors across every platform.',
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
                New to reputation management?{' '}
                <Link
                  href="/what-is-online-reputation-management"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Learn what Online Reputation Management is and why it matters
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary-600">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Protect Your Retail Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Every negative review is a lost sale. Get a free assessment and find out how many
                of your harmful reviews qualify for removal — before they cost you another customer.
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
