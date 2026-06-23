'use server';

import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { revalidatePath } from 'next/cache';
import { parseScanDepthCap } from '@/lib/scanner-depth';

export interface AdminSetting {
  id: string;
  option_key: string;
  option_value: string;
  option_label: string;
  option_description: string | null;
  is_public: boolean;
}

export async function getAdminSettings(): Promise<{
  settings: AdminSetting[];
  error: string | null;
}> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin)
    return { error: 'Admin access required', settings: [] };

  const { data: settings, error } = await supabase
    .from('admin_settings')
    .select('*')
    .order('option_key');

  if (error) return { error: error.message, settings: [] };
  return { settings: (settings ?? []) as AdminSetting[], error: null };
}

export async function getPublicSettings(): Promise<Record<string, string>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('option_key, option_value')
    .eq('is_public', true);

  if (!settings || !Array.isArray(settings)) return {};
  return Object.fromEntries(
    (settings as { option_key: string; option_value: string }[]).map((s) => [
      s.option_key,
      s.option_value ?? '',
    ])
  );
}

export async function updateAdminSetting(
  key: string,
  value: string
): Promise<{ error: string | null }> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return { error: 'Admin access required' };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('admin_settings')
    .update({
      option_value: value,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('option_key', key);

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { error: null };
}

export async function updateAdminSettingsBulk(
  updates: Record<string, string>
): Promise<{ error: string | null }> {
  for (const [key, value] of Object.entries(updates)) {
    const result = await updateAdminSetting(key, value);
    if (result.error) return result;
  }
  return { error: null };
}

export async function getSettingValue(key: string): Promise<string | null> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data } = await supabase
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', key)
    .single();

  return (data as { option_value?: string } | null)?.option_value ?? null;
}

/** Increment usage counter (OpenRouter or Google Places). Uses service role. Call from API routes/cron. */
export async function incrementUsageCounter(
  key: 'usage.openrouter_calls' | 'usage.google_places_calls'
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = (await createServerAdminClient()) as any;
  const { data: row } = await admin
    .from('admin_settings')
    .select('id, option_value')
    .eq('option_key', key)
    .limit(1)
    .single();
  const next = String((parseInt(row?.option_value ?? '0', 10) || 0) + 1);
  if (row?.id) {
    await admin.from('admin_settings').update({ option_value: next, updated_at: new Date().toISOString() }).eq('id', row.id);
  } else {
    await admin.from('admin_settings').insert({
      option_key: key,
      option_value: next,
      option_label: key === 'usage.openrouter_calls' ? 'OpenRouter API Calls' : 'Google Places API Calls',
      option_description: null,
      is_public: false,
    });
  }
}

/** Add to OpenRouter token-based credits (tokens/1000). Uses service role. Call from API routes after OpenRouter calls. */
export async function addOpenRouterTokenUsage(amount: number): Promise<void> {
  if (amount <= 0) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = (await createServerAdminClient()) as any;
  const key = 'usage.openrouter_tokens';
  const { data: row } = await admin
    .from('admin_settings')
    .select('id, option_value')
    .eq('option_key', key)
    .limit(1)
    .single();
  const current = parseFloat(row?.option_value ?? '0') || 0;
  const next = String(current + amount);
  if (row?.id) {
    await admin.from('admin_settings').update({ option_value: next, updated_at: new Date().toISOString() }).eq('id', row.id);
  } else {
    await admin.from('admin_settings').insert({
      option_key: key,
      option_value: next,
      option_label: 'OpenRouter Token Credits (×1000)',
      option_description: null,
      is_public: false,
    });
  }
}

/** Public display price for AI Advisor (e.g. "19"). Used on /ai-advisor CTA and marketing. */
export async function getAdvisorDisplayPrice(): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;
  const { data: row } = await supabase
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'stripe_removal_advisor_price')
    .single();
  const value = (row as { option_value?: string } | null)?.option_value;
  return value && String(value).trim() ? String(value).trim() : '19';
}

/** Public display price for professional review removal (e.g. "299"). Used on pricing page and marketing. */
export async function getRemovalDisplayPrice(): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;
  const { data: row } = await supabase
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'stripe_review_removal_price')
    .single();
  const value = (row as { option_value?: string } | null)?.option_value;
  return value && String(value).trim() ? String(value).trim() : '299';
}

/** Fetch both display prices in one round-trip for pages that need both. */
export async function getDisplayPrices(): Promise<{ advisorPrice: string; removalPrice: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;
  const { data: rows } = await supabase
    .from('admin_settings')
    .select('option_key, option_value')
    .in('option_key', ['stripe_removal_advisor_price', 'stripe_review_removal_price']);
  const map = Object.fromEntries(
    (rows ?? []).map((r: { option_key: string; option_value: string | null }) => [
      r.option_key,
      r.option_value && String(r.option_value).trim() ? String(r.option_value).trim() : '',
    ])
  );
  return {
    advisorPrice: map.stripe_removal_advisor_price || '19',
    removalPrice: map.stripe_review_removal_price || '299',
  };
}

/** Contact page display: email (Contact Form Recipient) and phone (Support Phone). Uses service role so unauthenticated contact page can show them. */
export async function getContactDisplaySettings(): Promise<{
  contactEmail: string;
  supportPhone: string;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;
  const { data: rows } = await supabase
    .from('admin_settings')
    .select('option_key, option_value')
    .in('option_key', ['app.contact_email', 'app.support_phone']);

  const map = Object.fromEntries(
    (rows ?? []).map((r: { option_key: string; option_value: string | null }) => [
      r.option_key,
      r.option_value ?? '',
    ])
  );
  return {
    contactEmail: map['app.contact_email'] ?? '',
    supportPhone: map['app.support_phone'] ?? '',
  };
}

/** Max Google review fetch depth per scan (admin `report.scan_max_depth`, default 500). */
export async function getScanReportMaxDepth(): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;
  const { data: row } = await supabase
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'report.scan_max_depth')
    .maybeSingle();
  return parseScanDepthCap((row as { option_value?: string } | null)?.option_value);
}
