export default function OverviewSection() {
  const overviewCards = [
    ["Real-time visibility", "Watch your rankings change in the moments that matter so you can respond quickly."],
    ["Local intent insights", "Understand which locations and keywords are driving performance for your business."],
    ["Forecasting support", "Use AI-powered trend insights to anticipate shifts before they become bigger issues."],
  ];

  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Know exactly how your business is showing up in local search</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600 dark:text-slate-400">Our local rank tracking module combines hyper-local monitoring with AI-powered forecasting so you can act quickly when visibility changes.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {overviewCards.map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
