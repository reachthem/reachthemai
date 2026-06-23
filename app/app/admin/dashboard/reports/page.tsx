import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { redirect } from 'next/navigation';
import { loadAdminPlaceReports } from '@/lib/admin/loadAdminPlaceReports';
import AdminReportsTable from '@/components/admin/AdminReportsTable';

export const metadata: Metadata = {
  title: 'Admin · Review Overview & Impact Reports',
  description: 'All review overview and impact reports generated from the public report page.',
  openGraph: {
    title: 'Review Overview & Impact Reports | Reach Them AI',
    description: 'Admin view of all generated business impact reports.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardReportsPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;
  const reports = await loadAdminPlaceReports(adminClient);

  return (
    <div className="space-y-6 w-[95%] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Overview and Impact Reports</h1>
        <p className="text-muted-foreground mt-2">
          All business impact reports generated from the public report page. Click <strong>View report</strong> to see
          the full report.
        </p>
      </div>
      <AdminReportsTable reports={reports} />
    </div>
  );
}
