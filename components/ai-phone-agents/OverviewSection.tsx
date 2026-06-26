export default function OverviewSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            A Better Phone Experience for Every Caller
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
            Whether a caller wants a quote, an appointment, or help with an existing service, your AI phone agent can respond instantly and keep the conversation moving without delay.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
              Capture leads even after hours
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              Never lose a prospect because no one answered the phone. Your AI agent can greet every caller, answer common questions, and collect the details you need for a follow-up.
            </p>

            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
              Reduce missed opportunities
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Let the agent book appointments, route urgent calls, and confirm details in real time so your team can focus on high-value conversations.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
              Feel like a real receptionist
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              The experience is designed to sound natural, helpful, and trustworthy, with the ability to resolve routine requests without making callers feel like they are speaking to a script.
            </p>

            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
              Stay in control with smart routing
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              When a conversation needs a human, the agent can escalate it seamlessly and pass along the context so the handoff feels effortless.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
