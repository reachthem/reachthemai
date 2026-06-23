import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SearchBusinessesClient from '@/components/admin/SearchBusinessesClient';

export const metadata: Metadata = {
  title: 'Search Businesses',
  description:
    'Admin: Search for businesses by keyword and/or location using Google Places.',
  openGraph: {
    title: 'Search Businesses | Admin | Reach Them AI',
    description: 'Search for businesses by keyword and location.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default async function AdminSearchBusinessesPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Search Businesses
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Find businesses by keyword and/or location (city, state). Both fields are optional.
        </p>
      </div>
      <SearchBusinessesClient />
    </div>
  );
}
