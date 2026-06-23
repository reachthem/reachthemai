import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
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
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = getDataForSEOAuth();
    if (!auth) {
      return NextResponse.json({ error: 'DataForSEO API not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { businessProfileId, keyword, depth, sortBy } = body;
    let placeId = body.placeId;
    const sortByValue = ['lowest_rating', 'highest_rating', 'newest', 'relevant'].includes(sortBy) ? sortBy : 'lowest_rating';

    if (!businessProfileId || !keyword) {
      return NextResponse.json({ error: 'businessProfileId and keyword are required' }, { status: 400 });
    }

    // DataForSEO expects place_id without "places/" prefix (Google Places API returns "places/ChIJ...")
    if (placeId && typeof placeId === 'string' && placeId.startsWith('places/')) {
      placeId = placeId.slice(7);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: profile, error: profileError } = await adminClient
      .from('business_profiles')
      .select('id, name')
      .eq('id', businessProfileId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    // Allow 1 free business scan for non-subscribers; require subscription for more
    const { data: userData } = await adminClient
      .from('user_data')
      .select('subscription_tier, user_role')
      .eq('user_id', user.id)
      .single();

    const isSubscribed = userData?.subscription_tier === 'removal_advisor' || userData?.user_role === 'admin';
    if (!isSubscribed) {
      const { count } = await adminClient
        .from('business_scans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if ((count ?? 0) >= 1) {
        return NextResponse.json(
          { error: 'You have used your free business scan. Subscribe to the AI Removal Advisor to run unlimited scans and see all your reviews.' },
          { status: 403 }
        );
      }
    }

    const { data: scan, error: scanError } = await adminClient
      .from('business_scans')
      .insert({
        business_profile_id: businessProfileId,
        user_id: user.id,
        status: 'pending',
        scan_type: 'initial',
      })
      .select('id')
      .single();

    if (scanError || !scan) {
      return NextResponse.json({ error: 'Failed to create scan record' }, { status: 500 });
    }

    const scanDepthCap = await getScanReportMaxDepth();
    const depthNum = typeof depth === 'number' && Number.isFinite(depth) ? depth : 100;
    const clampedDepth = Math.min(Math.max(1, depthNum), scanDepthCap);

    // DataForSEO: use EITHER place_id OR keyword, not both. "keyword" is invalid when place_id is set.
    // See: https://docs.dataforseo.com/v3/business_data/google/reviews/task_post/
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taskPayload: any[] = [{
      language_code: 'en',
      location_code: 2840, // United States
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

    // DataForSEO Reviews API: create task (task_post). Results are retrieved later via task_get by id.
    // See: https://docs.dataforseo.com/v3/business_data/google/reviews/task_post/
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
    // Response contains tasks[].id (UUID) — use this in task_get to retrieve results.
    const taskId = dfsData?.tasks?.[0]?.id;
    const taskStatus = dfsData?.tasks?.[0]?.status_code;
    console.log('DataForSEO task_post success', { scanId: scan.id, dataforseoTaskId: taskId, task_status_code: taskStatus });

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
    console.error('Scrape API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
