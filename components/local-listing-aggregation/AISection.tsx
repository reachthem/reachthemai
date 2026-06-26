export default function AISection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI Integration &amp; Differentiation</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Our Local Listing Aggregation module is powered by proprietary AI that turns routine listing maintenance into a strategic advantage. The AI automates content generation, identifies likely consistency issues before they impact rankings, and prioritizes cleanup actions for maximum effect.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Smart Descriptions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI drafts optimized, locally relevant business descriptions and chooses categories that improve discoverability.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Predictive Cleanup</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI forecasts where NAP inconsistencies will harm visibility and ranks fixes by impact so you get the biggest wins first.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Content Sync</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Automatically generates photo recommendations, post suggestions and content that are synchronized across platforms for consistent brand messaging.</p>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mt-6">These AI capabilities are available in the self-service platform and used by our Fully Managed team to deliver higher impact faster — reducing manual work while producing measurable SEO gains.</p>
      </div>
    </section>
  );
}
