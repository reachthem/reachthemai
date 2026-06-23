import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Inbox } from 'lucide-react';
import SubmissionsTable from '@/components/contact/SubmissionsTable';

export const metadata: Metadata = {
  title: 'Submissions',
  description:
    'Admin: View and manage contact form submissions. Respond to inquiries about review removal and reputation management.',
  openGraph: {
    title: 'Submissions | Admin | Reach Them AI',
    description: 'Manage contact form submissions.',
    images: ['/featured.png'],
    type: 'website',
  },
};

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string | null;
  message: string;
  created_at: string;
}

export default async function AdminSubmissionsPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  const { data: rows } = await supabase
    .from('submissions')
    .select('id, first_name, last_name, email_address, phone_number, message, created_at')
    .order('created_at', { ascending: false });

  const submissions: Submission[] = rows ?? [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Submissions
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
              {submissions.length}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Contact form submissions from the public site.
          </p>
        </div>
      </div>

      <div className="p-2.5">
        {submissions.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Inbox className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No submissions yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              When visitors submit the contact form, their messages will appear here.
            </p>
          </div>
        ) : (
          <SubmissionsTable submissions={submissions} />
        )}
      </div>
    </div>
  );
}
