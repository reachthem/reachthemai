'use server';

import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { revalidatePath } from 'next/cache';

export async function deleteAdvisorCase(caseId: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) throw new Error('Unauthorized');

  const adminClient = await createServerAdminClient();
  const { error } = await adminClient
    .from('review_cases')
    .delete()
    .eq('id', caseId);

  if (error) throw new Error(error.message);
  revalidatePath('/app/admin/removal-requests');
  return { success: true };
}
