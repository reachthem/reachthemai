import Link from 'next/link';
import { ArrowRight, DollarSign, TrendingDown, Users, AlertTriangle } from 'lucide-react';

const impacts = [
  {
    icon: DollarSign,
    stat: '22%',
    title: 'Revenue Drop Per Negative Article',
    description: 'Businesses risk losing 22% of customers when a single negative article appears on the first page of search results.',
    source: 'Moz',
  },
  {
    icon: Users,
    stat: '86%',
    title: 'Consumers Hesitate to Buy',
    description: '86% of people hesitate to purchase from a business with negative online reviews, even if the product is otherwise appealing.',
    source: 'BrightLocal',
  },
  {
    icon: TrendingDown,
    stat: '40:1',
    title: 'Recovery Ratio',
    description: 'It takes roughly 40 positive customer reviews to undo the reputational damage caused by a single negative review.',
    source: 'Inc. Magazine',
  },
  {
    icon: AlertTriangle,
    stat: '33%',
    title: 'Less Revenue at Low Ratings',
    description: 'Businesses with ratings between 1 and 1.5 stars generate 33% less revenue than the industry average.',
    source: 'Womply',
  },
];

export default function NegativeReviewsImpactSection() {
  return (
    <section className="py-24 bg-[#182825] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm font-medium mb-4">
            The Real Cost
          </span>
          <h2 className="text-4xl font-bold">
            How Negative Reviews Impact Your Revenue, Trust, and Growth
          </h2>
          <p className="mt-4 text-xl text-slate-300 max-w-3xl mx-auto">
            Negative reviews don&apos;t just hurt feelings — they directly erode revenue, drive customers
            to competitors, and stunt long-term business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impacts.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-red-400" />
                </div>
                <div className="text-4xl font-extrabold text-primary-400">
                  {item.stat}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-300 leading-relaxed">{item.description}</p>
              <p className="mt-3 text-xs text-slate-500">— {item.source}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-slate-300 mb-6">
            Every day you wait, negative reviews cost your business real customers and real revenue.
          </p>
          <Link
            href="/negative-reviews-impact"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors"
          >
            Read the Full Breakdown
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
