import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getScanReportMaxDepth } from '@/app/actions/admin-settings';

const DATAFORSEO_BASE = 'https://api.dataforseo.com/v3';

function getDataForSEOAuth(): string | null {
  const login = process.env.DATA_FOR_SEO_LOGIN;
  const password = process.env.DATA_FOR_SEO_PASSWORD;
  if (!login || !password) return null;
  return Buffer.from(`${login}:${password}`).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const auth = getDataForSEOAuth();
    if (!auth) {
      return NextResponse.json({ error: 'DataForSEO API not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { keyword, depth, sortBy, sessionToken, place } = body;
    let placeId = body.placeId;
    const sortByValue = ['lowest_rating', 'highest_rating', 'newest', 'relevant'].includes(sortBy) ? sortBy : 'lowest_rating';

    if (!keyword || !sessionToken) {
      return NextResponse.json({ error: 'keyword and sessionToken are required' }, { status: 400 });
    }

    if (placeId && typeof placeId === 'string' && placeId.startsWith('places/')) {
      placeId = placeId.slice(7);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    // Create or find business profile
    let profileId: string;
    const googlePlaceId = place?.googlePlaceId || placeId;

    if (!googlePlaceId) {
      return NextResponse.json({ error: 'placeId or place.googlePlaceId is required' }, { status: 400 });
    }

    const { data: existing } = await adminClient
      .from('business_profiles')
      .select('id')
      .eq('google_place_id', googlePlaceId)
      .single();

    if (existing) {
      profileId = existing.id;
    } else {
      const { data: newProfile, error: insertError } = await adminClient
        .from('business_profiles')
        .insert({
          user_id: null,
          google_place_id: googlePlaceId,
          name: place?.name || keyword,
          address: place?.address ?? null,
          rating: place?.rating ?? null,
          total_reviews: place?.totalReviews ?? null,
          primary_type: place?.primaryType ?? null,
          phone: place?.phone ?? null,
          website: place?.website ?? null,
        })
        .select('id')
        .single();

      if (insertError || !newProfile) {
        return NextResponse.json({ error: 'Failed to create business profile' }, { status: 500 });
      }
      profileId = newProfile.id;
    }

    // Enforce 1 scan per session token
    const { count } = await adminClient
      .from('business_scans')
      .select('*', { count: 'exact', head: true })
      .eq('session_token', sessionToken);

    if ((count ?? 0) >= 1) {
      return NextResponse.json(
        { error: 'You have already used your free scan. Create an account to run more scans.' },
        { status: 403 }
      );
    }

    const { data: scan, error: scanError } = await adminClient
      .from('business_scans')
      .insert({
        business_profile_id: profileId,
        user_id: null,
        status: 'pending',
        scan_type: 'lead_magnet',
        session_token: sessionToken,
      })
      .select('id')
      .single();

    if (scanError || !scan) {
      return NextResponse.json({ error: 'Failed to create scan record' }, { status: 500 });
    }

    const scanDepthCap = await getScanReportMaxDepth();
    const depthNum = typeof depth === 'number' && Number.isFinite(depth) ? depth : 100;
    const clampedDepth = Math.min(Math.max(1, depthNum), scanDepthCap);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taskPayload: any[] = [{
      language_code: 'en',
      location_code: 2840,
      depth: clampedDepth,
      tag: scan.id,
      sort_by: sortByValue,
      priority: 2, // high execution priority (extra charge per DataForSEO)
    }];

    if (placeId) {
      taskPayload[0].place_id = placeId;
    } else {
      taskPayload[0].keyword = keyword;
    }

    if (baseUrl) {
      taskPayload[0].pingback_url = `${baseUrl}/api/scanner/pingback?id=$id&tag=$tag`;
    }

    const dfsResponse = await fetch(`${DATAFORSEO_BASE}/business_data/google/reviews/task_post`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskPayload),
    });

    if (!dfsResponse.ok) {
      const errText = await dfsResponse.text().catch(() => 'Unknown error');
      console.error('DataForSEO task_post error:', errText);
      let apiError = 'Failed to submit scraping task';
      try {
        const errJson = JSON.parse(errText);
        const msg = errJson?.tasks?.[0]?.status_message ?? errJson?.status_message ?? errJson?.message;
        if (msg) apiError = msg;
      } catch {
        // use default apiError
      }

      await adminClient
        .from('business_scans')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', scan.id);

      return NextResponse.json({ error: apiError }, { status: 502 });
    }

    const dfsData = await dfsResponse.json();
    const taskId = dfsData?.tasks?.[0]?.id;
    const taskStatus = dfsData?.tasks?.[0]?.status_code;
    console.log('Public DataForSEO task_post success', { scanId: scan.id, dataforseoTaskId: taskId, task_status_code: taskStatus });

    if (!taskId) {
      await adminClient
        .from('business_scans')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', scan.id);

      return NextResponse.json({ error: 'No task ID returned from DataForSEO' }, { status: 502 });
    }

    await adminClient
      .from('business_scans')
      .update({
        dataforseo_task_id: taskId,
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', scan.id);

    return NextResponse.json({
      scanId: scan.id,
      dataforseoTaskId: taskId,
      status: 'processing',
    });
  } catch (error) {
    console.error('Public scrape API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
