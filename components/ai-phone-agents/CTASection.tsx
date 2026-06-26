import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-white py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-primary-600 to-blue-600 px-8 py-16 text-center text-white shadow-xl sm:px-12">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Let your business answer every call with confidence
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-50">
          Improve response times, capture more leads, and offer a more professional experience without expanding your team.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary-700 transition hover:bg-slate-100">
            Schedule a Call
          </Link>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
