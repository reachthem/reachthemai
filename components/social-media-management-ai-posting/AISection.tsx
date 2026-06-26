import { Bot, Sparkles, Workflow } from 'lucide-react';

const items = [["Faster content production", "Generate post ideas and copy in less time so your team can focus on strategy."], ["Cross-channel consistency", "Keep messaging aligned across Facebook, Instagram, X, and other channels."], ["Smarter campaign timing", "Use AI to suggest what to publish and when to publish it."]];

export default function AISection() {
  return (
    <section id="ai-integration" className="bg-gradient-to-br from-slate-900 to-primary-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-slate-200">
              AI Integration
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built around intelligent automation and practical insight
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Our AI layer turns raw local marketing data into action, helping teams prioritize what matters and respond faster to opportunities.
            </p>
          </div>

          <div className="space-y-4">
            {items.map(([title, text]) => {
              const Icon = title.includes('Real') || title.includes('Smart') ? Bot : title.includes('Connected') ? Workflow : Sparkles;
              return (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-300">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
