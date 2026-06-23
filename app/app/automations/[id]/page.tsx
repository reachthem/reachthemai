import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getAutomation } from '@/app/actions/automations';
import { getAutomationContacts } from '@/app/actions/contacts';
import AutomationDetailClient from '@/components/automations/AutomationDetailClient';

export const metadata: Metadata = {
  title: 'Automation detail',
  description: 'View automation and its contacts.',
};

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; perPage?: string }> };

export default async function AutomationDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page: pageStr, perPage: perPageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
  const perPage = Math.min(100, Math.max(25, parseInt(perPageStr ?? '25', 10) || 25));

  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const automation = await getAutomation(id);
  if (!automation) notFound();

  const { contacts, total } = await getAutomationContacts(id, page, perPage);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-secondary-500 mb-6">
        <Link href="/app/automations" className="hover:text-secondary-700">Automations</Link>
        <span>/</span>
        <span className="text-secondary-900 truncate">Detail</span>
      </nav>
      <AutomationDetailClient
        automation={automation}
        initialContacts={contacts}
        totalContacts={total}
        page={page}
        perPage={perPage}
      />
    </div>
  );
}
