import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getAutomation } from '@/app/actions/automations';
import AutomationEditClient from '@/components/automations/AutomationEditClient';

export const metadata: Metadata = {
  title: 'Edit automation',
  description: 'Edit automation details, keyword phrases, and settings.',
};

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function AutomationEditPage({ params }: Props) {
  const { id } = await params;
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const automation = await getAutomation(id);
  if (!automation) notFound();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-secondary-500 mb-6">
        <Link href="/app/automations" className="hover:text-secondary-700">Automations</Link>
        <span>/</span>
        <Link href={`/app/automations/${id}`} className="hover:text-secondary-700">Detail</Link>
        <span>/</span>
        <span className="text-secondary-900 font-medium">Edit</span>
      </nav>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Edit automation</h1>
          <p className="mt-1 text-sm text-secondary-500 max-w-2xl">
            Update name, keyword phrases, contact settings, and filters.
          </p>
        </div>
      </div>
      <AutomationEditClient automation={automation} />
    </div>
  );
}
