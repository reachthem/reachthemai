'use server';

import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export interface AdminDashboardStats {
  totalUsers: number;
  newUsersLast30Days: number;
  roleBreakdown: { role: string; count: number }[];
  subscriptionBreakdown: { tier: string; count: number }[];
  advisorSubscribers: number;
  advisorMRR: number;
  advisorPrice: number;
  totalRevenue: number;
  revenueLast30Days: number;
  premiumRemovalPurchases: number;
  premiumRemovalRevenue: number;
  removalRequests: { status: string; count: number }[];
  totalScans: number;
  totalThreatsFound: number;
  totalReviewsScanned: number;
  totalContacts: number;
  apiUsage: { openrouterCalls: number; googlePlacesCalls: number; openrouterTokens: number };
}

export type UserDataRow = {
  id: string;
  user_id: string;
  email: string | null;
  phone_number: string | null;
  full_name: string | null;
  avatar_url: string | null;
  user_role: string;
  subscription_tier: string;
  credits: number;
  settings: unknown;
  created_at: string;
  updated_at: string;
};

export async function getAdminUserDataList(): Promise<{
  data: UserDataRow[] | null;
  error: string | null;
}> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return { data: null, error: 'Admin access required' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data, error } = await adminClient
    .from('user_data')
    .select('id, user_id, email, phone_number, full_name, avatar_url, user_role, subscription_tier, credits, settings, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}

export async function getAdminDashboardStats(): Promise<{
  stats: AdminDashboardStats | null;
  error: string | null;
}> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return { stats: null, error: 'Admin access required' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    usersRes,
    newUsersRes,
    rolesRes,
    subsRes,
    billingAllRes,
    billing30dRes,
    removalPurchasesRes,
    removalRequestsRes,
    scansRes,
    contactsRes,
    settingsRes,
  ] = await Promise.all([
    adminClient.from('user_data').select('id', { count: 'exact', head: true }),
    adminClient.from('user_data').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    adminClient.from('user_data').select('user_role'),
    adminClient.from('user_data').select('subscription_tier'),
    adminClient.from('billing_history').select('amount, plan_key, status').eq('status', 'paid'),
    adminClient.from('billing_history').select('amount, status').eq('status', 'paid').gte('created_at', thirtyDaysAgo),
    adminClient.from('billing_history').select('amount, status').eq('status', 'paid').eq('plan_key', 'review_removal'),
    adminClient.from('removal_requests').select('status').neq('status', 'draft'),
    adminClient.from('business_scans').select('reviews_found, threats_found'),
    adminClient.from('contacts').select('id', { count: 'exact', head: true }),
    adminClient
      .from('admin_settings')
      .select('option_key, option_value')
      .in('option_key', [
        'stripe_removal_advisor_price',
        'usage.openrouter_calls',
        'usage.google_places_calls',
        'usage.openrouter_tokens',
      ]),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const row of settingsRes.data ?? []) {
    settingsMap[row.option_key] = row.option_value ?? '0';
  }

  const roleMap = new Map<string, number>();
  for (const row of rolesRes.data ?? []) {
    const role = row.user_role || 'unknown';
    roleMap.set(role, (roleMap.get(role) ?? 0) + 1);
  }

  const subMap = new Map<string, number>();
  for (const row of subsRes.data ?? []) {
    const tier = row.subscription_tier || 'free';
    subMap.set(tier, (subMap.get(tier) ?? 0) + 1);
  }

  const advisorSubscribers = subMap.get('removal_advisor') ?? 0;
  const advisorPrice = parseFloat(settingsMap['stripe_removal_advisor_price'] || '49') || 49;
  const advisorMRR = advisorSubscribers * advisorPrice;

  const totalRevenue = (billingAllRes.data ?? []).reduce(
    (sum: number, r: { amount: number }) => sum + (r.amount / 100),
    0
  );
  const revenueLast30Days = (billing30dRes.data ?? []).reduce(
    (sum: number, r: { amount: number }) => sum + (r.amount / 100),
    0
  );

  const premiumRemovalPurchases = (removalPurchasesRes.data ?? []).length;
  const premiumRemovalRevenue = (removalPurchasesRes.data ?? []).reduce(
    (sum: number, r: { amount: number }) => sum + (r.amount / 100),
    0
  );

  const requestStatusMap = new Map<string, number>();
  for (const row of removalRequestsRes.data ?? []) {
    const status = row.status || 'unknown';
    requestStatusMap.set(status, (requestStatusMap.get(status) ?? 0) + 1);
  }

  let totalReviewsScanned = 0;
  let totalThreatsFound = 0;
  for (const row of scansRes.data ?? []) {
    totalReviewsScanned += row.reviews_found ?? 0;
    totalThreatsFound += row.threats_found ?? 0;
  }

  return {
    error: null,
    stats: {
      totalUsers: usersRes.count ?? 0,
      newUsersLast30Days: newUsersRes.count ?? 0,
      roleBreakdown: Array.from(roleMap.entries())
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count),
      subscriptionBreakdown: Array.from(subMap.entries())
        .map(([tier, count]) => ({ tier, count }))
        .sort((a, b) => b.count - a.count),
      advisorSubscribers,
      advisorMRR,
      advisorPrice,
      totalRevenue,
      revenueLast30Days,
      premiumRemovalPurchases,
      premiumRemovalRevenue,
      removalRequests: Array.from(requestStatusMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count),
      totalScans: (scansRes.data ?? []).length,
      totalThreatsFound,
      totalReviewsScanned,
      totalContacts: contactsRes.count ?? 0,
      apiUsage: {
        openrouterCalls: parseInt(settingsMap['usage.openrouter_calls'] || '0', 10) || 0,
        googlePlacesCalls: parseInt(settingsMap['usage.google_places_calls'] || '0', 10) || 0,
        openrouterTokens: parseFloat(settingsMap['usage.openrouter_tokens'] || '0') || 0,
      },
    },
  };
}
