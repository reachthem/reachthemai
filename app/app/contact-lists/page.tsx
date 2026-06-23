import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ContactListsClient from '@/components/contacts/ContactListsClient';

export const metadata: Metadata = {
  title: 'Contact Lists',
  description: 'Create and manage contact lists.',
};

export const dynamic = 'force-dynamic';

export default async function ContactListsPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-secondary-500 mb-4">
        <Link href="/app/contacts" className="hover:text-secondary-700">Contacts</Link>
        <span>/</span>
        <span className="text-secondary-900 font-medium">Lists</span>
      </nav>
      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Contact Lists</h1>
      <p className="text-secondary-500 mb-6">
        Create and manage lists to organize your contacts. Assign contacts from the Contacts page.
      </p>
      <ContactListsClient />
    </div>
  );
}
