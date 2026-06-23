'use client';

import { useRemovalAdvisorSubscription } from '@/hooks/useRemovalAdvisorSubscription';
import AdvisorSubscriptionUpsell from '@/components/removal-advisor/AdvisorSubscriptionUpsell';
import { Loader2 } from 'lucide-react';

interface NewReviewCaseGateProps {
  children: React.ReactNode;
  /** Display price from admin settings for the upsell card. */
  advisorPrice?: string;
}

export default function NewReviewCaseGate({ children, advisorPrice }: NewReviewCaseGateProps) {
  const { loading, isSubscribed } = useRemovalAdvisorSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border-2 border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800 p-6 my-8">
          <p className="text-center text-lg font-medium text-slate-900 dark:text-white">
            You need a subscription to use the AI Advisor.
          </p>
        </div>
        <AdvisorSubscriptionUpsell advisorPrice={advisorPrice} />
      </div>
    );
  }

  return <>{children}</>;
}
