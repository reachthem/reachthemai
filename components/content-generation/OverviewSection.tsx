export default function OverviewSection() {
  const overviewCards = [
    ["Relevant local content", "Generate content that matches local intent and supports rankings, trust, and customer engagement."],
    ["Consistent publishing", "Create a repeatable content rhythm that keeps your online presence fresh without extra manual effort."],
    ["Search-friendly structure", "Use AI-assisted topic planning and on-page structure that supports discoverability and conversion."],
  ];

  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Scale content without sacrificing relevance</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600 dark:text-slate-400">This module helps businesses create a steady stream of locally relevant content that supports rankings, trust, and brand authority.</p>
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
