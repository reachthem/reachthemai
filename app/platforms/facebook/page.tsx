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
  Users,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Facebook Review Removal Service | Remove Negative Facebook Reviews | Reach Them AI',
  description:
    'Remove fake and policy-violating Facebook reviews and recommendations. With 2.9B active users, Facebook reviews influence purchasing decisions across every industry. Expert community standards navigation.',
  keywords: [
    'Facebook review removal',
    'remove Facebook reviews',
    'Facebook recommendations',
    'fake Facebook reviews',
    'Facebook community standards',
    'negative Facebook review removal',
    'Facebook business page reviews',
    'Facebook rating removal',
  ],
  openGraph: {
    title: 'Facebook Review Removal Service | Reach Them AI',
    description:
      'Expert Facebook review removal. Navigate Facebook\'s community standards and reporting systems to remove harmful reviews from your business page.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Facebook Review Removal Service',
  description:
    'Professional service for removing fake and policy-violating Facebook reviews and recommendations from business pages.',
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
    title: 'Fake Accounts & Bot Reviews',
    description:
      'Recommendations posted by accounts with no genuine activity, newly created profiles, or coordinated inauthentic behavior designed to manipulate your page\'s rating.',
  },
  {
    icon: AlertTriangle,
    title: 'Hate Speech & Bullying',
    description:
      'Facebook\'s Community Standards prohibit content that attacks individuals based on protected characteristics or systematically bullies and harasses business owners or staff.',
  },
  {
    icon: Flag,
    title: 'Violence & Criminal Activity',
    description:
      'Reviews containing credible threats of violence, incitement of harm, or content that promotes or coordinates illegal activities targeting your business.',
  },
  {
    icon: ShieldCheck,
    title: 'Spam & Misleading Content',
    description:
      'Repetitive recommendations from the same user network, copy-pasted reviews, or content designed to artificially lower your page\'s recommendation percentage.',
  },
  {
    icon: Users,
    title: 'Non-Customer Reviews',
    description:
      'Recommendations from individuals who never visited your business, purchased your products, or had any legitimate interaction with your company.',
  },
  {
    icon: MessageSquare,
    title: 'Intellectual Property Violations',
    description:
      'Reviews containing stolen photos, copyrighted material, or counterfeit claims about your brand\'s products or services.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'Recommendation Audit',
    description:
      'We review every recommendation on your Facebook business page, cross-referencing reviewer profiles to identify fake accounts and verifying whether the reviewer had a genuine customer interaction.',
  },
  {
    step: '02',
    title: 'Report to Facebook',
    description:
      'We report each violating recommendation through Facebook\'s dedicated business reporting tools, specifying the Community Standard that was breached and providing contextual evidence.',
  },
  {
    step: '03',
    title: 'Appeals & Escalation',
    description:
      'If Facebook\'s initial review does not result in removal, we submit formal appeals through the Oversight Board process or escalate via Facebook\'s business support channels.',
  },
  {
    step: '04',
    title: 'Page Optimization',
    description:
      'While removals are processed, we advise on best practices to improve your recommendation ratio, including turning recommendations on and off strategically and managing your page settings.',
  },
];

const faqs = [
  {
    question: 'Can I turn off Facebook reviews entirely?',
    answer:
      'Yes, Facebook allows business page administrators to disable the Recommendations feature entirely. However, this removes all reviews — positive and negative — which eliminates valuable social proof. We recommend targeted removal of violating reviews rather than disabling the feature.',
  },
  {
    question: 'How did Facebook change from star ratings to recommendations?',
    answer:
      'In 2018, Facebook replaced the traditional 1–5 star rating system with a binary "Recommend / Don\'t Recommend" format. This means every negative recommendation has an outsized impact on your overall score. A few malicious "Don\'t Recommend" posts can significantly lower your percentage even if you have hundreds of positive ones.',
  },
  {
    question: 'How long does Facebook take to process a removal request?',
    answer:
      'Facebook typically reviews reported content within 1 to 2 weeks. Straightforward Community Standards violations like hate speech or fake accounts are processed faster. More nuanced cases may require appeals that extend the timeline.',
  },
  {
    question: 'Does Facebook prioritize business page reports?',
    answer:
      'Facebook processes reports from business page administrators through the same content moderation system as all other reports. However, providing clear evidence of Community Standards violations — rather than simply stating you disagree with a review — significantly increases the likelihood of successful removal.',
  },
];

export default function FacebookReviewsPage() {
  return (
    <>
      <Script
        id="facebook-reviews-jsonld"
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
                  style={{ backgroundColor: '#1877F2' }}
                />
                Facebook Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Remove Harmful Facebook Reviews &amp; Recommendations
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                With 2.9 billion active users, Facebook is where your customers
                discover, evaluate, and recommend businesses to friends and
                family. Fake or malicious recommendations damage trust at scale —
                we help you reclaim control.
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
                  { stat: '2.9B', label: 'Monthly active users worldwide' },
                  { stat: '66%', label: 'Of users visit a local business page weekly' },
                  { stat: '2x', label: 'More likely to share negative experiences on Facebook' },
                  { stat: '1–2 Weeks', label: 'Typical removal timeline' },
                ].map((item) => (
                  <div key={item.label} className="p-6">
                    <div className="text-3xl font-bold text-primary-600">{item.stat}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Facebook Reviews Matter */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                The Power of Facebook Recommendations for Business
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  Facebook&apos;s recommendation system is unlike traditional review platforms because it
                  is embedded directly within the world&apos;s largest social network. When a user recommends
                  your business, that endorsement can appear in the news feeds of their friends and family,
                  creating organic word-of-mouth amplification at a scale no other platform can match. A
                  single positive recommendation can reach hundreds of people in your target market.
                </p>
                <p>
                  The flip side is equally powerful: a negative recommendation is socially visible. When
                  someone posts &ldquo;No, I don&apos;t recommend&rdquo; your business, their friends see
                  it. This social amplification means that even one malicious or fake recommendation carries
                  significantly more weight than a similar review on an anonymous platform. The personal
                  trust that Facebook connections carry makes negative recommendations particularly damaging
                  to local and community-focused businesses.
                </p>
                <p>
                  Facebook&apos;s shift to a binary recommend/don&apos;t-recommend system in 2018 further
                  amplified the impact of each individual post. Under the old star-rating system, a
                  three-star review was mixed but not devastating. Now, every review is either a full
                  endorsement or a rejection. This binary nature means that businesses need a higher volume
                  of positive recommendations to maintain a strong page score, and a coordinated attack of
                  &ldquo;Don&apos;t Recommend&rdquo; posts can rapidly undermine years of earned trust.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Facebook Community Standards Violations We Address
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Facebook&apos;s Community Standards provide a framework for removing harmful content.
                  We systematically identify and report recommendations that cross these lines.
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
                Our Facebook Review Removal Process
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
                  <strong>Typical timeline:</strong> 1–2 weeks for standard Community Standards
                  violations. Appeals to the Oversight Board may extend the process.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About Facebook Review Removal
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
                Related Resources
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
                Remove Your Negative Facebook Reviews
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Your Facebook page is often the first place customers check before visiting.
                Let our team remove harmful recommendations and restore your reputation on the
                world&apos;s largest social network.
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
