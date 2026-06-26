export default function OverviewSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">What We Do</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Our Local Listing Aggregation module centralizes your business data and distributes it to major platforms and niche directories. With continuous monitoring and automated updates, your listings stay accurate and consistent — which improves local pack rankings and reduces lost customers from incorrect information.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Centralized Syndication</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create your profile once and push consistent information to Google, Yelp, Facebook, Bing, Apple Maps and hundreds of other sites.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Duplicate Cleanup</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Detect and resolve duplicate listings, merge fragmented profiles, and fix NAP discrepancies automatically.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
