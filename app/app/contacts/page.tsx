import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ContactsTableClient from '@/components/contacts/ContactsTableClient';

export const metadata: Metadata = {
  title: 'Contacts',
  description: 'View all saved contacts.',
};

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  return (
    <div className="w-full max-w-[98%] md:max-w-[95%] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Saved Contacts</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        All contacts saved from Search Businesses and automations.
      </p>
      <ContactsTableClient />
    </div>
  );
}
