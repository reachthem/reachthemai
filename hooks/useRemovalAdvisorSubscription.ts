'use client';

import { useEffect, useState } from 'react';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

interface UserData {
  subscription_tier: string | null;
  user_role: string | null;
}

export function useRemovalAdvisorSubscription() {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const sassClient = await createSPASassClient();
        const client = sassClient.getSupabaseClient();
        const { data: { user } } = await client.auth.getUser();
        if (!user) {
          setIsSubscribed(false);
          return;
        }

        const { data } = await client
          .from('user_data')
          .select('subscription_tier, user_role')
          .eq('user_id', user.id)
          .single();

        const typedData = data as UserData | null;
        setIsSubscribed(
          typedData?.subscription_tier === 'removal_advisor' || typedData?.user_role === 'admin'
        );
      } catch {
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    }
    checkSubscription();
  }, []);

  return { loading, isSubscribed };
}
