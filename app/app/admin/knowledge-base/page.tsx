import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import KnowledgeBasePageClient from './KnowledgeBasePageClient';

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description:
    'Admin: Manage the removal knowledge base. Edit platform policies, removal grounds, and guidance used by the AI Review Advisor.',
  openGraph: {
    title: 'Knowledge Base | Admin | Reach Them AI',
    description: 'Manage removal knowledge base and platform policies.',
    images: ['/featured.png'],
    type: 'website',
  },
};

export default async function AdminKnowledgeBasePage() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/app');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;
  const { data: entries } = await adminClient
    .from('removal_knowledge_base')
    .select('*')
    .order('platform', { ascending: true })
    .order('ground', { ascending: true });

  return <KnowledgeBasePageClient entries={entries ?? []} />;
}
