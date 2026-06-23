import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  ArrowRight,
  Heart,
  Star,
  ShieldCheck,
  Clock,
  Users,
  AlertTriangle,
  BarChart3,
  Stethoscope,
  CheckCircle2,
  Lock,
  FileWarning,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Healthcare Reputation Management — Remove Medical Practice Reviews | Reach Them AI',
  description:
    'HIPAA-aware reputation management for doctors, dentists, and medical practices. 84% of patients trust reviews as personal recommendations. Remove unfair healthcare reviews.',
  keywords: [
    'healthcare reputation management',
    'remove doctor reviews',
    'medical practice reviews',
    'hospital reputation management',
    'dentist review removal',
    'healthgrades review removal',
    'zocdoc review management',
    'HIPAA compliant reputation management',
    'physician online reputation',
  ],
  openGraph: {
    title:
      'Healthcare Reputation Management — Remove Medical Practice Reviews | Reach Them AI',
    description:
      '84% of patients trust online reviews as personal recommendations. Protect your medical practice with HIPAA-aware AI review management.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Healthcare Reputation Management',
  provider: {
    '@type': 'Organization',
    name: 'Reach Them AI',
    url: 'https://reachthem.ai',
  },
  description:
    'HIPAA-aware AI-powered reputation management and review removal service for healthcare providers, medical practices, and dental offices.',
  areaServed: 'US',
  serviceType: 'Reputation Management',
  audience: {
    '@type': 'Audience',
    audienceType: 'Doctors, Dentists, Hospitals, and Medical Practices',
  },
};

const painPoints = [
  {
    icon: Clock,
    title: 'Wait Time Frustrations',
    description:
      'Patients leaving scathing reviews over wait times that are often outside your control due to emergencies, complex cases, or insurance processing delays.',
  },
  {
    icon: FileWarning,
    title: 'Billing Misunderstandings',
    description:
      'Confusion over insurance coverage, copays, and out-of-network billing generates negative reviews that misrepresent your practice\'s pricing transparency.',
  },
  {
    icon: AlertTriangle,
    title: 'Outcome Dissatisfaction',
    description:
      'Patients blaming providers for outcomes influenced by compliance, genetics, or pre-existing conditions — creating misleading reviews about clinical competence.',
  },
  {
    icon: Lock,
    title: 'HIPAA Response Constraints',
    description:
      'Unlike other industries, healthcare providers cannot publicly discuss patient details to correct inaccurate reviews, leaving false narratives unchallenged.',
  },
];

const platforms = [
  { name: 'Google Business', description: 'The primary search destination for patients seeking local healthcare providers and reading experience reviews.' },
  { name: 'Healthgrades', description: 'The largest healthcare-specific review platform, directly influencing patient acquisition for practices nationwide.' },
  { name: 'Zocdoc', description: 'Integrated booking and reviews mean a low rating on Zocdoc directly reduces new patient appointment volume.' },
  { name: 'Vitals', description: 'A major physician review site where patients research doctors by specialty, location, and peer ratings.' },
];

export default function HealthcarePage() {
  return (
    <>
      <Script
        id="healthcare-jsonld"
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
                <Stethoscope className="h-4 w-4" />
                Healthcare &amp; Medical
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Healthcare &amp; Medical Practices
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                84% of patients trust online reviews as much as personal
                recommendations. Protect your practice from unfair reviews while
                staying fully HIPAA compliant with our AI-powered platform.
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
                  { stat: '84%', label: 'of patients trust online reviews as much as personal recommendations', icon: Star },
                  { stat: '72%', label: 'of patients use reviews as their first step to finding a new doctor', icon: Users },
                  { stat: '47%', label: 'of patients will go out-of-network for a provider with better reviews', icon: Heart },
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

          {/* Why Healthcare Is Vulnerable */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  The Unique Reputation Challenges Facing Healthcare Providers
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Healthcare providers face a uniquely unfair landscape when it comes to
                  online reviews. HIPAA regulations prevent doctors and medical staff from
                  responding to reviews with any patient-specific information, meaning
                  inaccurate or misleading claims often go unchallenged in the public eye.
                  Patients experiencing pain, anxiety, or frustration with their health
                  conditions may channel those emotions into reviews that don&apos;t
                  accurately reflect the quality of care provided. A single negative
                  review on Healthgrades or Google can deter dozens of prospective
                  patients, directly impacting your practice&apos;s growth and the
                  community&apos;s access to quality care.
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

          {/* HIPAA-Aware Approach */}
          <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  HIPAA-Aware Review Management
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Our platform is designed specifically to navigate the regulatory
                  complexities of healthcare reputation management without ever risking
                  patient privacy.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Privacy-First Analysis',
                    description:
                      'Our AI identifies policy-violating reviews without requiring any protected health information. We analyze reviewer behavior patterns, language indicators, and platform policy alignment — never patient records.',
                  },
                  {
                    icon: Lock,
                    title: 'Compliant Response Templates',
                    description:
                      'We provide HIPAA-safe response frameworks that address concerns professionally without acknowledging any patient relationship, protecting your practice while showing empathy to readers.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Multi-Platform Monitoring',
                    description:
                      'Track your practice\'s reputation across Google, Healthgrades, Zocdoc, Vitals, and RateMDs from a single dashboard with instant alerts for new reviews requiring attention.',
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
                  Platforms We Monitor for Healthcare
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Patients research providers across specialized healthcare platforms.
                  We monitor and manage reviews where your patients are looking.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <Stethoscope className="h-6 w-6 text-primary-600 mb-3" />
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
                How Negative Reviews Threaten Medical Practices
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300">
                  In healthcare, the stakes of online reputation go far beyond revenue.
                  A study published in the Journal of Medical Internet Research found that
                  negative online reviews are associated with measurable declines in
                  patient volume — with practices losing an average of 10-15% of new
                  patient inquiries for each half-star drop in their average rating.
                  For a mid-sized medical practice, this translates to hundreds of
                  thousands of dollars in lost annual revenue.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  The challenge is compounded by the asymmetry of healthcare reviews.
                  Satisfied patients rarely leave feedback, while those experiencing
                  negative emotions — fear, pain, frustration with insurance — are
                  disproportionately motivated to post. This creates a natural negativity
                  bias that doesn&apos;t reflect your actual patient satisfaction rates.
                  Furthermore, healthcare review platforms like Healthgrades and Zocdoc
                  prominently display ratings in search results, meaning a low score can
                  prevent patients from ever clicking through to learn about your
                  qualifications, specialties, and the compassionate care your team
                  provides every day.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Flag reviews containing HIPAA-irrelevant policy violations',
                  'Remove fake reviews from disgruntled non-patients',
                  'Monitor ratings across healthcare-specific platforms',
                  'Craft compliant responses that protect patient privacy',
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
                Protect Your Medical Practice&apos;s Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Don&apos;t let unfair reviews drive patients to competitors. Get a
                free, HIPAA-aware assessment of your online reputation.
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
