'use server';

import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { revalidatePath } from 'next/cache';

export async function updateRemovalRequestStatus(
  requestId: string,
  newStatus: string,
  adminUserId: string
) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) throw new Error('Unauthorized');

  const { data: current, error: fetchError } = await supabase
    .from('removal_requests')
    .select('status_history')
    .eq('id', requestId)
    .single();

  if (fetchError || !current) throw new Error('Request not found');

  const history = (current.status_history as Array<Record<string, string>>) ?? [];
  const newEntry = {
    status: newStatus,
    changed_at: new Date().toISOString(),
    changed_by: adminUserId,
  };

  const { data, error } = await supabase
    .from('removal_requests')
    .update({
      status: newStatus,
      status_history: [...history, newEntry],
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateAdminNotes(requestId: string, notes: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('removal_requests')
    .update({ admin_notes: notes })
    .eq('id', requestId)
    .select('updated_at')
    .single();

  if (error) throw new Error(error.message);
  return { success: true, updated_at: data.updated_at };
}

export async function deleteRemovalRequest(requestId: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) throw new Error('Unauthorized');

  // Use service role client so RLS does not block admin delete
  const adminClient = await createServerAdminClient();
  const { error } = await adminClient
    .from('removal_requests')
    .delete()
    .eq('id', requestId);

  if (error) throw new Error(error.message);
  revalidatePath('/app/admin/removal-requests');
  return { success: true };
}
