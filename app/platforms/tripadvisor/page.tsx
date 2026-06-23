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
  MapPin,
  Utensils,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'TripAdvisor Review Removal Service | Remove Negative TripAdvisor Reviews | Reach Them AI',
  description:
    'Remove fake and policy-violating TripAdvisor reviews. With 463M monthly users and over 1 billion reviews, TripAdvisor dominates hospitality decisions. Expert fraud detection navigation and management response strategies.',
  keywords: [
    'TripAdvisor review removal',
    'remove TripAdvisor reviews',
    'TripAdvisor fraud detection',
    'fake TripAdvisor reviews',
    'TripAdvisor content policy',
    'negative TripAdvisor review removal',
    'hotel review removal',
    'restaurant review removal TripAdvisor',
  ],
  openGraph: {
    title: 'TripAdvisor Review Removal Service | Reach Them AI',
    description:
      'Expert TripAdvisor review removal for hotels, restaurants, and attractions. Navigate TripAdvisor\'s fraud detection and content policies.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'TripAdvisor Review Removal Service',
  description:
    'Professional service for removing fake and policy-violating TripAdvisor reviews for hotels, restaurants, and tourism businesses.',
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
    title: 'Blackmail & Extortion Reviews',
    description:
      'TripAdvisor explicitly prohibits reviews used as leverage to extract free services, upgrades, or refunds from hospitality businesses — a common tactic known as "review blackmail."',
  },
  {
    icon: AlertTriangle,
    title: 'Second-Hand Experiences',
    description:
      'Reviews written based on someone else\'s experience — a friend\'s stay, a family member\'s meal — rather than the reviewer\'s own firsthand visit. TripAdvisor requires personal experience.',
  },
  {
    icon: Flag,
    title: 'Competitor-Posted Reviews',
    description:
      'Reviews planted by competing hotels, restaurants, or tour operators to damage your ranking in TripAdvisor\'s popularity index and divert bookings to their properties.',
  },
  {
    icon: ShieldCheck,
    title: 'Outdated Property Complaints',
    description:
      'Reviews referencing issues at a property under previous ownership or management that have since been fully resolved through renovations, staff changes, or operational improvements.',
  },
  {
    icon: MapPin,
    title: 'Wrong Location Reviews',
    description:
      'Reviews posted on your listing that actually describe a different property, restaurant, or attraction — a surprisingly common error that unfairly impacts your rating.',
  },
  {
    icon: Utensils,
    title: 'Non-Guest Opinions',
    description:
      'Reviews from individuals who never stayed at your hotel, ate at your restaurant, or visited your attraction but post opinions based on external factors like parking availability or neighborhood appearance.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'Hospitality-Specific Review Audit',
    description:
      'We analyze your TripAdvisor listing in the context of hospitality industry patterns, identifying fake reviews, competitor activity, and content that violates TripAdvisor\'s specific guidelines for travel businesses.',
  },
  {
    step: '02',
    title: 'Management Center Reporting',
    description:
      'Through TripAdvisor\'s Management Center, we submit detailed dispute reports with evidence for each violating review, specifying the exact guideline breach and attaching supporting documentation.',
  },
  {
    step: '03',
    title: 'Fraud Investigation Request',
    description:
      'For suspected coordinated attacks or competitor sabotage, we request a formal fraud investigation from TripAdvisor\'s dedicated content integrity team, which has specialized tools to detect review manipulation.',
  },
  {
    step: '04',
    title: 'Management Response Optimization',
    description:
      'While removals are processed, we craft professional management responses that demonstrate your commitment to guest satisfaction, mitigating damage from reviews still under investigation.',
  },
];

const faqs = [
  {
    question: 'How does TripAdvisor detect fake reviews?',
    answer:
      'TripAdvisor employs a sophisticated fraud detection system that analyzes patterns including reviewer IP addresses, booking history, review timing, device fingerprints, and linguistic analysis. They also maintain a team of human investigators who review flagged content. Their system catches an estimated 2 million fraudulent reviews annually before they\'re published.',
  },
  {
    question: 'Can TripAdvisor remove a review if the guest actually stayed at my property?',
    answer:
      'Yes, if the review violates TripAdvisor\'s content guidelines — even if the guest had a genuine stay. Reviews containing threats, personal attacks on staff members, discriminatory language, or content used as blackmail leverage can be removed regardless of whether the reviewer was a real guest.',
  },
  {
    question: 'How does my TripAdvisor ranking affect bookings?',
    answer:
      'TripAdvisor\'s popularity index directly impacts your visibility to the 463 million monthly users searching for hotels and restaurants. Properties in the top 10% of their market receive up to 56% more booking inquiries. A drop of even a few positions can represent thousands of dollars in lost revenue during peak seasons.',
  },
  {
    question: 'What is TripAdvisor\'s timeline for reviewing flagged content?',
    answer:
      'Standard content reviews take 2 to 4 weeks. Fraud investigation requests involving coordinated attacks or sustained review manipulation may take longer as TripAdvisor conducts deeper analysis. We maintain consistent follow-up to ensure cases don\'t stall in the review queue.',
  },
];

export default function TripAdvisorReviewsPage() {
  return (
    <>
      <Script
        id="tripadvisor-reviews-jsonld"
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
                  style={{ backgroundColor: '#34E0A1' }}
                />
                TripAdvisor Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Protect Your Hospitality Reputation on TripAdvisor
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                TripAdvisor reaches 463 million monthly users and hosts over one
                billion reviews — making it the world&apos;s largest travel
                platform. For hotels, restaurants, and attractions, your
                TripAdvisor ranking directly drives bookings and revenue.
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
                  { stat: '463M', label: 'Monthly unique users' },
                  { stat: '1B+', label: 'Reviews and opinions' },
                  { stat: '8.6M', label: 'Hospitality listings worldwide' },
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

          {/* Why TripAdvisor Matters */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                Why TripAdvisor Is the Backbone of Hospitality Marketing
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  In the hospitality industry, TripAdvisor occupies a position no other platform can match.
                  Travelers planning vacations, business trips, and dining experiences treat TripAdvisor as
                  their primary research tool — reading an average of 9 reviews before booking a hotel and
                  6 reviews before choosing a restaurant. This means your TripAdvisor presence isn&apos;t
                  supplementary to your marketing; for many travelers, it <em>is</em> your marketing.
                </p>
                <p>
                  The platform&apos;s Popularity Index ranks every property against its local competitors,
                  creating a visible leaderboard that travelers use as a shortcut for decision-making. Hotels
                  ranked in the top 10 of their market on TripAdvisor receive dramatically more direct booking
                  inquiries and can command higher average daily rates. Research indicates that a one-point
                  increase in TripAdvisor score allows hotels to increase prices by 11.2% without losing
                  occupancy — a direct and measurable impact on revenue.
                </p>
                <p>
                  For restaurants, TripAdvisor serves as a discovery engine. Tourists rely almost exclusively
                  on the platform when choosing where to eat in unfamiliar cities. A restaurant ranked
                  outside the top 20 in a mid-size city may as well be invisible to tourist traffic. This
                  makes every negative review a potential ranking killer, especially for smaller establishments
                  with fewer total reviews where a single one-star post carries disproportionate weight.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  TripAdvisor Guideline Violations We Identify
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  TripAdvisor&apos;s content guidelines are tailored to the hospitality industry.
                  We identify violations unique to travel and dining reviews.
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
                Our TripAdvisor Review Removal Process
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
              <div className="mt-12 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <p className="text-emerald-800 dark:text-emerald-300">
                  <strong>Typical timeline:</strong> 2–4 weeks. Fraud investigations
                  involving coordinated attacks may require additional analysis time.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About TripAdvisor Review Removal
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
                Hospitality Reputation Resources
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
                Remove Your Negative TripAdvisor Reviews
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Your TripAdvisor ranking is your competitive edge in hospitality. Let our
                specialists identify every removable review and restore your property&apos;s
                position in the Popularity Index — starting with a free analysis.
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
