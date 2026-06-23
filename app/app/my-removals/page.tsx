import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MyRemovalsClient from './MyRemovalsClient';
import RemovalsStepsGuide from '@/components/app/RemovalsStepsGuide';
import VideoDemoButton from '@/components/app/VideoDemoButton';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Removals',
  description:
    'Track and manage your review removal requests. View status, submit new removal requests for bad Google reviews, and access case details.',
  openGraph: {
    title: 'My Removals | Reach Them AI',
    description: 'Track removal requests and submit new ones for Google, Yelp, and more.',
    images: ['/featured.png'],
    type: 'website',
  },
};
export const dynamic = 'force-dynamic';

export default async function MyRemovalsPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: rows } = await supabase
    .from('removal_requests')
    .select('id, platform, review_url, review_content, review_author, removal_reason, description, evidence_urls, status, status_history, contact_email, contact_phone, admin_notes, created_at, updated_at')
    .eq('user_id', user.id)
    .neq('status', 'draft')
    .order('created_at', { ascending: false });

  const requests = rows ?? [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Removals</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track the status of your review removal requests.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/submit-removal">Submit Another Removal</Link>
        </Button>
      </div>

      {requests.length === 0 && (
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex justify-center">
            <VideoDemoButton />
          </div>
          <RemovalsStepsGuide />
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Inbox className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No removal requests yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Submit a review for removal and track its progress here.
          </p>
          <Button asChild>
            <Link href="/submit-removal">Submit a Review for Removal</Link>
          </Button>
        </div>
      ) : (
        <MyRemovalsClient requests={requests} />
      )}
    </div>
  );
}
