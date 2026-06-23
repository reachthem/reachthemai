import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAdminUserDataList } from '@/app/actions/admin-dashboard';
import AdminUsersTable from '@/components/admin/AdminUsersTable';

export const metadata: Metadata = {
  title: 'Admin · Users',
  description: 'All platform users: email, subscription, credits, and roles.',
  openGraph: {
    title: 'Admin Users | Reach Them AI',
    description: 'Admin user directory.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardUsersPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  const { data: userDataList, error: userDataError } = await getAdminUserDataList();

  return (
    <div className="space-y-6 w-[95%] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-2">All registered users and subscription details</p>
      </div>
      <AdminUsersTable rows={userDataList ?? []} error={userDataError} />
    </div>
  );
}
