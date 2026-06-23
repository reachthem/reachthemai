'use server';

import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

async function requireAdmin() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) throw new Error('Forbidden');
  return user;
}

export async function getKnowledgeBaseEntries() {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data, error } = await supabase
    .from('removal_knowledge_base')
    .select('*')
    .order('platform', { ascending: true })
    .order('ground', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function toggleKnowledgeBaseActive(id: string, isActive: boolean) {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { error } = await supabase
    .from('removal_knowledge_base')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function upsertKnowledgeBaseEntry(data: {
  id?: string;
  platform: string;
  ground: string;
  ground_label: string;
  qualification_criteria: string;
  required_info: string;
  removal_steps: string;
  escalation_note?: string;
  expected_timeline?: string;
  success_rate?: string;
  last_verified?: string;
  is_active?: boolean;
}) {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const payload = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    const { id, ...updateData } = payload;
    const { error } = await supabase
      .from('removal_knowledge_base')
      .update(updateData)
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('removal_knowledge_base')
      .insert(payload);
    if (error) throw new Error(error.message);
  }

  return { success: true };
}

export async function deleteKnowledgeBaseEntry(id: string) {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { error } = await supabase
    .from('removal_knowledge_base')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}
