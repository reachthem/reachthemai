export default function OverviewSection() {
  const overviewCards = [
    ["Profile completeness", "Surface the exact profile details that improve trust, relevance, and search visibility."],
    ["Actionable recommendations", "Prioritize optimization opportunities that are easy to implement and likely to impact performance."],
    ["Ongoing profile health", "Keep key business information accurate and consistent as your operations change over time."],
  ];

  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Make every profile detail work harder for local search</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600 dark:text-slate-400">This module uses AI to surface the exact changes that can improve profile completeness, trust, engagement, and ranking performance.</p>
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
