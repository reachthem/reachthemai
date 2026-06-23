'use server';

import { createSSRSassClient } from '@/lib/supabase/server';

export interface PlaceForSave {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  totalReviews: number | null;
  primaryType: string | null;
  phone: string | null;
  website: string | null;
  mapsUrl: string | null;
}

export async function saveContacts(
  places: PlaceForSave[],
  automationId?: string | null
): Promise<{ saved: number; duplicates: number; error?: string }> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { saved: 0, duplicates: 0, error: 'Unauthorized' };
  }

  if (!places?.length) {
    return { saved: 0, duplicates: 0, error: 'No places to save' };
  }

  const rows = places.map((p) => ({
    user_id: user.id,
    automation_id: automationId ?? null,
    place_id: p.placeId,
    name: p.name || null,
    address: p.address || null,
    phone: p.phone || null,
    website: p.website || null,
    rating: p.rating != null ? p.rating : null,
    total_reviews: p.totalReviews != null ? p.totalReviews : null,
    primary_type: p.primaryType || null,
    maps_url: p.mapsUrl || null,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from('saved_contacts')
    .upsert(rows, {
      onConflict: 'user_id,place_id',
      ignoreDuplicates: true,
    })
    .select('id');

  if (error) {
    console.error('saveContacts error:', error);
    return { saved: 0, duplicates: places.length, error: error.message };
  }

  const saved = data?.length ?? 0;
  const duplicates = places.length - saved;
  return { saved, duplicates };
}

/** Returns saved_contact id and place_id for the current user's contacts matching the given place_ids. */
export async function getSavedContactIdsByPlaceIds(placeIds: string[]): Promise<{ id: string; place_id: string }[]> {
  if (!placeIds?.length) return [];
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return [];

  const { data } = await supabase
    .from('saved_contacts')
    .select('id, place_id')
    .eq('user_id', user.id)
    .in('place_id', placeIds);
  return (data ?? []) as { id: string; place_id: string }[];
}

export async function getAutomationContacts(automationId: string, page: number, perPage: number) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { contacts: [], total: 0 };

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { count } = await supabase
    .from('saved_contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('automation_id', automationId);

  const { data } = await supabase
    .from('saved_contacts')
    .select('*')
    .eq('user_id', user.id)
    .eq('automation_id', automationId)
    .order('created_at', { ascending: false })
    .range(from, to);

  return { contacts: data ?? [], total: count ?? 0 };
}

/** Returns place_ids that the current user has in saved_contacts (for highlighting on Search Businesses). */
export async function getSavedPlaceIds(placeIds: string[]): Promise<string[]> {
  if (!placeIds?.length) return [];
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return [];

  const { data } = await supabase
    .from('saved_contacts')
    .select('place_id')
    .eq('user_id', user.id)
    .in('place_id', placeIds);
  return (data ?? []).map((r) => r.place_id);
}

export type ContactSortBy = 'name' | 'rating' | 'total_reviews' | 'created_at';

export async function getMyContactsFiltered(options: {
  search?: string;
  city?: string;
  state?: string;
  zip?: string;
  emailStatus?: 'found' | 'not_found' | 'not_attempted';
  validationStatus?: 'validated' | 'not_valid' | 'not_attempted';
  listId?: string;
  page: number;
  perPage: number;
  sortBy?: ContactSortBy;
  sortDir?: 'asc' | 'desc';
}): Promise<{ contacts: Awaited<ReturnType<typeof getMyContacts>>; total: number }> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { contacts: [], total: 0 };

  let query = supabase
    .from('saved_contacts')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  const search = options.search?.trim();
  if (search) {
    query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`);
  }
  const city = options.city?.trim();
  if (city) {
    query = query.ilike('address', `%${city}%`);
  }
  const state = options.state?.trim();
  if (state) {
    query = query.ilike('address', `%${state}%`);
  }
  const zip = options.zip?.trim();
  if (zip) {
    query = query.ilike('address', `%${zip}%`);
  }

  if (options.emailStatus === 'found') {
    query = query.not('email_address', 'is', null).neq('email_address', 'not_found');
  } else if (options.emailStatus === 'not_found') {
    query = query.eq('email_address', 'not_found');
  } else if (options.emailStatus === 'not_attempted') {
    query = query.is('email_address', null);
  }

  if (options.validationStatus === 'validated') {
    query = query.eq('email_validation_status', 'validated');
  } else if (options.validationStatus === 'not_valid') {
    query = query.eq('email_validation_status', 'not_valid');
  } else if (options.validationStatus === 'not_attempted') {
    query = query.is('email_validation_status', null);
  }

  if (options.listId) {
    if (options.listId === '__no_list__') {
      const { data: listRows } = await supabase
        .from('contact_lists')
        .select('id')
        .eq('user_id', user.id);
      const listIds = (listRows ?? []).map((r) => r.id).filter(Boolean);
      if (listIds.length > 0) {
        const { data: memberIds } = await supabase
          .from('contact_list_members')
          .select('saved_contact_id')
          .in('contact_list_id', listIds);
        const idsInAnyList = (memberIds ?? []).map((r) => r.saved_contact_id).filter(Boolean);
        if (idsInAnyList.length > 0) {
          query = query.not('id', 'in', `("${idsInAnyList.join('","')}")`);
        }
      }
    } else {
      const { data: memberIds } = await supabase
        .from('contact_list_members')
        .select('saved_contact_id')
        .eq('contact_list_id', options.listId);
      const ids = (memberIds ?? []).map((r) => r.saved_contact_id).filter(Boolean);
      if (ids.length > 0) {
        query = query.in('id', ids);
      } else {
        query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // no matches
      }
    }
  }

  const sortBy = options.sortBy ?? 'created_at';
  const sortDir = options.sortDir ?? 'desc';
  const col = sortBy === 'total_reviews' ? 'total_reviews' : sortBy;
  query = query.order(col, { ascending: sortDir === 'asc', nullsFirst: false });

  const from = (options.page - 1) * options.perPage;
  const to = from + options.perPage - 1;
  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error('getMyContactsFiltered error:', error);
    return { contacts: [], total: 0 };
  }
  return { contacts: data ?? [], total: count ?? 0 };
}

/** Returns all contacts matching the same filters (for CSV export). Max 5000. */
export async function getMyContactsFilteredAll(options: {
  search?: string;
  city?: string;
  state?: string;
  zip?: string;
  emailStatus?: 'found' | 'not_found' | 'not_attempted';
  validationStatus?: 'validated' | 'not_valid' | 'not_attempted';
  listId?: string;
  sortBy?: ContactSortBy;
  sortDir?: 'asc' | 'desc';
}) {
  const { contacts } = await getMyContactsFiltered({
    ...options,
    page: 1,
    perPage: 5000,
  });
  return contacts;
}

export async function getMyContacts() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return [];

  const { data } = await supabase
    .from('saved_contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getAutomationContactsAll(automationId: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return [];

  const { data } = await supabase
    .from('saved_contacts')
    .select('*')
    .eq('user_id', user.id)
    .eq('automation_id', automationId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getContact(contactId: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data } = await supabase
    .from('saved_contacts')
    .select('*')
    .eq('id', contactId)
    .eq('user_id', user.id)
    .single();
  return data;
}

export async function deleteContact(contactId: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('saved_contacts')
    .delete()
    .eq('id', contactId)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function deleteContacts(contactIds: string[]) {
  if (!contactIds?.length) return;
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('saved_contacts')
    .delete()
    .in('id', contactIds)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function updateContactEmailInfo(
  contactId: string,
  data: { email_address?: string | null; contact_first_name?: string | null; contact_last_name?: string | null }
) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('saved_contacts')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', contactId)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function updateContactEmailValidationStatus(
  contactId: string,
  status: 'validated' | 'not_valid'
) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('saved_contacts')
    .update({ email_validation_status: status, updated_at: new Date().toISOString() })
    .eq('id', contactId)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function updateContact(
  contactId: string,
  data: {
    name?: string | null;
    address?: string | null;
    phone?: string | null;
    website?: string | null;
    rating?: number | null;
    total_reviews?: number | null;
    primary_type?: string | null;
    email_address?: string | null;
    contact_first_name?: string | null;
    contact_last_name?: string | null;
    email_validation_status?: string | null;
  }
) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const payload: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() };
  const { data: updated, error } = await supabase
    .from('saved_contacts')
    .update(payload)
    .eq('id', contactId)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return updated;
}
