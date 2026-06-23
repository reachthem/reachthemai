import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAdminSettings,
} from '@/app/actions/admin-settings';
import AdminSettingsForm from '@/components/admin/AdminSettingsForm';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { AlertCircle, FileSearch, ShieldOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Settings',
  description:
    'Admin: Configure application-wide settings including pricing, AI options, email notifications, and feature flags for Reach Them AI.',
  openGraph: {
    title: 'Admin Settings | Reach Them AI',
    description: 'Configure application-wide admin settings.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const { settings, error } = await getAdminSettings();

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure application-wide settings
          </p>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure application-wide settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/app/admin/knowledge-base">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Removal Knowledge Base</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Update platform removal policies and AI advisor instructions.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/app/admin/removal-requests">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldOff className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Review Removal Requests</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Manage and update professional removal request statuses.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {settings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Settings Found</CardTitle>
            <CardDescription>
              Run the database seed from Task 10.1.2 to populate settings.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <AdminSettingsForm settings={settings} />
      )}
    </div>
  );
}
