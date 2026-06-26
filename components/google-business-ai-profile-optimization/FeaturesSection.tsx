import { CheckCircle2 } from 'lucide-react';

const features = [["Profile completeness audits", "Identify gaps and prioritize improvements that matter most for local discoverability.", ["Category and attribute checks", "Photo and description scoring", "Prioritized action list"]], ["AI post suggestions", "Create GBP posts that are timely, relevant, and optimized to engage nearby customers.", ["Offer and event prompts", "Call-to-action drafting", "Timing recommendations"]], ["Q&A and catalog optimization", "Generate helpful responses and improve service or product details at scale.", ["Response drafting", "Attribute recommendations", "Catalog enhancements"]]];

export default function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            Core Capabilities
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            What this solution helps you do
          </h2>
        </div>

        <div className="space-y-6">
          {features.map(([title, body, bullets]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mb-5 text-slate-600 dark:text-slate-400">{body}</p>
              <ul className="space-y-3">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
