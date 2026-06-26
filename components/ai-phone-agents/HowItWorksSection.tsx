import { ArrowRight, PhoneOutgoing, ClipboardCheck, TrendingUp } from 'lucide-react';

const steps = [
  {
    title: '1. Greet every caller instantly',
    body: 'The agent answers the phone the moment it rings, introduces your business, and starts helping right away.',
    icon: PhoneOutgoing,
  },
  {
    title: '2. Resolve routine requests',
    body: 'It can answer FAQs, collect details, book appointments, and confirm next steps without needing a human on the line.',
    icon: ClipboardCheck,
  },
  {
    title: '3. Escalate when it matters',
    body: 'If the conversation needs a human, the agent hands it off smoothly and shares the context so the experience stays seamless.',
    icon: TrendingUp,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How the experience works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            From the first hello to the final handoff, your AI phone agent helps your team respond faster and serve callers better.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.body}</p>
              </div>
            );
          })}
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
