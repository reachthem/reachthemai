'use client';

const VIDEO_ID = 'ZBnSC1-J1Uc';
const VIDEO_EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}`;

export default function NegativeReviewsCostVideoSection() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-[100%] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={VIDEO_EMBED_URL}
              title="What are the Costs of Negative Reviews?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-[1.1rem] md:text-2xl font-semibold text-slate-800 dark:text-slate-100">
          What are the Costs of Negative Reviews?
        </h2>
      </div>
    </section>
  );
}
