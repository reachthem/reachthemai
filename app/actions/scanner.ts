'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRSassClient } from '@/lib/supabase/server';
import { getScanReportMaxDepth } from '@/app/actions/admin-settings';

async function getAuthenticatedUserId(): Promise<string> {
  const sassClient = await createSSRSassClient();
  const supabase = sassClient.getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user.id;
}

export async function upsertBusinessProfile(data: {
  googlePlaceId: string;
  googleCid?: string;
  name: string;
  address?: string;
  rating?: number;
  totalReviews?: number;
  primaryType?: string;
  phone?: string;
  website?: string;
}) {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data: existing } = await adminClient
    .from('business_profiles')
    .select('id')
    .eq('google_place_id', data.googlePlaceId)
    .single();

  if (existing) {
    await adminClient
      .from('business_profiles')
      .update({
        user_id: userId,
        name: data.name,
        address: data.address ?? null,
        rating: data.rating ?? null,
        total_reviews: data.totalReviews ?? null,
        primary_type: data.primaryType ?? null,
        phone: data.phone ?? null,
        website: data.website ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    return { profileId: existing.id };
  }

  const { data: row, error } = await adminClient
    .from('business_profiles')
    .insert({
      user_id: userId,
      google_place_id: data.googlePlaceId,
      google_cid: data.googleCid ?? null,
      name: data.name,
      address: data.address ?? null,
      rating: data.rating ?? null,
      total_reviews: data.totalReviews ?? null,
      primary_type: data.primaryType ?? null,
      phone: data.phone ?? null,
      website: data.website ?? null,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { profileId: row.id };
}

/** Matches `PlaceResult` in ScannerPageClient for rescan deep links. */
export type ScannerPlaceResult = {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  totalReviews: number | null;
  primaryType: string | null;
  phone: string | null;
  website: string | null;
  mapsUrl: string | null;
};

export async function getPlaceResultForRescan(googlePlaceId: string): Promise<ScannerPlaceResult | null> {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data, error } = await adminClient
    .from('business_profiles')
    .select('google_place_id, name, address, rating, total_reviews, primary_type, phone, website, user_id')
    .eq('google_place_id', googlePlaceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    placeId: data.google_place_id,
    name: data.name,
    address: data.address ?? '',
    rating: data.rating ?? null,
    totalReviews: data.total_reviews ?? null,
    primaryType: data.primary_type ?? null,
    phone: data.phone ?? null,
    website: data.website ?? null,
    mapsUrl: null,
  };
}

function aggregateStarMetrics(rows: { rating: number | null }[]): {
  starCounts: { 1: number; 2: number; 3: number; 4: number; 5: number };
  aggregateRating: number | null;
} {
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  let count = 0;
  for (const r of rows) {
    const v = r.rating != null ? Number(r.rating) : null;
    if (v != null && v >= 1 && v <= 5) {
      starCounts[v as 1 | 2 | 3 | 4 | 5]++;
      sum += v;
      count++;
    }
  }
  const aggregateRating = count > 0 ? Math.round((sum / count) * 10) / 10 : null;
  return { starCounts, aggregateRating };
}

function rowsFromReviewsJson(reviewsJson: unknown): { rating: number | null }[] {
  if (!reviewsJson || !Array.isArray(reviewsJson)) return [];
  return reviewsJson
    .filter((r: unknown) => {
      const t = (r as { type?: string })?.type;
      return t === 'google_review' || t === 'google_reviews_search';
    })
    .map((r: unknown) => {
      const v = (r as { rating?: { value?: number } }).rating?.value;
      return { rating: v != null && v >= 1 && v <= 5 ? v : null };
    })
    .filter((r) => r.rating != null);
}

/** Per-scan summary for scanner list (aligned with detail report KPIs). */
export type ScannerListScanMetrics = {
  analyzedReviewsAvg: number | null;
  overallRating: number | null;
  reviewsAnalyzed: number;
  /** Sum of 1★ + 2★ + 3★ in the scan dataset */
  reviewsThreats: number;
  totalReviews: number | null;
  cleanReviews: number;
  star1: number;
  star2: number;
  star3: number;
  star4And5: number;
};

export async function getUserScans() {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data, error } = await adminClient
    .from('business_scans')
    .select(`
      *,
      business_profiles (
        id, name, address, rating, total_reviews, google_place_id, primary_type, phone, website
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  const scans = data ?? [];
  const scanIds = scans.map((s: { id: string }) => s.id);
  const metricsByScanId = new Map<string, ScannerListScanMetrics>();

  if (scanIds.length > 0) {
    const scanMaxDepth = await getScanReportMaxDepth();

    const { data: ratingRows } = await adminClient
      .from('scanned_reviews')
      .select('scan_id, rating')
      .in('scan_id', scanIds);

    const grouped = new Map<string, { rating: number | null }[]>();
    for (const row of ratingRows ?? []) {
      const sid = row.scan_id as string;
      if (!grouped.has(sid)) grouped.set(sid, []);
      grouped.get(sid)!.push({ rating: row.rating });
    }

    const fallbackIds: string[] = [];
    for (const scan of scans) {
      const sid = scan.id as string;
      const rows = grouped.get(sid) ?? [];
      if (rows.length === 0 && (scan.reviews_found ?? 0) > 0) {
        fallbackIds.push(sid);
      }
    }

    if (fallbackIds.length > 0) {
      const { data: jsonRows } = await adminClient
        .from('business_scans')
        .select('id, reviews_json')
        .in('id', fallbackIds)
        .eq('user_id', userId);

      for (const row of jsonRows ?? []) {
        const parsed = rowsFromReviewsJson(row.reviews_json);
        grouped.set(row.id as string, parsed);
      }
    }

    for (const scan of scans) {
      const sid = scan.id as string;
      const profile = scan.business_profiles as {
        rating?: number | null;
        total_reviews?: number | null;
      } | null;
      const rows = grouped.get(sid) ?? [];
      const { starCounts, aggregateRating: analyzedReviewsAvg } = aggregateStarMetrics(rows);
      const reviewsScanned = scan.reviews_found ?? 0;
      const reviewsThreats = starCounts[1] + starCounts[2] + starCounts[3];
      const gmbTotal = profile?.total_reviews ?? null;
      const reviewsAnalyzed =
        gmbTotal != null
          ? Math.min(gmbTotal, scanMaxDepth)
          : Math.min(reviewsScanned, scanMaxDepth);
      const cleanReviews =
        gmbTotal != null
          ? Math.max(0, gmbTotal - reviewsThreats)
          : Math.max(0, reviewsScanned - reviewsThreats);

      metricsByScanId.set(sid, {
        analyzedReviewsAvg,
        overallRating: profile?.rating ?? null,
        reviewsAnalyzed,
        reviewsThreats,
        totalReviews: gmbTotal,
        cleanReviews,
        star1: starCounts[1],
        star2: starCounts[2],
        star3: starCounts[3],
        star4And5: cleanReviews,
      });
    }
  }

  const enriched = scans.map((s: { id: string }) => ({
    ...s,
    list_metrics: metricsByScanId.get(s.id) ?? null,
  }));

  return { scans: enriched };
}

export async function deleteScan(scanId: string) {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { error } = await adminClient
    .from('business_scans')
    .delete()
    .eq('id', scanId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getScanResults(scanId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  // First fetch the scan by ID only to check if it's public (no user_id)
  const { data: scanCheck, error: scanCheckError } = await adminClient
    .from('business_scans')
    .select('id, user_id')
    .eq('id', scanId)
    .single();

  if (scanCheckError || !scanCheck) throw new Error('Scan not found');

  // If the scan has a user_id, require authentication and ownership (or admin)
  if (scanCheck.user_id) {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    if (scanCheck.user_id !== user.id) {
      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (!isAdmin) throw new Error('Unauthorized');
    }
  }

  const { data: scan, error: scanError } = await adminClient
    .from('business_scans')
    .select(`
      *,
      business_profiles (
        id, name, address, rating, total_reviews, google_place_id, primary_type, phone, website
      )
    `)
    .eq('id', scanId)
    .single();

  if (scanError || !scan) throw new Error('Scan not found');

  const { data: reviewsFromTable, error: reviewsError } = await adminClient
    .from('scanned_reviews')
    .select(`
      *,
      review_threat_analysis (*)
    `)
    .eq('scan_id', scanId)
    .order('created_at', { ascending: true });

  if (reviewsError) throw new Error(reviewsError.message);

  let reviews = reviewsFromTable ?? [];

  // Fallback: if no rows in scanned_reviews but we have reviews_json on the scan (saved by scrape-status/pingback), use it so the UI can show reviews
  if (reviews.length === 0 && scan.reviews_json && Array.isArray(scan.reviews_json) && (scan.reviews_json as unknown[]).length > 0) {
    const json = scan.reviews_json as unknown[];
    reviews = json
      .filter((r: unknown) => {
        const t = (r as { type?: string })?.type;
        return t === 'google_review' || t === 'google_reviews_search';
      })
      .map((r: unknown, i: number) => {
        const row = r as {
          review_id?: string;
          profile_name?: string;
          timestamp?: string;
          review_text?: string;
          profile_url?: string;
          review_url?: string;
          rating?: { value?: number };
          time_ago?: string;
          owner_answer?: string;
          is_local_guide?: boolean;
        };
        const id = row.review_id ?? `reviews_json_${scanId}_${i}`;
        return {
          id,
          review_text: row.review_text ?? null,
          reviewer_name: row.profile_name ?? null,
          reviewer_profile_url: row.profile_url ?? null,
          review_url: row.review_url ?? null,
          reviewer_is_local_guide: row.is_local_guide ?? false,
          rating: row.rating?.value ?? null,
          review_timestamp: null,
          time_ago: row.time_ago ?? null,
          owner_answer: row.owner_answer ?? null,
          review_threat_analysis: null,
        };
      });
  }

  // Compute star distribution and aggregate rating from reviews (for UI; persist via Supabase MCP if needed)
  const reviewsWithRating = reviews as { rating?: number | null }[];
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let ratingSum = 0;
  let ratingCount = 0;
  for (const r of reviewsWithRating) {
    const v = r.rating != null ? Number(r.rating) : null;
    if (v != null && v >= 1 && v <= 5) {
      starCounts[v as 1 | 2 | 3 | 4 | 5]++;
      ratingSum += v;
      ratingCount++;
    }
  }
  const aggregateRating = ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : null;

  const scanMaxDepth = await getScanReportMaxDepth();

  return { scan, reviews, starCounts, aggregateRating, scanMaxDepth };
}

export async function getScanSummary(scanId: string) {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data: scan, error: scanError } = await adminClient
    .from('business_scans')
    .select('id, status, reviews_found, threats_found')
    .eq('id', scanId)
    .eq('user_id', userId)
    .single();

  if (scanError || !scan) throw new Error('Scan not found');

  const { data: threats } = await adminClient
    .from('review_threat_analysis')
    .select('violation_type, confidence_score')
    .eq('is_threat', true)
    .in(
      'scanned_review_id',
      adminClient
        .from('scanned_reviews')
        .select('id')
        .eq('scan_id', scanId)
    );

  const violationBreakdown: Record<string, number> = {};
  for (const t of threats ?? []) {
    violationBreakdown[t.violation_type] = (violationBreakdown[t.violation_type] || 0) + 1;
  }

  return {
    scan,
    violationBreakdown,
    totalThreats: threats?.length ?? 0,
  };
}

/** Lightweight stats for dashboard: aggregate rating and star counts for a scan (no full reviews list). */
export async function getScanStats(scanId: string) {
  const userId = await getAuthenticatedUserId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminClient = (await createServerAdminClient()) as any;

  const { data: scan, error: scanError } = await adminClient
    .from('business_scans')
    .select('id, business_profile_id, reviews_json')
    .eq('id', scanId)
    .eq('user_id', userId)
    .single();

  if (scanError || !scan) return null;

  const { data: scannedRows } = await adminClient
    .from('scanned_reviews')
    .select('rating')
    .eq('scan_id', scanId);

  let rows: { rating: number | null }[] =
    (scannedRows ?? []).map((r: { rating: number | null }) => ({ rating: r.rating }));

  if (rows.length === 0 && scan.reviews_json && Array.isArray(scan.reviews_json) && (scan.reviews_json as unknown[]).length > 0) {
    rows = rowsFromReviewsJson(scan.reviews_json);
  }

  const { starCounts, aggregateRating } = aggregateStarMetrics(rows);

  const { data: profile } = await adminClient
    .from('business_profiles')
    .select('name, address, phone, website')
    .eq('id', scan.business_profile_id)
    .single();

  return {
    scanId,
    businessName: profile?.name ?? 'Unknown',
    address: profile?.address ?? null,
    phone: profile?.phone ?? null,
    website: profile?.website ?? null,
    aggregateRating,
    starCounts,
    totalReviews: rows.length,
  };
}
