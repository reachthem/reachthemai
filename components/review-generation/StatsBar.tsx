const stats = [
  { value: '69%', label: 'of consumers only trust reviews left within the last month' },
  { value: '10+', label: 'reviews the average consumer reads before making a decision' },
  { value: '70%', label: "of people won't use a business with less than 4 stars" },
];

export default function StatsBar() {
  return (
    <section className="bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {stat.value}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-bold mt-1 capitalize">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
