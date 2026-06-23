'use server';

import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { revalidatePath } from 'next/cache';

export async function deleteBusinessScan(scanId: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) throw new Error('Unauthorized');

  const adminClient = await createServerAdminClient();
  const { error } = await adminClient
    .from('business_scans')
    .delete()
    .eq('id', scanId);

  if (error) throw new Error(error.message);
  revalidatePath('/app/admin/removal-requests');
  revalidatePath('/app/admin/dashboard/scans');
  return { success: true };
}
