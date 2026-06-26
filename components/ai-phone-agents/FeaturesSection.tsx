import { CheckCircle2, CalendarClock, MessageSquareText, TrendingUp } from 'lucide-react';

const features = [
  {
    title: '24/7 receptionist coverage',
    body: 'Answer incoming calls anytime, even during evenings, weekends, and busy periods when your team is unavailable.',
    bullets: ['Round-the-clock availability', 'Fast greetings and response times', 'Consistent first-call experience'],
    icon: MessageSquareText,
  },
  {
    title: 'Appointment booking and reminders',
    body: 'Collect appointment details, confirm availability, and keep clients informed with automated follow-ups and reminders.',
    bullets: ['Schedule new appointments', 'Confirm details instantly', 'Reduce no-shows with reminders'],
    icon: CalendarClock,
  },
  {
    title: 'Lead qualification that moves deals forward',
    body: 'Ask the right questions, capture key details, and route hotter leads to the right person without slowing down the conversation.',
    bullets: ['Gather service needs', 'Score and prioritize leads', 'Route based on business rules'],
    icon: TrendingUp,
  },
  {
    title: 'Clear reporting and insight',
    body: 'See what callers needed, how many conversations were handled, and where your team should focus next.',
    bullets: ['Call summaries and transcripts', 'Conversation analytics', 'Operational visibility'],
    icon: CheckCircle2,
  },
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
            Turn every call into a productive next step
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mb-5 text-slate-600 dark:text-slate-400">{feature.body}</p>
                <ul className="space-y-3">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
