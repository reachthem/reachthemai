import { Bot, Sparkles, Workflow } from 'lucide-react';

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
              Built to sound natural, respond quickly, and keep work moving
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              The agent uses conversational AI to understand context, answer routine questions, and keep callers informed without making them repeat themselves. It can also hand off to a human with full context when the situation needs personal attention.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Bot,
                title: 'Natural conversations',
                text: 'Create a welcoming experience that feels calm, clear, and conversational from the first hello.',
              },
              {
                icon: Workflow,
                title: 'Smart routing',
                text: 'Send callers to the right next step based on their request, urgency, or business rules.',
              },
              {
                icon: Sparkles,
                title: 'Always improving',
                text: 'Refine the conversation flow with insights from real calls and common questions.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
