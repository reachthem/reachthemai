'use server';

import { createSSRSassClient } from '@/lib/supabase/server';

export async function createAutomation(payload: {
  name?: string | null;
  keyword_phrases: string[];
  automatically_get_contact_data: boolean;
  contact_ai_model?: string | null;
  assign_to_list_id?: string | null;
  validate_emails?: boolean;
  do_not_add_without_contact?: boolean;
  max_contacts?: number | null;
  filter_rating_min?: number | null;
  filter_has_website?: string | null;
  filter_min_reviews?: number | null;
  filter_max_reviews?: number | null;
  search_radius_miles?: number | null;
  /** If false, automation is saved with status inactive (save only). Default true = create and run. */
  run_after_create?: boolean;
}) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Unauthorized');

  const phrases = payload.keyword_phrases?.filter((p) => typeof p === 'string' && p.trim().length > 0) ?? [];
  if (phrases.length === 0) throw new Error('At least one keyword phrase is required.');

  const status = payload.run_after_create !== false ? 'active' : 'inactive';

  const { data, error } = await supabase
    .from('automations')
    .insert({
      user_id: user.id,
      name: payload.name?.trim() || null,
      keyword_phrases: phrases,
      automatically_get_contact_data: payload.automatically_get_contact_data ?? false,
      contact_ai_model: payload.contact_ai_model ?? null,
      assign_to_list_id: payload.assign_to_list_id ?? null,
      validate_emails: payload.validate_emails ?? false,
      do_not_add_without_contact: payload.do_not_add_without_contact ?? false,
      max_contacts: payload.max_contacts ?? null,
      filter_rating_min: payload.filter_rating_min ?? null,
      filter_has_website: payload.filter_has_website ?? null,
      filter_min_reviews: payload.filter_min_reviews ?? null,
      filter_max_reviews: payload.filter_max_reviews ?? null,
      search_radius_miles: payload.search_radius_miles ?? null,
      status,
      current_keyword_index: 0,
      page_token: null,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { automationId: data.id, userId: user.id };
}

export async function getAutomations() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return [];

  const { data } = await supabase
    .from('automations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getAutomation(id: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data } = await supabase
    .from('automations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  return data;
}

export async function updateAutomation(
  id: string,
  updates: {
    status?: string;
    keyword_phrases?: string[];
    name?: string | null;
    max_contacts?: number | null;
    automatically_get_contact_data?: boolean;
    contact_ai_model?: string | null;
    assign_to_list_id?: string | null;
    validate_emails?: boolean;
    do_not_add_without_contact?: boolean;
    filter_rating_min?: number | null;
    filter_has_website?: string | null;
    filter_min_reviews?: number | null;
    filter_max_reviews?: number | null;
    search_radius_miles?: number | null;
  }
) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('automations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
}

export async function deleteAutomation(id: string) {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase.from('automations').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw new Error(error.message);
}
