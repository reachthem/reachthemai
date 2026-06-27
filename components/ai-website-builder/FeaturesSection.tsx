import { CheckCircle2 } from 'lucide-react';

const features: Array<[string, string, string[]]> = [
  ["AI website generation", "Build a complete site quickly with content, structure, and visuals tailored to the business.", ["Responsive layouts", "Custom pages", "Modern visual system"]],
  ["Local SEO foundations", "Optimize the site for local search with schema, location content, and site structure.", ["Schema markup", "Location-based pages", "On-page SEO support"]],
  ["Performance and conversion", "Create pages that load fast, look polished, and guide visitors toward action.", ["Clear calls to action", "Contact and booking paths", "Review and trust signals"]],
];

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
