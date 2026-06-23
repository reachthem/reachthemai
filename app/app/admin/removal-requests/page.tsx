import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { redirect } from 'next/navigation';
import RemovalRequestsPageClient from '@/components/admin/removal/RemovalRequestsPageClient';
import { loadAdminBusinessScans } from '@/lib/admin/loadAdminBusinessScans';

export const metadata: Metadata = {
  title: 'Removal Requests',
  description:
    'Admin: Manage and process review removal requests. View status, update cases, and track submissions for Google, Yelp, and other platforms.',
  openGraph: {
    title: 'Removal Requests | Admin | Reach Them AI',
    description: 'Manage review removal requests and case status.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminRemovalRequestsPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  // Removal requests (exclude draft)
  const { data: allRows } = await supabase
    .from('removal_requests')
    .select('id, status')
    .neq('status', 'draft');

  const statusCounts: Record<string, number> = {};
  (allRows ?? []).forEach((row) => {
    statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
  });
  const totalRemovalCount = allRows?.length ?? 0;

  const { data: removalRequests } = await supabase
    .from('removal_requests')
    .select('id, contact_email, contact_phone, platform, review_url, removal_reason, status, created_at, updated_at')
    .neq('status', 'draft')
    .order('created_at', { ascending: false });

  // Assessment requests — table not in generated types
  const { data: assessmentRequests } = await adminClient
    .from('assessment_requests')
    .select('id, contact_email, contact_phone, platform, review_url, removal_reason, status, created_at, updated_at')
    .order('created_at', { ascending: false });

  const scansFull = await loadAdminBusinessScans(adminClient);
  const businessScans = scansFull.map((s) => ({
    id: s.id,
    status: s.status,
    reviews_found: s.reviews_found,
    threats_found: s.threats_found,
    scan_type: s.scan_type,
    created_at: s.created_at,
    completed_at: s.completed_at,
    business_name: s.business_name,
    business_address: s.business_address,
    business_rating: s.business_rating,
    business_total_reviews: s.business_total_reviews,
    user_email: s.user_email,
  }));

  // AI advisor cases (review_cases) with user email and business name
  const { data: casesRaw } = await adminClient
    .from('review_cases')
    .select('id, platform, review_url, review_text, review_rating, reviewer_name, status, ai_confidence, ai_removal_ground, ai_strategy, removal_reasons, created_at, user_id')
    .order('created_at', { ascending: false });

  const caseRows = casesRaw ?? [];
  const caseUserIds = [...new Set(caseRows.map((c: { user_id: string }) => c.user_id))];
  const { data: caseUsers } = caseUserIds.length > 0
    ? await adminClient.from('user_data').select('user_id, email').in('user_id', caseUserIds)
    : { data: [] };
  const caseUserMap = new Map((caseUsers ?? []).map((u: { user_id: string; email: string | null }) => [u.user_id, u.email]));

  // Resolve business names: review_cases.review_url → scanned_reviews → business_scans → business_profiles
  const caseReviewUrls = [...new Set(caseRows.map((c: { review_url: string }) => c.review_url).filter(Boolean))];
  const { data: matchedReviews } = caseReviewUrls.length > 0
    ? await adminClient.from('scanned_reviews').select('review_url, scan_id').in('review_url', caseReviewUrls)
    : { data: [] };
  const reviewScanIds = [...new Set((matchedReviews ?? []).map((r: { scan_id: string }) => r.scan_id))];
  const { data: matchedScans } = reviewScanIds.length > 0
    ? await adminClient.from('business_scans').select('id, business_profile_id').in('id', reviewScanIds)
    : { data: [] };
  const scanProfileIds = [...new Set((matchedScans ?? []).map((s: { business_profile_id: string }) => s.business_profile_id))];
  const { data: matchedProfiles } = scanProfileIds.length > 0
    ? await adminClient.from('business_profiles').select('id, name').in('id', scanProfileIds)
    : { data: [] };

  const scanToProfile = new Map((matchedScans ?? []).map((s: { id: string; business_profile_id: string }) => [s.id, s.business_profile_id]));
  const profileToName = new Map((matchedProfiles ?? []).map((p: { id: string; name: string }) => [p.id, p.name]));
  const urlToBusinessName = new Map<string, string>();
  for (const r of matchedReviews ?? []) {
    const typed = r as { review_url: string; scan_id: string };
    const pid = scanToProfile.get(typed.scan_id);
    const name = pid ? profileToName.get(pid) as string | undefined : undefined;
    if (name && !urlToBusinessName.has(typed.review_url)) {
      urlToBusinessName.set(typed.review_url, name);
    }
  }

  const advisorCases = caseRows.map((c: { id: string; platform: string; review_url: string; review_text: string | null; review_rating: number | null; reviewer_name: string | null; status: string; ai_confidence: string | null; ai_removal_ground: string | null; ai_strategy: string | null; removal_reasons: string[] | null; created_at: string; user_id: string }) => ({
    ...c,
    user_email: (caseUserMap.get(c.user_id) as string | null) ?? null,
    business_name: urlToBusinessName.get(c.review_url) ?? null,
  }));

  return (
    <div className="w-full max-w-[95%] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <RemovalRequestsPageClient
        removalRequests={removalRequests ?? []}
        assessmentRequests={assessmentRequests ?? []}
        statusCounts={statusCounts}
        totalRemovalCount={totalRemovalCount}
        businessScans={businessScans}
        advisorCases={advisorCases}
      />
    </div>
  );
}
