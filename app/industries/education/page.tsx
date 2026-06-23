import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import {
  ArrowRight,
  GraduationCap,
  Star,
  TrendingDown,
  Search,
  ShieldAlert,
  BookOpen,
  DollarSign,
  Award,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Education Reputation Management — Remove School & Tutoring Reviews | Reach Them AI',
  description:
    'Protect your school, tutoring center, or education business from negative reviews on Google, Yelp, Facebook, Niche, and GreatSchools. 79% of parents read reviews before enrollment decisions.',
  keywords: [
    'education reputation management',
    'school review management',
    'tutoring center reviews',
    'remove school reviews',
    'education negative reviews',
    'online school reputation',
    'GreatSchools review management',
    'Niche school reviews',
    'tutoring reputation management',
  ],
  openGraph: {
    title: 'Education Reputation Management — Remove School & Tutoring Reviews | Reach Them AI',
    description:
      '79% of parents read reviews before choosing a school or tutor. Protect your education brand on Google, Yelp, Facebook, Niche, and GreatSchools.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Education Reputation Management',
  description:
    'AI-powered reputation management for schools, tutoring centers, online learning platforms, and educational institutions. Monitor and manage reviews across Google, Niche, GreatSchools, and more.',
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
    value: '79%',
    label: 'of parents read online reviews before choosing a school, tutoring service, or educational program for their children',
    source: 'National Center for Education Statistics',
  },
  {
    icon: TrendingDown,
    value: '35%',
    label: 'enrollment decline observed at institutions with sustained negative review profiles compared to higher-rated competitors in the same district',
    source: 'Hanover Research Education Survey',
  },
  {
    icon: Star,
    value: '91%',
    label: 'of prospective families say online reputation is as important as standardized test scores when evaluating private schools and tutoring programs',
    source: 'EdWeek Market Research',
  },
  {
    icon: GraduationCap,
    value: '$12K+',
    label: 'average annual tuition per student at private institutions — making each enrollment decision lost to negative reviews extraordinarily costly',
    source: 'NAIS Tuition Survey',
  },
];

const painPoints = [
  {
    icon: BookOpen,
    title: 'Teaching Quality Disputes',
    description:
      'Education is deeply personal, and every family has different expectations for teaching style, pace, and methodology. A parent who feels their child did not receive enough individual attention or disagrees with a curriculum approach may post a review that characterizes the entire institution as inadequate — even when the vast majority of families are satisfied. These reviews carry outsized weight because prospective parents read them as warnings about their own child\'s potential experience.',
  },
  {
    icon: DollarSign,
    title: 'Tuition and Pricing Frustration',
    description:
      'Education costs are among the most emotionally charged expenses families face. When parents feel that the investment in tuition, test prep, or tutoring sessions did not produce the results they expected — a higher GPA, better test scores, or college acceptance — frustration gets directed at the institution through review platforms. These reviews frame the school or tutoring center as "not worth the money," a devastating characterization in an industry where perceived value drives enrollment.',
  },
  {
    icon: Award,
    title: 'Outcome Expectations vs. Reality',
    description:
      'Parents often enroll children with specific outcome expectations: improved grades, college readiness, or skill mastery. When results do not materialize as quickly as hoped — or when external factors like student motivation and home environment play a role — the educational provider absorbs the blame in review form. A review stating "my child didn\'t improve" carries enormous influence even when it lacks context about attendance, effort, or baseline skill levels.',
  },
  {
    icon: ShieldAlert,
    title: 'Administrative and Facility Complaints',
    description:
      'Schools and tutoring centers face reviews about enrollment processes, scheduling conflicts, building conditions, and administrative responsiveness. A parent frustrated by a billing error or a scheduling miscommunication may leave a one-star review that has nothing to do with educational quality but damages the overall rating just the same. These operational reviews dilute the positive academic feedback and misrepresent the institution to prospective families.',
  },
];

const platforms = [
  { name: 'Google Business Profile', description: 'The first place parents search when evaluating local schools, tutoring centers, and educational programs' },
  { name: 'Yelp', description: 'High-authority review platform where detailed parent reviews heavily influence local education decisions' },
  { name: 'Facebook', description: 'Community-driven recommendations and reviews that spread through parent networks and local groups' },
  { name: 'Niche', description: 'The leading school comparison platform where ratings and reviews directly influence enrollment decisions for K-12 and higher education' },
  { name: 'GreatSchools', description: 'Trusted by millions of parents for school ratings and community reviews that shape neighborhood and enrollment choices' },
];

export default function EducationPage() {
  return (
    <>
      <Script
        id="education-jsonld"
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
                Education &amp; Tutoring
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Reputation Management for Education &amp; Tutoring
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
                79% of parents research schools and tutoring services online before making enrollment
                decisions. In education, your reputation is not just marketing — it is the foundation
                of trust that families need before entrusting you with their children&apos;s futures.
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
                Why Online Reviews Shape Education Enrollment
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
                Parents treat school and tutoring reviews the way they treat medical reviews — with
                extreme scrutiny. The stakes are their children&apos;s development, and a handful of
                negative reviews can redirect an entire family&apos;s enrollment decision.
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
                Common Reputation Challenges in Education
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Educational institutions and tutoring businesses occupy a uniquely vulnerable position
                in the review ecosystem. Parents are emotionally invested in their children&apos;s
                success, and when expectations are not met — for any reason — the institution often
                becomes the target of public criticism.
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
                The True Cost of Negative Reviews in Education
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                Education operates on long enrollment cycles and high lifetime value per student. A
                private school student may represent $50,000–$200,000 in tuition over their enrollment
                years. A tutoring client averaging $300 per month generates $3,600 annually — and
                often stays for multiple years. When negative reviews divert even a small percentage
                of prospective families, the compounding revenue loss is severe.
              </p>
              <div className="mt-8 space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Enrollment Pipeline Erosion</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Parents researching schools begin with Google searches and platform reviews months
                    before enrollment deadlines. A school with 3.8 stars next to a competitor with 4.6
                    stars loses families at the top of the funnel — before they ever schedule a campus
                    tour or attend an open house. For private schools where each enrolled student
                    represents five-figure annual tuition, losing just three families per year to
                    review-driven decisions means $150,000+ in foregone revenue.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Word-of-Mouth Amplification</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Education is deeply community-driven. Parents share school experiences in Facebook
                    groups, neighborhood conversations, and PTA meetings. A negative Google review does
                    not stay on Google — it gets screenshot-shared and discussed in local parent
                    communities, amplifying its reach far beyond the original platform. One viral
                    negative review in a parent Facebook group can influence dozens of enrollment
                    decisions simultaneously.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold">Staff Recruitment Impact</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">
                    Negative reviews do not only deter families — they deter talented educators.
                    Teachers and tutors research potential employers online, and a school with
                    persistent negative reviews struggles to attract top talent. This creates a
                    feedback loop: lower-quality instruction leads to more negative reviews, which
                    makes hiring even harder. Protecting your review profile is also protecting your
                    ability to recruit and retain exceptional educators.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-lg text-slate-300 leading-relaxed">
                Explore the full financial impact of negative reviews across industries in our{' '}
                <Link
                  href="/negative-reviews-impact"
                  className="text-primary-400 font-medium hover:underline"
                >
                  comprehensive revenue impact analysis
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Platforms */}
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Key Review Platforms for Education &amp; Tutoring
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Educational institutions must monitor their reputation across platforms that parents
                actively use to compare schools, evaluate tutoring options, and make enrollment
                decisions for their children.
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
                How Reach Them AI Protects Education Reputations
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Our platform understands the unique dynamics of education reputation management —
                from parent-driven review patterns to the seasonal enrollment cycles that make
                timing critical. We help schools and tutoring centers build the online presence
                their academic quality deserves.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'AI-powered review analysis that identifies policy violations across Google, Yelp, Facebook, Niche, and GreatSchools — including reviews from non-parents, former employees, and competing institutions.',
                  'Real-time monitoring alerts you to new reviews within minutes, giving you the ability to respond during critical enrollment periods when every impression matters.',
                  'Education-specific response templates that address parent concerns about teaching quality, pricing, and outcomes while maintaining the professional tone families expect.',
                  'Strategic review generation campaigns that encourage satisfied parents to share their positive experiences at the moments they are most enthusiastic — after parent-teacher conferences, graduations, and academic milestones.',
                  'Enrollment-cycle analytics that correlate your review trends with application and enrollment data, showing the direct revenue impact of your reputation management efforts.',
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
                  Learn what Online Reputation Management is and why it matters for education
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary-600">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Protect Your Education Reputation Today
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                Every enrollment season counts. Get a free assessment and discover how many of your
                harmful reviews qualify for removal — before they cost you another family&apos;s trust
                and tuition.
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
