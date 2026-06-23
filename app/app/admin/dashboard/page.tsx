import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAdminDashboardStats } from '@/app/actions/admin-dashboard';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import { AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin overview: users, revenue, subscriptions, and platform metrics.',
  openGraph: {
    title: 'Admin Dashboard | Reach Them AI',
    description: 'Admin overview of platform metrics.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  const { stats, error } = await getAdminDashboardStats();

  if (error || !stats) {
    return (
      <div className="space-y-6 w-[95%] mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform overview and metrics</p>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Error</CardTitle>
            </div>
            <CardDescription>{error ?? 'Failed to load dashboard stats.'}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-[95%] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Platform overview and metrics</p>
      </div>
      <AdminDashboardClient stats={stats} />
    </div>
  );
}
