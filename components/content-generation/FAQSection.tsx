const faqs = [["Can it create social content too?", "Yes. The module can produce social captions and local post ideas in addition to blog-style content."], ["Is the content ready to publish?", "It is designed to be review-ready and easy to publish with minimal editing."]];

export default function FAQSection() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{question}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
