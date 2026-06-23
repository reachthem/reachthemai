import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  UtensilsCrossed,
  Stethoscope,
  Scale,
  Wrench,
  Car,
  Home,
  ShoppingBag,
  Landmark,
  Plane,
  GraduationCap,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Online Reputation Management by Industry | Reach Them AI',
  description:
    'Industry-specific reputation management and negative review removal for restaurants, healthcare, legal, home services, automotive, real estate, retail, financial services, hotels, and education. Tailored approaches for every sector.',
  keywords: [
    'reputation management by industry',
    'industry reputation management',
    'restaurant reputation',
    'healthcare reputation management',
    'legal reputation management',
    'home services reviews',
    'automotive dealership reviews',
    'real estate reputation',
    'retail reputation management',
    'financial services reputation',
    'hotel reputation management',
    'education reputation',
  ],
  openGraph: {
    title: 'Online Reputation Management by Industry | Reach Them AI',
    description:
      'Industry-specific review removal and reputation management. From restaurants and healthcare to legal, real estate, and retail — we tailor our approach to your sector.',
    images: ['/featured.png'],
    type: 'website',
  },
};

const industries = [
  {
    icon: UtensilsCrossed,
    name: 'Restaurants & Hospitality',
    slug: 'restaurants',
    overview:
      'Diners rely on reviews more than ever: 67% check reviews before choosing a restaurant, and a single unfair or fake review can cost thousands in lost covers. We help restaurants and hospitality businesses remove policy-violating reviews from Google, Yelp, TripAdvisor, and Facebook while protecting your star rating and reputation.',
  },
  {
    icon: Stethoscope,
    name: 'Healthcare & Medical',
    slug: 'healthcare',
    overview:
      '84% of patients trust online reviews as much as personal recommendations when choosing a doctor or practice. HIPAA limits how you can respond, and fake or hostile reviews from non-patients can severely damage patient acquisition. We specialize in removing reviews that violate platform policies or are posted by non-patients.',
  },
  {
    icon: Scale,
    name: 'Legal Services',
    slug: 'legal',
    overview:
      '85% of people looking for a lawyer rely on online reviews. Opposing parties, disgruntled clients, or fake reviews can devastate a firm\'s referral pipeline and credibility. We work with law firms to identify and remove reviews that violate platform policies, including off-topic content and conflict-of-interest posts.',
  },
  {
    icon: Wrench,
    name: 'Home Services',
    slug: 'home-services',
    overview:
      'Home service businesses with 4+ star ratings see roughly twice the service calls of lower-rated competitors. Pricing disputes, warranty complaints, and competitor sabotage are common review issues. We help plumbers, electricians, HVAC, and other contractors remove policy-violating reviews from Google, Yelp, and Angi.',
  },
  {
    icon: Car,
    name: 'Automotive',
    slug: 'automotive',
    overview:
      '95% of vehicle buyers use digital sources before purchasing, and dealership reviews directly impact test drives and sales. Fake reviews from competitors or disgruntled customers can skew perception. We support dealerships and auto businesses with removal of policy-violating reviews across Google, Cars.com, and DealerRater.',
  },
  {
    icon: Home,
    name: 'Real Estate',
    slug: 'real-estate',
    overview:
      'Agents with 4.5+ star ratings receive significantly more inquiries. Negative reviews from disgruntled tenants, failed transactions, or fake posts can derail a career. We help real estate professionals remove reviews that violate platform policies and protect their reputation on Zillow, Google, and other major platforms.',
  },
  {
    icon: ShoppingBag,
    name: 'Retail & E-commerce',
    slug: 'retail',
    overview:
      'Products with 3-star ratings see 57% less conversion than 5-star products, and online reviews are the #1 factor in e-commerce purchasing decisions. We help retailers and brands address fake, incentivized, or policy-violating reviews on Google, Amazon, Trustpilot, and other major review platforms.',
  },
  {
    icon: Landmark,
    name: 'Financial Services',
    slug: 'financial-services',
    overview:
      '78% of consumers read reviews before choosing a financial advisor. Trust is everything in financial services — one bad review can erode years of credibility. We work with advisors, banks, and financial firms to remove policy-violating or fake reviews from Google, Yelp, and specialized review sites.',
  },
  {
    icon: Plane,
    name: 'Hotels & Travel',
    slug: 'hotels-travel',
    overview:
      '81% of travelers always read reviews before booking, and a one-point score increase can boost hotel pricing power by 11%. We help hotels, tour operators, and travel businesses remove fake or policy-violating reviews from TripAdvisor, Google, Booking.com, and other major travel platforms.',
  },
  {
    icon: GraduationCap,
    name: 'Education',
    slug: 'education',
    overview:
      '79% of parents read online reviews before choosing schools or tutoring services. Enrollment numbers are directly tied to online reputation. We support schools, universities, and education providers in removing policy-violating or fake reviews from Google, Niche, and other education-focused platforms.',
  },
];

export default function IndustriesOverviewPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar background="white" maxWidth="98%" />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-300 text-sm font-medium mb-6">
              Industries
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Online Reputation Management for Every Industry
            </h1>
            <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Every industry faces unique reputation challenges — from the platforms your customers use to the regulations that shape how you can respond. We tailor our approach to the specific review patterns, policy grounds, and removal strategies that matter most to your sector. Whether you&apos;re in restaurants, healthcare, legal, home services, automotive, real estate, retail, financial services, hotels, or education, we help you remove policy-violating and fake reviews while protecting your reputation.
            </p>
            <Link
              href="/free-assessment"
              className="mt-10 inline-flex items-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/25"
            >
              Get a Free Assessment
            </Link>
          </div>
        </section>

        {/* Two-column industry blocks */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {industries.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors">
                    <industry.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {industry.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {industry.overview}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:underline">
                    Full industry overview
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
