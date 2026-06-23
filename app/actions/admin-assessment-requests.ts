'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export async function updateAssessmentRequestStatus(
  requestId: string,
  newStatus: string,
  adminUserId: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: current, error: fetchError } = await supabase
    .from('assessment_requests')
    .select('status_history')
    .eq('id', requestId)
    .single();

  if (fetchError || !current) throw new Error('Assessment request not found');

  const history = (current.status_history as Array<Record<string, string>>) ?? [];
  const newEntry = {
    status: newStatus,
    changed_at: new Date().toISOString(),
    changed_by: adminUserId,
  };

  const { data, error } = await supabase
    .from('assessment_requests')
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

export async function updateAssessmentAdminNotes(requestId: string, notes: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data, error } = await supabase
    .from('assessment_requests')
    .update({ admin_notes: notes })
    .eq('id', requestId)
    .select('updated_at')
    .single();

  if (error) throw new Error(error.message);
  return { success: true, updated_at: data.updated_at };
}

export async function copyAssessmentToRemovalRequest(assessmentId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;

  const { data: assessment, error: fetchError } = await supabase
    .from('assessment_requests')
    .select('*')
    .eq('id', assessmentId)
    .single();

  if (fetchError || !assessment) throw new Error('Assessment request not found');

  const { data: removal, error: insertError } = await supabase
    .from('removal_requests')
    .insert({
      contact_email: assessment.contact_email,
      contact_phone: assessment.contact_phone ?? null,
      platform: assessment.platform ?? null,
      review_url: assessment.review_url ?? null,
      review_content: assessment.review_content ?? null,
      review_author: assessment.review_author ?? null,
      removal_reason: assessment.removal_reason ?? null,
      description: assessment.description ?? null,
      evidence_urls: assessment.evidence_urls ?? [],
      current_step: 4,
      status: 'ready_for_payment',
      status_history: [{ status: 'ready_for_payment', changed_at: new Date().toISOString(), changed_by: 'system' }],
      user_id: assessment.user_id ?? null,
    })
    .select('id')
    .single();

  if (insertError) throw new Error(insertError.message);
  return { removalRequestId: removal.id };
}
