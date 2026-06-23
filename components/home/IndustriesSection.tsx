import Link from 'next/link';
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

const industries = [
  {
    icon: UtensilsCrossed,
    name: 'Restaurants & Hospitality',
    slug: 'restaurants',
    excerpt: '67% of diners check reviews before choosing a restaurant. One negative review can cost a restaurant thousands in lost covers.',
  },
  {
    icon: Stethoscope,
    name: 'Healthcare & Medical',
    slug: 'healthcare',
    excerpt: '84% of patients trust online reviews as much as personal recommendations when choosing a doctor or medical practice.',
  },
  {
    icon: Scale,
    name: 'Legal Services',
    slug: 'legal',
    excerpt: '85% of people looking for a lawyer rely on online reviews. Negative reviews from opposing parties can devastate a firm\'s referral pipeline.',
  },
  {
    icon: Wrench,
    name: 'Home Services',
    slug: 'home-services',
    excerpt: 'Home service businesses with 4+ star ratings see 2x more service calls. Pricing disputes and warranty complaints are the most common review issues.',
  },
  {
    icon: Car,
    name: 'Automotive',
    slug: 'automotive',
    excerpt: '95% of vehicle buyers use digital sources before purchasing. Dealership reviews directly impact test drive bookings and sales conversions.',
  },
  {
    icon: Home,
    name: 'Real Estate',
    slug: 'real-estate',
    excerpt: 'Agents with 4.5+ star ratings receive 3x more inquiries. Negative reviews from disgruntled tenants or failed transactions can derail a career.',
  },
  {
    icon: ShoppingBag,
    name: 'Retail & E-commerce',
    slug: 'retail',
    excerpt: 'Products with 3-star ratings see 57% less conversion than 5-star products. Online reviews are the #1 factor in e-commerce purchasing decisions.',
  },
  {
    icon: Landmark,
    name: 'Financial Services',
    slug: 'financial-services',
    excerpt: '78% of consumers read reviews before choosing a financial advisor. Trust is everything in financial services — one bad review erodes years of credibility.',
  },
  {
    icon: Plane,
    name: 'Hotels & Travel',
    slug: 'hotels-travel',
    excerpt: '81% of travelers always read reviews before booking. A one-point score increase can boost hotel pricing power by 11%.',
  },
  {
    icon: GraduationCap,
    name: 'Education',
    slug: 'education',
    excerpt: '79% of parents read online reviews before choosing schools or tutoring services. Enrollment numbers are directly tied to online reputation.',
  },
];

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Every Industry
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Online Reputation Management for Every Industry
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Every industry faces unique reputation challenges. We tailor our approach to the specific
            platforms, regulations, and review patterns that matter most to your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors">
                <industry.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                {industry.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {industry.excerpt}
              </p>
              <span className="mt-3 inline-block text-xs font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
