'use client';

import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useRemovalAdvisorSubscription } from '@/hooks/useRemovalAdvisorSubscription';
import AdvisorSubscriptionUpsell from './AdvisorSubscriptionUpsell';

interface AdvisorSubscriptionGateProps {
  children: ReactNode;
}

export default function AdvisorSubscriptionGate({ children }: AdvisorSubscriptionGateProps) {
  const { loading, isSubscribed } = useRemovalAdvisorSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isSubscribed) return <>{children}</>;

  return <AdvisorSubscriptionUpsell />;
}
