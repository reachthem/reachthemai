import { Check } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    'Business name and hashtag mention tracking across social and web sources',
    'Dedicated mentions database with filters, links, and search',
    'AI sentiment analysis with suggested response drafts',
    'Real-time alerts and team assignment workflows',
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 flex gap-4 items-start">
              <Check className="w-5 h-5 text-blue-500 mt-1" />
              <p className="text-slate-600 dark:text-slate-300">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
