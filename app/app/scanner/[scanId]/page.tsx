import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ScanResultsClient from './ScanResultsClient';

export const metadata: Metadata = {
  title: 'Scan Results',
  description:
    'View detailed scan results including threat analysis, violation breakdowns, and AI-powered removal recommendations for flagged reviews.',
  openGraph: {
    title: 'Scan Results | Reach Them AI',
    description: 'Detailed review scan results with AI threat analysis.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default async function ScanResultsPage({ params }: { params: Promise<{ scanId: string }> }) {
  const { scanId } = await params;

  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('user_data')
    .select('subscription_tier')
    .eq('user_id', user.id)
    .single();

  const subscriptionTier =
    (userData as { subscription_tier?: string } | null)?.subscription_tier ?? 'free';

  return <ScanResultsClient scanId={scanId} subscriptionTier={subscriptionTier} />;
}
