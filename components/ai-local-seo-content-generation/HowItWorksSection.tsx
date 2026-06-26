import { ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [["Identify topics", "Choose the themes and local keywords that matter most for the business."], ["Generate assets", "Create blog content, social copy, and GBP posts with AI assistance."], ["Publish and refine", "Review, publish, and improve future content using performance feedback."]];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How the process works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            The workflow is simple: capture the right data, generate the right action, and keep improving from real performance signals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a href="#services" className="inline-flex items-center gap-2 text-lg font-semibold text-primary-600 hover:text-primary-500">
            Explore pricing and setup options
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
