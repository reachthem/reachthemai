export default function OverviewSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Business Review Generation</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            AI-enhanced software to collect, manage, and amplify positive customer feedback while
            routing lower ratings into private feedback forms to reduce public negatives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Branded Review Landing Pages</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Fully branded landing pages with smart routing: low ratings go to private feedback, high ratings
              are guided to Google, Yelp, Facebook and other platforms for public 4–5 star reviews.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Bulk Review Requests</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Send personalized, high-deliverability campaigns from the dashboard or opt for our fully managed service
              where we handle messaging, segmentation, and scheduling on your behalf.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Review Sharing & Amplification</h3>
            <p className="text-slate-600 dark:text-slate-400">
              One-click sharing tools let customers and owners amplify positive feedback across social channels.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Real-Time Alerts & AI Responses</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Immediate email alerts, AI summaries, and suggested reply drafts so businesses can respond rapidly.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Dashboard & Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Track total reviews, aggregate rating, sentiment, and trends with AI-powered forecasting and insights.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">AI Integration</h3>
            <p className="text-slate-600 dark:text-slate-400">
              AI crafts optimized request copy, routes low ratings to private forms, drafts responses, and
              suggests follow-ups to maximize 5-star outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
