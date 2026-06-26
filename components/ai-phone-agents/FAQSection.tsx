const faqs = [
  {
    question: 'Can the agent answer after-hours calls?',
    answer: 'Yes. It can respond immediately outside business hours so callers still get a helpful experience and your team can follow up later.',
  },
  {
    question: 'Can it book appointments?',
    answer: 'Yes. The agent can gather the details needed to schedule appointments, confirm availability, and reduce manual back-and-forth.',
  },
  {
    question: 'What happens when a call needs a human?',
    answer: 'The conversation can be handed off seamlessly, with the context and notes transferred so the caller does not need to repeat themselves.',
  },
  {
    question: 'Is it difficult to set up?',
    answer: 'No. We help configure the conversation flow around your business rules so you can launch quickly and refine it over time.',
  },
];

export default function FAQSection() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
