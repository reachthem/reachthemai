export default function OverviewSection() {
  const overviewCards = [
    ["Modern website foundations", "Create a fast, polished site with strong messaging, clear structure, and a design system tailored to local businesses."],
    ["Local search ready", "Add schema, local content, and conversion-focused pages that help prospects find and trust your business online."],
    ["Built for action", "Guide visitors through clear calls to action, booking paths, and review signals that support business growth."],
  ];

  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Turn your website into the center of your local growth strategy</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600 dark:text-slate-400">Our website builder creates a modern online presence that is optimized for search visibility, customer trust, and business conversion.</p>
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
