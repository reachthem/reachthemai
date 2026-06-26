export default function HowItWorksSection() {
  const steps = [
    { title: 'Set Up Tracking', desc: 'Configure business names, hashtags and keywords to monitor.' },
    { title: 'Collect Mentions', desc: 'We scan social platforms, news, blogs and the web in real time.' },
    { title: 'Analyze Sentiment', desc: 'AI categorizes mentions and surfaces high-impact items.' },
    { title: 'Act & Resolve', desc: 'Assign mentions, send suggested replies, and track outcomes.' },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
