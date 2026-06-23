import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  Search,
  MessageCircle,
  PenLine,
  ShieldAlert,
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'What is Online Reputation Management? Complete Guide | Reach Them AI',
  description:
    'Learn what online reputation management (ORM) is, why it matters, and how businesses use ORM strategies to protect revenue, build trust, and grow. Complete guide with statistics and actionable insights.',
  keywords: [
    'what is online reputation management',
    'ORM definition',
    'online reputation management guide',
    'reputation management strategy',
    'business reputation',
    'review management',
    'ORM vs PR',
  ],
  openGraph: {
    title: 'What is Online Reputation Management? Complete Guide | Reach Them AI',
    description:
      'The definitive guide to online reputation management. Learn what ORM is, its key components, and why every business needs a proactive reputation strategy.',
    images: ['/featured.png'],
    type: 'article',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What is Online Reputation Management? Complete Guide',
  description:
    'Learn what online reputation management (ORM) is, why it matters, and how businesses use ORM strategies to protect revenue, build trust, and grow.',
  author: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://reachthem.ai/what-is-online-reputation-management',
  },
};

const components = [
  {
    icon: Star,
    title: 'Review Management',
    description:
      'Monitoring, responding to, and strategically managing customer reviews across Google, Yelp, Facebook, Trustpilot, and dozens of other platforms. This includes flagging policy-violating reviews for removal and encouraging satisfied customers to share their experiences.',
  },
  {
    icon: Search,
    title: 'Search Result Optimization',
    description:
      'Ensuring that the first page of Google for your brand name reflects accurate, positive, and relevant content. This involves suppressing harmful results and promoting authoritative pages you control.',
  },
  {
    icon: MessageCircle,
    title: 'Social Media Monitoring',
    description:
      'Tracking brand mentions, sentiment, and conversations across social platforms in real time. Early detection of negative sentiment allows you to respond before issues escalate into PR crises.',
  },
  {
    icon: PenLine,
    title: 'Content Creation & Promotion',
    description:
      'Publishing high-quality blog posts, case studies, press releases, and thought leadership content that builds authority, ranks in search engines, and shapes the narrative around your brand.',
  },
  {
    icon: ShieldAlert,
    title: 'Crisis Management',
    description:
      'Having a structured response plan for sudden reputation threats — viral negative posts, coordinated review attacks, or damaging news articles. Speed and strategy are critical during a crisis.',
  },
];

const stats = [
  {
    icon: Globe,
    value: '97%',
    label: 'of consumers read online reviews before making a purchase decision',
    source: 'BrightLocal Consumer Survey',
  },
  {
    icon: AlertTriangle,
    value: '22%',
    label: 'of potential customers lost when just one negative article appears on page one',
    source: 'Moz Research',
  },
  {
    icon: TrendingUp,
    value: '70%',
    label: 'of potential customers lost when four or more negative articles dominate search results',
    source: 'Moz Research',
  },
  {
    icon: Users,
    value: '53%',
    label: 'of customers expect businesses to respond to a negative review within one week',
    source: 'ReviewTrackers',
  },
];

const comparisonRows = [
  {
    dimension: 'Focus',
    orm: 'Online channels — reviews, search results, social media, forums',
    pr: 'Traditional media — newspapers, TV, magazines, press conferences',
  },
  {
    dimension: 'Speed',
    orm: 'Real-time monitoring and rapid response within hours',
    pr: 'Planned campaigns with longer lead times (weeks/months)',
  },
  {
    dimension: 'Control',
    orm: 'Direct ability to flag, respond to, and remove policy-violating content',
    pr: 'Relies on media relationships and editorial decisions',
  },
  {
    dimension: 'Measurement',
    orm: 'Quantifiable metrics — star ratings, sentiment scores, search rankings',
    pr: 'Harder to measure — impressions, ad equivalency, media mentions',
  },
  {
    dimension: 'Cost',
    orm: 'Scalable from DIY tools to managed services; pay-per-removal options',
    pr: 'Typically requires retainer fees with PR agencies ($5K–$25K+/month)',
  },
];

export default function WhatIsORMPage() {
  return (
    <>
      <Script
        id="orm-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar background="white" />
        <main>
          {/* Hero */}
          <section className="pt-32 pb-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-6">
                Complete Guide
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                What is Online Reputation Management?
              </h1>
              <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
                Your online reputation determines whether customers choose you or your competitor. This
                comprehensive guide explains what ORM is, why it matters, and how to build a strategy
                that protects your revenue and accelerates growth.
              </p>
            </div>
          </section>

          {/* Definition */}
          <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Defining Online Reputation Management
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Online Reputation Management (ORM) is the practice of strategically monitoring,
                influencing, and controlling how a business or individual is perceived across the
                internet. Unlike traditional marketing that pushes messages outward, ORM focuses on
                what people discover when they search for your brand — the reviews they read, the
                articles they find, and the social media conversations they encounter.
              </p>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                At its core, ORM bridges the gap between who you are and how you appear online. A
                single negative review on Google or a damaging news article can define your business
                in the eyes of thousands of potential customers. ORM gives you the tools and
                processes to ensure your digital footprint accurately reflects the quality of your
                products, services, and customer experience.
              </p>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Modern ORM combines technology — like AI-powered sentiment analysis and automated
                review monitoring — with human expertise in content strategy, crisis communication,
                and platform-specific policy knowledge. The result is a proactive system that detects
                threats early, responds quickly, and builds long-term brand equity across every
                channel where customers form opinions.
              </p>
            </div>
          </section>

          {/* Key Components */}
          <section className="py-24 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">
                Key Components of ORM
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-center max-w-2xl mx-auto">
                Effective reputation management is not a single tactic — it is an integrated strategy
                built on five essential pillars.
              </p>
              <div className="mt-12 grid gap-6">
                {components.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex items-start gap-5"
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

          {/* Statistics */}
          <section className="py-24 bg-[#182825] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                The Numbers Behind Online Reputation
              </h2>
              <p className="mt-4 text-lg text-slate-300 text-center max-w-2xl mx-auto">
                These statistics demonstrate why no business can afford to ignore its online
                reputation.
              </p>
              <div className="mt-12 grid sm:grid-cols-2 gap-8">
                {stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-primary-400" />
                      </div>
                      <span className="text-4xl font-extrabold text-primary-400">{stat.value}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{stat.label}</p>
                    <p className="mt-2 text-xs text-slate-500">— {stat.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ORM vs Traditional PR */}
          <section className="py-24 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                ORM vs. Traditional PR
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                While both disciplines aim to protect brand perception, ORM and traditional public
                relations differ in scope, speed, and methodology. Understanding these differences
                helps businesses allocate resources effectively.
              </p>
              <div className="mt-10 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="py-3 pr-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/5">
                        Dimension
                      </th>
                      <th className="py-3 px-4 text-sm font-semibold text-primary-600 dark:text-primary-400 w-2/5">
                        Online Reputation Management
                      </th>
                      <th className="py-3 pl-4 text-sm font-semibold text-slate-500 dark:text-slate-400 w-2/5">
                        Traditional PR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr
                        key={row.dimension}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        <td className="py-4 pr-4 font-medium text-slate-900 dark:text-white text-sm">
                          {row.dimension}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                          {row.orm}
                        </td>
                        <td className="py-4 pl-4 text-sm text-slate-600 dark:text-slate-400">
                          {row.pr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                The most effective approach combines both. Traditional PR builds broad awareness,
                while ORM ensures that the digital touchpoints customers actually use — search
                results, review sites, social platforms — consistently reinforce a positive brand
                image.
              </p>
            </div>
          </section>

          {/* Who Needs ORM */}
          <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Who Needs Online Reputation Management?
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                The short answer: every business that has customers. Whether you are a solo
                practitioner, a local restaurant, or a Fortune 500 company, people are forming
                opinions about your brand online right now — often before they ever speak with you
                directly.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: Building2,
                    title: 'Local Businesses',
                    text: 'Restaurants, medical practices, law firms, home services, and retail stores depend on Google Maps and local review sites. A drop from 4.5 to 3.8 stars can cut foot traffic by 30% or more.',
                  },
                  {
                    icon: BarChart3,
                    title: 'E-Commerce Brands',
                    text: 'Product reviews on Amazon, Trustpilot, and social media directly drive conversion rates. Shoppers compare star ratings across competitors before clicking "Buy."',
                  },
                  {
                    icon: Users,
                    title: 'Service Professionals',
                    text: 'Doctors, lawyers, accountants, and consultants rely on personal reputation. A single 1-star review can undermine years of professional credibility.',
                  },
                  {
                    icon: Globe,
                    title: 'Enterprise & SaaS',
                    text: 'B2B buyers check G2, Capterra, and Glassdoor before signing contracts. Employee reviews also influence talent acquisition and partnership opportunities.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                      <item.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Cost of Ignoring ORM */}
          <section className="py-24 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                The Cost of Ignoring Your Online Reputation
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Businesses that neglect ORM often do not realize the damage until it is too late.
                The consequences compound over time:
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  'Lost revenue — potential customers see negative reviews and choose a competitor, often without ever contacting you. Research shows that businesses risk losing up to 22% of revenue from a single negative article on page one.',
                  'Higher acquisition costs — when your star rating drops, you must spend more on paid advertising to generate the same number of leads, eroding profitability.',
                  'Talent drain — job seekers check Glassdoor and Indeed before applying. Companies with poor employer reputations pay up to 10% more per hire and experience higher turnover.',
                  'Partnership barriers — potential partners, vendors, and investors conduct due diligence online. Negative search results create friction and can kill deals before they begin.',
                  'Compounding damage — negative content does not disappear on its own. Without intervention, a few bad reviews can snowball as algorithms surface negative sentiment more prominently.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                The businesses that thrive long-term are those that treat their online reputation as
                a strategic asset — not an afterthought. Proactive monitoring and rapid response
                transform reputation from a vulnerability into a competitive moat. Learn more about
                the specific financial impact in our{' '}
                <Link
                  href="/negative-reviews-impact"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  guide to how negative reviews impact revenue
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 bg-[#182825] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Take Control of Your Online Reputation?
              </h2>
              <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                Whether you are dealing with unfair negative reviews or want to build a proactive
                reputation strategy, Reach Them AI can help. Get a free assessment and discover what
                is possible.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/free-assessment"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all"
                >
                  Get Your Free Assessment
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
