export default function FAQSection() {
  const faqs = [
    {
      q: 'Which platforms do you syndicate to?',
      a: 'We syndicate to Google Business Profile, Yelp, Facebook, Bing, Apple Maps, and hundreds of local and niche directories.'
    },
    {
      q: 'How long until listings are updated?',
      a: 'Most major platforms reflect updates within 24–72 hours; niche directories may vary. Our system continuously monitors and retries updates when needed.'
    },
    {
      q: 'Do you handle duplicate listings?',
      a: 'Yes — duplicate detection and automated cleanup are core features, including suggested merges and one-click fixes.'
    },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-800 dark:text-white mb-2">{f.q}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
