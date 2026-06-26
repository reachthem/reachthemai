import Image from 'next/image';
import { Star } from 'lucide-react';

const avatarColors = [
  '0ea5e9', // sky
  '6366f1', // indigo
  '059669', // emerald
  'b45309', // amber
  'be185d', // pink
  '4f46e5', // violet
];

const reviews = [
  {
    name: 'Emma Richardson',
    text: 'The AI advisor gave me step-by-step instructions that actually worked. I had a fake Google review removed in under two weeks. Worth every penny and way better than the $400/month agency I used to use.',
  },
  {
    name: 'James Mitchell',
    text: 'I was skeptical that an AI could understand policy violations, but the report was incredibly detailed. It cited specific Google policy sections and told me exactly where to click. Removed my first review within 10 days.',
  },
  {
    name: 'Sophie Turner',
    text: 'Finally something that doesn’t require a retainer or a long wait. I pasted the review, got the audit in seconds, and followed the instructions. The confidence score helped me prioritize which reviews to tackle first.',
  },
  {
    name: 'Daniel Clarke',
    text: 'We had three fake Yelp reviews from a competitor. The AI broke down each one with violation categories and removal probability. We submitted using their instructions and all three came down. Game changer for a small business.',
  },
  {
    name: 'Olivia Bennett',
    text: 'The platform-specific guidance is what sold me. Instead of guessing how to report on Google vs. Yelp vs. Facebook, the report tells you exactly what to do on each. Saved me hours of research.',
  },
  {
    name: 'William Foster',
    text: 'Unlimited analyses for $49 is a steal. I run a dental practice and we get the occasional bogus review. I run each one through the advisor now and only pursue the ones with a high removal probability. No more wasted time.',
  },
  {
    name: 'Charlotte Hayes',
    text: 'I used to pay a reputation firm $300/month and wait weeks for a strategy. With this I get an audit in seconds and can act the same day. The AI chat answered my follow-up questions clearly. Highly recommend.',
  },
  {
    name: 'Thomas Wright',
    text: 'The legal grounds summary was surprisingly thorough — defamation, FTC, platform ToS. It gave me the right language to use when I reported the review. Google removed it. I’ve since used it for two more with the same result.',
  },
  {
    name: 'Emily Cooper',
    text: 'As a solo attorney I don’t have a marketing team. The AI advisor did in minutes what would have taken me hours to figure out. Clear, actionable, and it worked. My negative review was removed.',
  },
  {
    name: 'Henry Brooks',
    text: 'We had a vindictive ex-employee leave a one-star review. The AI flagged it as policy-violating and walked us through the exact Google form and what to write. Removed in about a week. Couldn’t ask for more.',
  },
  {
    name: 'Lily Patterson',
    text: 'The dashboard keeps all my cases in one place and the AI chat is there when I have questions. For $49 a month it’s a no-brainer. We’ve successfully had four reviews removed across Google and Facebook.',
  },
  {
    name: 'Samuel Reed',
    text: 'I tried the free assessment first and was impressed. Signed up for the monthly plan and have used it on six reviews so far. Four removed, two still in progress. The removal probability scores have been accurate.',
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400 flex-shrink-0" />
      ))}
    </div>
  );
}

export default function AdvisorReviewsSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
            What users say
          </span>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Real reviews from real users
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See why businesses trust the AI Review Advisor to get actionable removal guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <article
              key={review.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&size=56&background=${avatarColors[index % avatarColors.length]}&color=fff&bold=true`}
                  alt=""
                  className="h-14 w-14 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-slate-700 shadow-sm"
                  width={56}
                  height={56}
                  unoptimized
                />
                <div className="flex-1 min-w-0">
                  <StarRating />
                  <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p className="mt-4 font-semibold text-slate-900 dark:text-white text-sm">
                    {review.name}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
