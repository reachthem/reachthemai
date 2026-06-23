'use server';

import { createSSRSassClient } from '@/lib/supabase/server';

export async function getContactLists() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return [];

  const { data } = await supabase
    .from('contact_lists')
    .select('*')
    .eq('user_id', user.id)
    .order('name');
  return data ?? [];
}

export async function getContactListsWithCounts() {
  const lists = await getContactLists();
  if (lists.length === 0) return [];

  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const withCounts = await Promise.all(
    lists.map(async (list) => {
      const { count } = await supabase
        .from('contact_list_members')
        .select('*', { count: 'exact', head: true })
        .eq('contact_list_id', list.id);
      return { ...list, contactCount: count ?? 0 };
    })
  );
  return withCounts;
}

export async function createContactList(name: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('contact_lists')
    .insert({ user_id: user.id, name: name.trim() })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function updateContactList(id: string, name: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('contact_lists')
    .update({ name: name.trim(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function deleteContactList(id: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('contact_lists')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function assignContactsToList(contactIds: string[], listId: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { data: list } = await supabase
    .from('contact_lists')
    .select('id')
    .eq('id', listId)
    .eq('user_id', user.id)
    .single();
  if (!list) throw new Error('List not found');

  const rows = contactIds.map((saved_contact_id) => ({
    contact_list_id: listId,
    saved_contact_id,
  }));

  const { error } = await supabase
    .from('contact_list_members')
    .upsert(rows, { onConflict: 'contact_list_id,saved_contact_id', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}
