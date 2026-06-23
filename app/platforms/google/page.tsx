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
  BarChart3,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Google Review Removal Service | Remove Negative Google Reviews | Reach Them AI',
  description:
    'Remove fake, defamatory, and policy-violating Google reviews. Google hosts 73% of all online reviews. Our experts navigate Google\'s flagging and legal request processes to protect your business reputation.',
  keywords: [
    'Google review removal',
    'remove Google reviews',
    'delete Google review',
    'flag Google review',
    'Google Business Profile reviews',
    'fake Google reviews',
    'Google review policy violations',
    'negative Google review removal',
  ],
  openGraph: {
    title: 'Google Review Removal Service | Reach Them AI',
    description:
      'Expert Google review removal. We help businesses remove fake, defamatory, and policy-violating reviews from Google Business Profile.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Google Review Removal Service',
  description:
    'Professional service for removing fake, defamatory, and policy-violating Google reviews from Google Business Profile listings.',
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
    title: 'Spam & Fake Reviews',
    description:
      'Reviews posted by bots, competitors, or individuals who never interacted with your business. Google prohibits deceptive content designed to manipulate ratings.',
  },
  {
    icon: AlertTriangle,
    title: 'Off-Topic Content',
    description:
      'Reviews that discuss personal grievances, political opinions, or topics unrelated to the actual customer experience at your location.',
  },
  {
    icon: ShieldCheck,
    title: 'Conflict of Interest',
    description:
      'Reviews written by current or former employees, competitors, or business owners reviewing their own establishment to inflate or deflate ratings.',
  },
  {
    icon: Flag,
    title: 'Restricted & Illegal Content',
    description:
      'Reviews containing threats, hate speech, sexually explicit material, personally identifiable information, or content promoting illegal activities.',
  },
  {
    icon: Users,
    title: 'Impersonation Reviews',
    description:
      'Content posted under false identities or by individuals pretending to be someone else to mislead other consumers about their experience.',
  },
  {
    icon: BarChart3,
    title: 'Defamatory Statements',
    description:
      'Reviews containing provably false claims of fact that damage your business reputation, such as fabricated health code violations or criminal allegations.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'Review Analysis',
    description:
      'We audit every flagged review against Google\'s Content Policy, identifying specific policy violations and gathering supporting evidence.',
  },
  {
    step: '02',
    title: 'Flag via Business Profile',
    description:
      'We submit a detailed flag through your Google Business Profile dashboard, citing the exact policy the review violates with contextual evidence.',
  },
  {
    step: '03',
    title: 'Escalation & Legal Requests',
    description:
      'If initial flagging is unsuccessful, we escalate through Google\'s support channels or submit legal removal requests for defamatory content.',
  },
  {
    step: '04',
    title: 'Monitoring & Follow-Up',
    description:
      'We track each flagged review\'s status and follow up persistently until a decision is rendered, keeping you informed throughout the process.',
  },
];

const faqs = [
  {
    question: 'How long does it take Google to remove a flagged review?',
    answer:
      'Google typically processes flagged reviews within 1 to 3 weeks. Simple policy violations like spam or profanity are often resolved faster, while cases requiring manual review or legal assessment can take longer. We follow up on every case to expedite the process.',
  },
  {
    question: 'Can I remove a negative Google review just because I disagree with it?',
    answer:
      'No. Google only removes reviews that violate its content policies. A genuine negative opinion from a real customer, even if you believe it\'s unfair, is protected. However, many seemingly legitimate reviews actually contain policy violations when analyzed by an expert.',
  },
  {
    question: 'What happens if Google denies my removal request?',
    answer:
      'We pursue multiple avenues including re-flagging with additional evidence, escalating through Google Business Profile support, submitting formal appeals, and when applicable, filing legal removal requests under defamation or privacy laws.',
  },
  {
    question: 'Does responding to a Google review affect the removal process?',
    answer:
      'Responding professionally to reviews does not negatively impact the removal process and is actually recommended. A measured, empathetic owner response demonstrates to potential customers that you take feedback seriously, even while a removal request is pending.',
  },
];

export default function GoogleReviewsPage() {
  return (
    <>
      <Script
        id="google-reviews-jsonld"
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
                  style={{ backgroundColor: '#4285F4' }}
                />
                Google Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Remove Fake &amp; Policy-Violating Google Reviews
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                Google hosts 73% of all online reviews and 90% of consumers use
                it to discover local businesses. A single malicious review can
                cost you thousands in lost revenue. We help you fight back.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
                <Link
                  href="/free-assessment"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold hover:bg-slate-100 transition-colors min-w-[12rem]"
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
                  { stat: '73%', label: 'Of all online reviews are on Google' },
                  { stat: '90%', label: 'Of consumers use Google for local search' },
                  { stat: '4.1', label: 'Average star rating needed to appear in Local Pack' },
                  { stat: '1–3 Weeks', label: 'Typical removal timeline' },
                ].map((item) => (
                  <div key={item.label} className="p-6">
                    <div className="text-3xl font-bold text-primary-600">{item.stat}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Google Reviews Matter */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                Why Google Reviews Are Critical for Your Business
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  Google Business Profile is the single most influential review platform in the world.
                  When potential customers search for your business name, your Google listing — complete
                  with star rating, review count, and individual review snippets — appears directly in
                  search results and Google Maps. This means your Google reviews are often the very first
                  impression a consumer has of your brand, long before they visit your website or walk
                  through your door.
                </p>
                <p>
                  Research from BrightLocal shows that 87% of consumers read online reviews for local
                  businesses, and the vast majority of those reviews are found on Google. A business with
                  a rating below 4.0 stars risks being filtered out of the Google Local Pack — the prime
                  three-listing section that appears in local search results. Losing your Local Pack
                  placement can reduce inbound calls and direction requests by as much as 70%.
                </p>
                <p>
                  Negative reviews don&apos;t just affect consumer perception. Google&apos;s algorithm uses review
                  signals — including rating, volume, and recency — as a ranking factor. A surge of
                  negative reviews can directly impact your local SEO performance, pushing you below
                  competitors who maintain higher ratings. This makes proactive review management not
                  just a customer service concern but a core component of your digital marketing strategy.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Google Review Policy Violations We Target
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Google&apos;s Content Policy prohibits several categories of reviews. We identify
                  and document these violations to build the strongest possible removal case.
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
                Our Google Review Removal Process
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
              <div className="mt-12 flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <p className="text-blue-800 dark:text-blue-300">
                  <strong>Typical timeline:</strong> 1–3 weeks from submission to resolution, depending on
                  the complexity of the violation and Google&apos;s review queue.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About Google Review Removal
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
                Learn More About Reputation Management
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
                Remove Your Negative Google Reviews
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Don&apos;t let fake or unfair Google reviews drive customers to your competitors.
                Our experts will analyze your reviews at no cost and build a removal strategy
                tailored to your business.
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
