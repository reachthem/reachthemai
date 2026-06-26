export default function AISection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI Integration &amp; Differentiation</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Our Reputation Management Tracking module uses advanced AI to convert raw mentions into actionable intelligence. From sentiment analysis to suggested reply drafts and trend detection, the AI helps teams move faster and make smarter decisions.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Sentiment & Classification</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI automatically tags mentions as positive, neutral, or negative and highlights urgent items that need immediate attention.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Suggested Responses</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Generate context-aware reply drafts that match your brand voice and reduce response time.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Trend & Risk Detection</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI spots emerging sentiment trends and predicts reputation risks so you can act proactively.</p>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mt-6">These AI-driven features are available in the platform for DIY users and are leveraged by our Fully Managed team to prioritize high-impact interventions and improve long-term reputation outcomes.</p>
      </div>
    </section>
  );
}
