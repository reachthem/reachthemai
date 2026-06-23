import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, DollarSign, Lock, Shield } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import CheckoutButton from '@/components/pricing/CheckoutButton';
import AdvisorPricingCard from '@/components/pricing/AdvisorPricingCard';
import { getAdvisorDisplayPrice, getRemovalDisplayPrice } from '@/app/actions/admin-settings';

export async function generateMetadata(): Promise<Metadata> {
  const removalPrice = await getRemovalDisplayPrice();
  return {
    title: 'Pricing — Review Removal Service',
    description:
      `Review removal pricing: $${removalPrice} per successfully removed review. No upfront fees — pay only when the bad Google review is permanently removed. Transparent pricing for Google, Yelp, Facebook, and Trustpilot.`,
    openGraph: {
      title: 'Pricing — Review Removal Service | Reach Them AI',
      description:
        `Only $${removalPrice} per successfully removed review. No upfront fees — you pay only when the negative review is permanently gone.`,
      images: ['/featured.png'],
      type: 'website',
    },
  };
}

const included = [
  'Expert case preparation',
  'Direct platform submission',
  'Follow-up and status tracking',
  'Results typically in 24 to 48 hours',
  'Full refund if removal is unsuccessful',
];

const platformFeatures = [
  'Review monitoring dashboard',
  'Automated review request campaigns',
  'AI-powered response generation',
  'Sentiment analytics & reporting',
  'Competitor benchmarking',
  'Dispute management tools',
];

export default async function PricingPage() {
  const [advisorPrice, removalPrice] = await Promise.all([getAdvisorDisplayPrice(), getRemovalDisplayPrice()]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      <main className="pt-24 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Simple, Transparent Pricing
          </span>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white max-md:text-[1.5rem]">
            Pay Only for Results
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-[1.1rem] max-md:leading-[1.65rem]">
            No monthly fees, no retainers. We charge {`$${removalPrice}`} per review successfully removed — nothing
            until the review is gone.
          </p>
        </div>

        {/* Three-column layout: AI Advisor | Review Removal | Full Platform */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Column 1: AI Advisor pricing — same block as /ai-advisor */}
            <AdvisorPricingCard advisorPrice={advisorPrice} />

            {/* Column 2: Review Removal Service */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600/10 blur-2xl rounded-3xl" />
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl border-2 border-primary-500 shadow-2xl overflow-hidden">
                {/* Top accent bar */}
                <div className="bg-primary-600 py-2 px-8 text-center">
                  <span className="text-white text-sm font-semibold">Most Popular — Results Guaranteed</span>
                </div>

                <div className="p-8 text-center">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Review Removal Service
                  </h2>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
                    One-time payment per removed review
                  </p>

                  {/* Price display */}
                  <div className="mt-6 text-center py-6 border-y border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-center gap-1">
                      <DollarSign className="h-8 w-8 text-primary-600 mt-3 max-md:h-6 max-md:w-6" />
                      <span className="text-8xl font-extrabold text-slate-900 dark:text-white max-md:text-[4rem]">{removalPrice}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      per review successfully removed
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-1">
                      100% Money Back Guarantee - If we can&apos;t get your review removed, you get a full refund!
                    </p>
                  </div>

                  {/* What's included */}
                  <ul className="mt-6 space-y-3">
                    {included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <CheckoutButton />

                  {/* Trust signals */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" />
                      Secure payments via Stripe
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" />
                      100% refund if unsuccessful
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform features */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Also Included: Full Platform Access
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Every account comes with access to our complete reputation management platform.
              </p>

              <ul className="space-y-3">
                {platformFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-primary-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-center">
                <Image src="/guarantee.png" alt="Guarantee" width={280} height={120} className="object-contain" />
              </div>
            </div>
          </div>

          {/* FAQ links */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Questions about the pricing or process?{' '}
              <Link href="/#faq" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                Read our FAQ
              </Link>
              {' '}or{' '}
              <Link href="/contact" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
