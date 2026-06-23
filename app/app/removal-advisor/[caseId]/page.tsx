import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import CasePageClient from './CasePageClient';

interface PageProps {
  params: Promise<{ caseId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { caseId } = await params;
  return {
    title: `Case ${caseId.slice(0, 8)}`,
    description:
      'View AI removal analysis, strategy, and status for this review case. Follow step-by-step instructions to report the review to the platform.',
    openGraph: {
      title: `Review Case | Reach Them AI`,
      description: 'View removal analysis and strategy for this review.',
      images: ['/featured.png'],
      type: 'website',
    },
  };
}

export default async function CaseResultsPage({ params }: PageProps) {
  const { caseId } = await params;
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;
  const { data: reviewCase } = await adminClient
    .from('review_cases')
    .select('*')
    .eq('id', caseId)
    .eq('user_id', user.id)
    .single();

  if (!reviewCase) redirect('/app/removal-advisor');

  return <CasePageClient reviewCase={reviewCase} />;
}
