export default function OverviewSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Overview</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Our Reputation Management Tracking module continuously scans social media, news, blogs and the wider web to collect mentions and reviews — giving you a single dashboard to monitor, prioritize, and act on reputation signals.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Mention Tracking</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track your name, hashtags and keywords across social platforms and the web in real time.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Sentiment Insights</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI-driven sentiment analysis and suggested responses help you act with confidence.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Unified Dashboard</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Filter, search, and assign mentions to team members from one place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
