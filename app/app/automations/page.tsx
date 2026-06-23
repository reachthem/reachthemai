import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAutomations } from '@/app/actions/automations';
import { Plus } from 'lucide-react';
import AutomationsListClient from '@/components/automations/AutomationsListClient';

export const metadata: Metadata = {
  title: 'Automations',
  description: 'Manage lead-generation automations.',
};

export const dynamic = 'force-dynamic';

export default async function AutomationsPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const automations = await getAutomations();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Automations</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Create automations to find leads, get contact information, validate emails and send campaigns. Put your business development on autopilot.
          </p>
        </div>
        <Link
          href="/app/automations/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shrink-0 [white-space:nowrap]"
        >
          <Plus className="h-4 w-4" />
          <span className="whitespace-nowrap">Create New Automation</span>
        </Link>
      </div>

      {automations.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-400">No automations yet.</p>
          <Link
            href="/app/automations/create"
            className="mt-4 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium"
          >
            Create your first automation
            <Plus className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <AutomationsListClient automations={automations} />
      )}
    </div>
  );
}
