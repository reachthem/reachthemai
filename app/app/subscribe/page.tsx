import type { Metadata } from 'next';
import AdvisorSubscriptionUpsell from '@/components/removal-advisor/AdvisorSubscriptionUpsell';
import { getAdvisorDisplayPrice } from '@/app/actions/admin-settings';

export const metadata: Metadata = {
  title: 'Subscribe',
  description:
    'Subscribe for unlimited review scans, AI removal advisor, and more. Run unlimited review scans on a scheduled basis.',
  openGraph: {
    title: 'Subscribe | Reach Them AI',
    description: 'Unlock unlimited review scans and AI-powered review removal tools.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default async function SubscribePage() {
  const advisorPrice = await getAdvisorDisplayPrice();

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl border-2 border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800 p-6">
        <p className="text-center text-lg font-medium text-slate-900 dark:text-white">
          Run Unlimited Review Scans and much more with a Subscription.
        </p>
      </div>
      <AdvisorSubscriptionUpsell
        advisorPrice={advisorPrice}
        prependedFeatures={[
          'Unlimited Review Scans: Run Unlimited Review Scans on a scheduled basis.',
        ]}
      />
    </div>
  );
}
