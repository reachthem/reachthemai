'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRSassClient } from '@/lib/supabase/server';
import { reviewCaseIntakeSchema, type ReviewCaseIntakeData } from '@/lib/schemas/review-case';
import type { Tables } from '@/lib/types';

export type ReviewCase = Tables<'review_cases'>;

async function getAuthenticatedUserId(): Promise<string> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user.id;
}

export async function createReviewCase(data: ReviewCaseIntakeData): Promise<{ success: true; caseId: string }> {
  const userId = await getAuthenticatedUserId();
  const parsed = reviewCaseIntakeSchema.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: row, error } = await supabase
    .from('review_cases')
    .insert({
      user_id: userId,
      platform: parsed.platform,
      review_url: parsed.review_url,
      review_text: parsed.review_text,
      review_rating: parsed.review_rating ?? null,
      review_date: parsed.review_date ?? null,
      reviewer_name: parsed.reviewer_name ?? null,
      removal_reasons: parsed.removal_reasons,
      has_responded: parsed.has_responded,
      user_response: parsed.user_response ?? null,
      reviewer_context: parsed.reviewer_context ?? null,
      status: 'draft',
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { success: true, caseId: row.id };
}

export async function getReviewCases(): Promise<{ cases: ReviewCase[] }> {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data, error } = await supabase
    .from('review_cases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return { cases: data ?? [] };
}

export async function getReviewCase(caseId: string): Promise<{ reviewCase: ReviewCase | null }> {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data, error } = await supabase
    .from('review_cases')
    .select('*')
    .eq('id', caseId)
    .eq('user_id', userId)
    .single();

  if (error) return { reviewCase: null };
  return { reviewCase: data };
}

export async function updateReviewCaseStatus(
  caseId: string,
  newStatus: string,
  notes?: string
): Promise<{ success: true }> {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: existing, error: fetchError } = await supabase
    .from('review_cases')
    .select('status_history')
    .eq('id', caseId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !existing) throw new Error('Case not found');

  const history = Array.isArray(existing.status_history) ? existing.status_history : [];
  history.push({
    status: newStatus,
    changed_at: new Date().toISOString(),
    notes: notes ?? null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePayload: any = {
    status: newStatus,
    status_history: history,
    status_notes: notes ?? null,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === 'removed') updatePayload.removed_at = new Date().toISOString();
  if (newStatus === 'reported') updatePayload.removal_submitted_at = new Date().toISOString();

  const { error } = await supabase
    .from('review_cases')
    .update(updatePayload)
    .eq('id', caseId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteReviewCase(caseId: string): Promise<{ success: true }> {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { error } = await supabase
    .from('review_cases')
    .delete()
    .eq('id', caseId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getUserSubscriptionTier(): Promise<string> {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data } = await supabase
    .from('user_data')
    .select('subscription_tier')
    .eq('user_id', userId)
    .single();

  return data?.subscription_tier ?? 'free';
}

export async function getRemovalAdvisorPriceId(): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: modeRow } = await supabase
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'stripe_mode')
    .single();

  const mode = modeRow?.option_value ?? 'test';
  const priceKey = mode === 'live'
    ? 'stripe_price_id_removal_advisor_live'
    : 'stripe_price_id_removal_advisor_sandbox';

  const { data: priceRow } = await supabase
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', priceKey)
    .single();

  return priceRow?.option_value ?? '';
}
