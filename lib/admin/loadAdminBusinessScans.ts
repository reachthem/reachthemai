/**
 * Admin-only business_scans list with profile + user email resolution.
 * Used by Removal Requests and Admin Scans pages.
 */

export type AdminBusinessScanRow = {
  id: string;
  user_id: string | null;
  status: string;
  reviews_found: number;
  threats_found: number;
  scan_type: string;
  created_at: string;
  completed_at: string | null;
  business_profile_id: string;
  business_name: string;
  business_address: string | null;
  business_rating: number | null;
  business_total_reviews: number | null;
  user_email: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadAdminBusinessScans(adminClient: any): Promise<AdminBusinessScanRow[]> {
  const { data: scansRaw } = await adminClient
    .from('business_scans')
    .select(
      'id, status, reviews_found, threats_found, scan_type, created_at, completed_at, business_profile_id, user_id'
    )
    .order('created_at', { ascending: false });

  const scanRows = scansRaw ?? [];
  const profileIds = [...new Set(scanRows.map((s: { business_profile_id: string }) => s.business_profile_id))];
  const userIds: string[] = [
    ...new Set<string>(
      scanRows
        .map((s: { user_id: string | null }) => s.user_id)
        .filter((id: string | null): id is string => typeof id === 'string' && id.length > 0)
    ),
  ];

  const { data: profiles } =
    profileIds.length > 0
      ? await adminClient.from('business_profiles').select('id, name, address, rating, total_reviews').in('id', profileIds)
      : { data: [] };
  const { data: scanUsers } =
    userIds.length > 0
      ? await adminClient.from('user_data').select('user_id, email').in('user_id', userIds)
      : { data: [] };

  const profileMap = new Map(
    (profiles ?? []).map((p: { id: string; name: string; address: string | null; rating: number | null; total_reviews: number | null }) => [
      p.id,
      p,
    ])
  );
  const userMap = new Map<string, string | null>(
    (scanUsers ?? []).map((u: { user_id: string; email: string | null }) => [u.user_id, u.email ?? null])
  );

  const missingUserIds = userIds.filter((uid) => userMap.get(uid) === undefined || userMap.get(uid) === null);
  if (missingUserIds.length > 0 && adminClient.auth?.admin?.getUserById) {
    await Promise.all(
      missingUserIds.map(async (uid: string) => {
        try {
          const { data } = await adminClient.auth.admin.getUserById(uid);
          const email = data?.user?.email ?? null;
          userMap.set(uid, email);
        } catch {
          userMap.set(uid, null);
        }
      })
    );
  }

  return scanRows.map(
    (s: {
      id: string;
      user_id: string | null;
      status: string;
      reviews_found: number;
      threats_found: number;
      scan_type: string;
      created_at: string;
      completed_at: string | null;
      business_profile_id: string;
    }) => {
      const p = profileMap.get(s.business_profile_id) as
        | { name: string; address: string | null; rating: number | null; total_reviews: number | null }
        | undefined;
      return {
        id: s.id,
        user_id: s.user_id,
        status: s.status,
        reviews_found: s.reviews_found,
        threats_found: s.threats_found,
        scan_type: s.scan_type,
        created_at: s.created_at,
        completed_at: s.completed_at,
        business_profile_id: s.business_profile_id,
        business_name: p?.name ?? 'Unknown',
        business_address: p?.address ?? null,
        business_rating: p?.rating ?? null,
        business_total_reviews: p?.total_reviews ?? null,
        user_email: s.user_id ? ((userMap.get(s.user_id) as string | null) ?? null) : null,
      };
    }
  );
}
