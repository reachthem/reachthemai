import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { redirect } from 'next/navigation';
import { loadAdminBusinessScans } from '@/lib/admin/loadAdminBusinessScans';
import AdminScansTable from '@/components/admin/AdminScansTable';

export const metadata: Metadata = {
  title: 'Admin · Negative Review Reports',
  description: 'All Google review scans and negative review reports across users.',
  openGraph: {
    title: 'Negative Review Reports | Reach Them AI',
    description: 'Business scan audit trail.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardScansPage() {
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
  const scans = await loadAdminBusinessScans(adminClient);

  return (
    <div className="space-y-6 w-[95%] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Negative Review Reports</h1>
        <p className="text-muted-foreground mt-2">
          All business review scans and negative review reports. Use <strong>Open scan</strong> to view the same results page as the user (admins
          have access).
        </p>
      </div>
      <AdminScansTable scans={scans} />
    </div>
  );
}
