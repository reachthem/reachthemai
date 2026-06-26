import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ServiceSelectionSection from '@/components/home/ServiceSelectionSection';
import { getDisplayPrices, getRemovalDisplayPrice } from '@/app/actions/admin-settings';

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

export default async function PricingPage() {
  const { advisorPrice, removalPrice } = await getDisplayPrices();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
            Simple, Transparent Pricing
          </span>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white max-md:text-[1.5rem]">
            Pay Only for Results
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto max-md:text-[1.1rem] max-md:leading-[1.65rem]">
            Choose the plan that fits your review-removal workflow. Both options are available at $49 for the core subscription and $49 per successful review removal.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceSelectionSection advisorPrice={advisorPrice} removalPrice={removalPrice} />

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
