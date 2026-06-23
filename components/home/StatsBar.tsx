const stats = [
  {
    value: '88%',
    label: 'of consumers use online reviews to guide purchase decisions',
    source: 'BrightLocal',
  },
  {
    value: '94%',
    label: 'of consumers avoid businesses with negative reviews',
    source: 'ReviewTrackers',
  },
  {
    value: '30',
    label: 'customers lost per single negative review',
    source: 'Harvard Business Review',
    prefix: 'Up to',
  },
  {
    value: '1.4×',
    label: 'more revenue earned by businesses with 4+ star ratings',
    source: 'Womply',
  },
];

export default function StatsBar() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            The High Cost of Negative Reviews
          </h2>
          <p className="mt-2 font-bold text-slate-600 dark:text-slate-400">
            Every day a negative review sits online, it costs your business real money.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              {stat.prefix && (
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 capitalize">
                  {stat.prefix}
                </p>
              )}
              <div className="text-5xl font-extrabold text-primary-600 dark:text-primary-400">
                {stat.value}
              </div>
              <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed capitalize">
                {stat.label}
              </p>
              <p className="mt-2 text-xs font-bold text-slate-400 dark:text-slate-500 capitalize">
                — {stat.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
