export default function HowItWorksSection() {
  const steps = [
    { title: 'Connect Your Business', desc: 'Add your business details once or import from Google Business Profile.' },
    { title: 'Syndicate Everywhere', desc: 'We push accurate data across major platforms and niche directories automatically.' },
    { title: 'Detect & Clean', desc: 'Automatic duplicate detection with one-click merge and cleanup workflows.' },
    { title: 'Optimize with AI', desc: 'AI suggests categories, descriptions, and photos to improve visibility.' },
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
