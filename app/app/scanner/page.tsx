import type { Metadata } from 'next';
import ScannerPageClient from './ScannerPageClient';
import { getScanReportMaxDepth } from '@/app/actions/admin-settings';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export const metadata: Metadata = {
  title: 'Review Scanner',
  description:
    'Scan any business on Google to detect fake, policy-violating, and low-quality reviews. Get an AI threat analysis with actionable removal recommendations.',
  openGraph: {
    title: 'Review Scanner | Reach Them AI',
    description: 'Scan Google reviews to detect policy violations and removal opportunities.',
    images: ['/featured.png'],
    type: 'website',
  },
};

function firstParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | null {
  const v = params[key];
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

export default async function ScannerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [scanMaxDepth, resolved] = await Promise.all([
    getScanReportMaxDepth(),
    searchParams,
  ]);
  const googlePlaceId = firstParam(resolved, 'google_place_id');

  let subscriptionTier = 'free';
  let initialScanCount = 0;
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: ud } = await supabase
      .from('user_data')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .maybeSingle();
    subscriptionTier = (ud as { subscription_tier?: string } | null)?.subscription_tier ?? 'free';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;
    const { count } = await adminClient
      .from('business_scans')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);
    initialScanCount = count ?? 0;
  }

  return (
    <ScannerPageClient
      scanMaxDepth={scanMaxDepth}
      subscriptionTier={subscriptionTier}
      initialScanCount={initialScanCount}
      initialRescanGooglePlaceId={googlePlaceId}
    />
  );
}
