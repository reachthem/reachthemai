export default function FAQSection() {
  const faqs = [
    {
      q: 'What sources do you monitor?',
      a: 'We monitor major social platforms (Facebook, Instagram, X), news sites, blogs, review platforms and broader web sources.'
    },
    {
      q: 'How does sentiment analysis work?',
      a: 'Our AI analyzes language patterns to categorize mentions as positive, neutral, or negative and surface urgent items for action.'
    },
    {
      q: 'Can I respond from the platform?',
      a: 'Yes — you can open the original post, use AI-suggested reply drafts, and assign tasks to team members.'
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
