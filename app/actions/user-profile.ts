'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRSassClient } from '@/lib/supabase/server';

async function getAuthenticatedUser() {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

export type UserProfile = {
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  company_name: string | null;
  /** Registered auth email, for prefill when user_data.email is empty */
  auth_email: string | null;
};

export async function getUserProfile(): Promise<UserProfile> {
  const user = await getAuthenticatedUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data: row } = await adminClient
    .from('user_data')
    .select('full_name, email, phone_number, company_name')
    .eq('user_id', user.id)
    .single();

  return {
    full_name: row?.full_name ?? null,
    email: row?.email ?? null,
    phone_number: row?.phone_number ?? null,
    company_name: row?.company_name ?? null,
    auth_email: user.email ?? null,
  };
}

/**
 * Contact fields from user_data (email, phone_number) with auth email fallback — same rules as
 * createDraftWithPrefill in removal-requests. Used to prefill /submit-removal step 1 for signed-in users.
 */
export async function getContactPrefillForRemovalForm(): Promise<{
  contact_email: string;
  contact_phone: string;
} | null> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;
  const { data: row } = await adminClient
    .from('user_data')
    .select('email, phone_number')
    .eq('user_id', user.id)
    .single();

  return {
    contact_email: (row?.email as string) || user.email || '',
    contact_phone: (row?.phone_number as string) || '',
  };
}

export async function updateUserProfile(data: {
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  company_name?: string | null;
}) {
  const user = await getAuthenticatedUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { error } = await adminClient
    .from('user_data')
    .update({
      full_name: data.full_name ?? null,
      email: data.email ?? null,
      phone_number: data.phone_number ?? null,
      company_name: data.company_name ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  return { success: true };
}

/** Used to decide whether to show Get Started guides. */
export async function getOnboardingStatus(): Promise<{
  hasProSubmission: boolean;
  hasPhone: boolean;
  hasScannedBusiness: boolean;
  hasAIAnalysis: boolean;
}> {
  const user = await getAuthenticatedUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const [userDataRes, removalCountRes, scansCountRes, reviewCasesCountRes] = await Promise.all([
    adminClient.from('user_data').select('phone_number').eq('user_id', user.id).single(),
    adminClient.from('removal_requests').select('id', { count: 'exact', head: true }).eq('user_id', user.id).neq('status', 'draft'),
    adminClient.from('business_scans').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    adminClient.from('review_cases').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  const phone = (userDataRes?.data as { phone_number?: string | null } | null)?.phone_number;
  const hasPhone = !!phone && String(phone).trim().length > 0;
  const hasProSubmission = (removalCountRes?.count ?? 0) > 0;
  const hasScannedBusiness = (scansCountRes?.count ?? 0) > 0;
  const hasAIAnalysis = (reviewCasesCountRes?.count ?? 0) > 0;

  return { hasProSubmission, hasPhone, hasScannedBusiness, hasAIAnalysis };
}

const PROFILE_WELCOME_KEY = 'profile_welcome_ack';

function readSettingsJson(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return {};
}

/** Profile modal: first dashboard visit (welcome) and/or missing phone on user_data. */
export async function getProfileModalPromptState(): Promise<{
  missingPhone: boolean;
  needsWelcome: boolean;
}> {
  const user = await getAuthenticatedUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data: row } = await adminClient
    .from('user_data')
    .select('phone_number, settings')
    .eq('user_id', user.id)
    .single();

  const phone = (row as { phone_number?: string | null } | null)?.phone_number;
  const hasPhone = !!phone && String(phone).trim().length > 0;
  const settings = readSettingsJson((row as { settings?: unknown } | null)?.settings);
  const welcomeAck = settings[PROFILE_WELCOME_KEY] === true;

  return { missingPhone: !hasPhone, needsWelcome: !welcomeAck };
}

/** Mark first-visit profile welcome as seen (still prompts later if phone is missing). */
export async function acknowledgeProfileWelcomeModal(): Promise<void> {
  const user = await getAuthenticatedUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data: row } = await adminClient
    .from('user_data')
    .select('settings')
    .eq('user_id', user.id)
    .single();

  const nextSettings = {
    ...readSettingsJson(row?.settings),
    [PROFILE_WELCOME_KEY]: true,
  };

  const { error } = await adminClient
    .from('user_data')
    .update({ settings: nextSettings, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
}
