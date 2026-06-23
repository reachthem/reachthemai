import type { Metadata } from 'next';
import { createSSRSassClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CreateAutomationForm from '@/components/automations/CreateAutomationForm';
import { Workflow } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create automation',
  description: 'Add keyword phrases and create an automation.',
};

export default async function CreateAutomationPage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <nav className="flex items-center gap-2 text-sm text-secondary-500">
        <Link href="/app/automations" className="hover:text-secondary-700">Automations</Link>
        <span>/</span>
        <span className="text-secondary-900 font-medium">New</span>
      </nav>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <Workflow className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Create automation</h1>
          <p className="text-secondary-500">Add keyword phrases and create an automation to run Google Places searches.</p>
        </div>
      </div>

      <CreateAutomationForm />
    </div>
  );
}
