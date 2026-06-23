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
  Briefcase,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Glassdoor Review Removal Service | Remove Negative Glassdoor Reviews | Reach Them AI',
  description:
    'Remove fake and policy-violating Glassdoor reviews. With 55M monthly users, 86% of job seekers research employer reviews. Protect your employer brand and talent acquisition with expert Glassdoor review management.',
  keywords: [
    'Glassdoor review removal',
    'remove Glassdoor reviews',
    'Glassdoor employer brand',
    'fake Glassdoor reviews',
    'Glassdoor community guidelines',
    'negative Glassdoor review removal',
    'employer reputation management',
    'Glassdoor rating improvement',
  ],
  openGraph: {
    title: 'Glassdoor Review Removal Service | Reach Them AI',
    description:
      'Expert Glassdoor review removal. Protect your employer brand and talent acquisition by removing fake and policy-violating employee reviews.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Glassdoor Review Removal Service',
  description:
    'Professional service for removing fake and policy-violating Glassdoor reviews to protect employer brand and talent acquisition.',
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
    title: 'Non-Employee Reviews',
    description:
      'Reviews posted by individuals who were never employed by your company — including rejected applicants, vendors, or competitors posing as former employees to damage your employer brand.',
  },
  {
    icon: AlertTriangle,
    title: 'Confidential Information Disclosure',
    description:
      'Reviews that expose trade secrets, proprietary processes, client names, financial data, or other confidential business information protected under NDAs or employment agreements.',
  },
  {
    icon: Flag,
    title: 'Defamatory & False Statements',
    description:
      'Reviews containing provably false claims about company leadership, workplace conditions, or business practices — such as fabricated allegations of illegal activity or safety violations.',
  },
  {
    icon: ShieldCheck,
    title: 'Personal Attacks on Individuals',
    description:
      'Reviews that target specific employees by name with personal insults, threats, or accusations that go beyond professional critique and constitute harassment.',
  },
  {
    icon: Briefcase,
    title: 'Outdated Organizational Reviews',
    description:
      'Reviews describing conditions under entirely different leadership, ownership, or organizational structure that no longer reflect the current workplace environment.',
  },
  {
    icon: Users,
    title: 'Coordinated Review Campaigns',
    description:
      'Patterns of multiple negative reviews posted in a short timeframe, often following layoffs or disciplinary actions, that represent a coordinated effort rather than independent experiences.',
  },
];

const removalSteps = [
  {
    step: '01',
    title: 'Employer Profile Analysis',
    description:
      'We audit your entire Glassdoor employer profile — reviews, ratings, salary reports, and interview experiences — to identify content that violates Glassdoor\'s Community Guidelines.',
  },
  {
    step: '02',
    title: 'Flag Through Employer Center',
    description:
      'Using Glassdoor\'s Employer Center tools, we flag each violating review with detailed justification, specifying the exact Community Guideline breached and providing evidence.',
  },
  {
    step: '03',
    title: 'Content Moderation Escalation',
    description:
      'For reviews that require deeper investigation, we escalate to Glassdoor\'s content moderation team with comprehensive evidence packages including employment records and factual corrections.',
  },
  {
    step: '04',
    title: 'Employer Brand Recovery',
    description:
      'Beyond removals, we advise on strategies to improve your Glassdoor presence — including encouraging authentic employee reviews, optimizing your employer profile, and crafting professional responses.',
  },
];

const faqs = [
  {
    question: 'Can Glassdoor verify if a reviewer actually worked at my company?',
    answer:
      'Glassdoor requires reviewers to self-certify their employment status but does not verify employment with employers. However, if you provide evidence that a reviewer was never employed by your company — such as payroll records or HR documentation — Glassdoor\'s moderation team can investigate and remove reviews from non-employees.',
  },
  {
    question: 'Why are anonymous Glassdoor reviews so damaging?',
    answer:
      'Glassdoor\'s anonymity policy means that reviewers face no accountability for false statements. This creates an asymmetry where disgruntled individuals can post exaggerated or fabricated claims without consequence, while the business suffers reputational damage that impacts talent acquisition. 86% of job seekers read Glassdoor reviews before applying, meaning each negative review directly reduces your candidate pipeline.',
  },
  {
    question: 'How does a low Glassdoor rating affect hiring costs?',
    answer:
      'Companies with ratings below 3.0 stars on Glassdoor pay an average of 10% more per hire and see 50% fewer qualified applicants. Harvard Business Review research shows that a one-star decrease on Glassdoor increases the cost of a job offer acceptance by approximately $4,723 through the need for higher salaries to compensate for perceived workplace issues.',
  },
  {
    question: 'How long does Glassdoor take to review flagged content?',
    answer:
      'Glassdoor typically processes flagged reviews within 2 to 4 weeks. Reviews involving legal claims or complex verification requests may take longer. The anonymity of the platform means that Glassdoor cannot contact the reviewer for clarification, which sometimes delays the investigation process.',
  },
];

export default function GlassdoorReviewsPage() {
  return (
    <>
      <Script
        id="glassdoor-reviews-jsonld"
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
                  style={{ backgroundColor: '#0CAA41' }}
                />
                Glassdoor Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Protect Your Employer Brand — Remove Fake Glassdoor Reviews
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                Glassdoor reaches 55 million monthly users, and 86% of job
                seekers research company reviews before applying. Fake or
                malicious employee reviews don&apos;t just hurt morale — they
                directly increase your cost per hire and shrink your talent pool.
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
                  { stat: '55M', label: 'Monthly unique visitors' },
                  { stat: '86%', label: 'Of job seekers research Glassdoor reviews' },
                  { stat: '50%', label: 'Fewer applicants for companies rated below 3.0' },
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

          {/* Why Glassdoor Matters */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
                Why Glassdoor Reviews Are a Strategic Business Concern
              </h2>
              <div className="mt-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>
                  Glassdoor has fundamentally changed the power dynamic between employers and the labor
                  market. What was once private — workplace culture, management quality, compensation
                  fairness — is now publicly visible to every potential candidate, competitor, client, and
                  investor. Your Glassdoor profile is not merely an HR concern; it is a business-critical
                  asset that affects revenue, partnerships, and market perception.
                </p>
                <p>
                  The talent acquisition impact is immediate and measurable. In competitive labor markets,
                  top candidates with multiple offers will eliminate companies with low Glassdoor ratings
                  from consideration before even scheduling an interview. This invisible filtering means
                  you never see the candidates you lost — they simply never apply. For technical roles
                  where hiring competition is fiercest, a sub-3.5 Glassdoor rating can make the difference
                  between landing a critical engineer and losing them to a competitor with better reviews.
                </p>
                <p>
                  Beyond recruiting, Glassdoor ratings increasingly influence business relationships.
                  Enterprise clients conducting vendor assessments now routinely review Glassdoor as a
                  proxy for organizational stability and employee satisfaction. Private equity firms and
                  potential acquirers examine Glassdoor trends as part of due diligence. A deteriorating
                  Glassdoor profile can signal internal problems that impact valuations, partnership
                  negotiations, and customer confidence in long-term service commitments.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Violations */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Glassdoor Guideline Violations We Target
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Glassdoor&apos;s Community Guidelines prohibit several categories of content.
                  We specialize in identifying actionable violations in anonymous employer reviews.
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
                Our Glassdoor Review Removal Process
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
              <div className="mt-12 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-green-600 flex-shrink-0" />
                <p className="text-green-800 dark:text-green-300">
                  <strong>Typical timeline:</strong> 2–4 weeks. Glassdoor&apos;s anonymous review
                  structure means verification steps can extend timelines for complex cases.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                Frequently Asked Questions About Glassdoor Review Removal
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
                Employer Reputation Resources
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
                Remove Your Negative Glassdoor Reviews
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Your Glassdoor rating shapes your ability to attract and retain top talent.
                Let our specialists identify every guideline-violating review and fight for its
                removal so you can build the team your business deserves.
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
