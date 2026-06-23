'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRSassClient } from '@/lib/supabase/server';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type Step1Data,
  type Step2Data,
  type Step3Data,
  type Step4Data,
} from '@/lib/schemas/removal-request';
import { PLATFORMS } from '@/lib/schemas/removal-request';

export async function createDraftWithPrefill(prefill: {
  platform?: string | null;
  review_url?: string | null;
  review_content?: string | null;
  review_author?: string | null;
  review_rating?: number | null;
  review_date?: string | null;
}) {
  const sassClient = await createSSRSassClient();
  const supabaseAuth = sassClient.getSupabaseClient();
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) throw new Error('You must be signed in to prefill a removal request.');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data: userData } = await adminClient
    .from('user_data')
    .select('email, phone_number')
    .eq('user_id', user.id)
    .single();

  const contactEmail = (userData?.email as string) || user.email;
  if (!contactEmail) throw new Error('No email found. Please set your email in Settings.');

  const platform = prefill.platform && PLATFORMS.includes(prefill.platform as (typeof PLATFORMS)[number])
    ? prefill.platform
    : 'google';
  const reviewUrl = prefill.review_url && prefill.review_url.startsWith('http') ? prefill.review_url : null;

  const insertPayload: Record<string, unknown> = {
    contact_email: contactEmail,
    contact_phone: (userData?.phone_number as string) ?? null,
    current_step: 1,
    status: 'draft',
    user_id: user.id,
    platform,
    review_url: reviewUrl,
    review_content: prefill.review_content ?? null,
    review_author: prefill.review_author ?? null,
  };
  if (prefill.review_rating != null) insertPayload.review_rating = prefill.review_rating;
  if (prefill.review_date != null) insertPayload.review_date = prefill.review_date;

  const { data: row, error } = await adminClient
    .from('removal_requests')
    .insert(insertPayload)
    .select('id, draft_key')
    .single();

  if (error) throw new Error(error.message);
  return { id: row.id as string, draft_key: row.draft_key as string };
}

export async function createDraftRequest(data: Step1Data) {
  const parsed = step1Schema.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: row, error } = await supabase
    .from('removal_requests')
    .insert({
      contact_email: parsed.contact_email,
      contact_phone: parsed.contact_phone,
      current_step: 1,
      status: 'draft',
    })
    .select('id, draft_key')
    .single();

  if (error) throw new Error(error.message);
  return { id: row.id as string, draft_key: row.draft_key as string };
}

export async function updateRequestStep1(draftKey: string, data: Step1Data) {
  const parsed = step1Schema.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: existing } = await supabase
    .from('removal_requests')
    .select('current_step')
    .eq('draft_key', draftKey)
    .single();

  if (!existing) throw new Error('Draft not found');

  const newStep = Math.max(existing.current_step ?? 1, 1);

  const { error } = await supabase
    .from('removal_requests')
    .update({
      contact_email: parsed.contact_email,
      contact_phone: parsed.contact_phone,
      current_step: newStep,
    })
    .eq('draft_key', draftKey);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function linkUserToDraft(draftKey: string, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: existing } = await supabase
    .from('removal_requests')
    .select('id')
    .eq('draft_key', draftKey)
    .single();

  if (!existing) throw new Error('Draft not found');

  const { error } = await supabase
    .from('removal_requests')
    .update({ user_id: userId })
    .eq('draft_key', draftKey);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getDraft(draftKey: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data, error } = await supabase
    .from('removal_requests')
    .select('*')
    .eq('draft_key', draftKey)
    .single();

  if (error) return null;
  return data;
}

export async function updateRequestStep2(draftKey: string, data: Step2Data) {
  const parsed = step2Schema.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: existing } = await supabase
    .from('removal_requests')
    .select('current_step')
    .eq('draft_key', draftKey)
    .single();

  if (!existing) throw new Error('Draft not found');

  const newStep = Math.max(existing.current_step, 2);

  const { error } = await supabase
    .from('removal_requests')
    .update({
      platform: parsed.platform,
      review_url: parsed.review_url,
      review_content: parsed.review_content ?? null,
      review_author: parsed.review_author ?? null,
      ...(parsed.review_rating != null && { review_rating: parsed.review_rating }),
      ...(parsed.review_date != null && parsed.review_date !== '' && { review_date: parsed.review_date }),
      current_step: newStep,
    })
    .eq('draft_key', draftKey);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function updateRequestStep3(draftKey: string, data: Step3Data) {
  const parsed = step3Schema.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: existing } = await supabase
    .from('removal_requests')
    .select('current_step')
    .eq('draft_key', draftKey)
    .single();

  if (!existing) throw new Error('Draft not found');

  const newStep = Math.max(existing.current_step, 3);

  const { error } = await supabase
    .from('removal_requests')
    .update({
      removal_reason: null,
      description: parsed.description,
      current_step: newStep,
    })
    .eq('draft_key', draftKey);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function updateRequestStep4(draftKey: string, data: Step4Data) {
  const parsed = step4Schema.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: existing } = await supabase
    .from('removal_requests')
    .select('current_step')
    .eq('draft_key', draftKey)
    .single();

  if (!existing) throw new Error('Draft not found');

  const newStep = Math.max(existing.current_step, 4);

  const { error } = await supabase
    .from('removal_requests')
    .update({
      evidence_urls: parsed.evidence_urls ?? [],
      current_step: newStep,
    })
    .eq('draft_key', draftKey);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function setReadyForPayment(draftKey: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data, error } = await supabase
    .from('removal_requests')
    .update({
      status: 'ready_for_payment',
      current_step: 4,
    })
    .eq('draft_key', draftKey)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function submitFreeAssessment(draftKey: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data, error } = await supabase
    .from('removal_requests')
    .update({
      status: 'free_assessment',
      current_step: 4,
    })
    .eq('draft_key', draftKey)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}
