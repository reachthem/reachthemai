import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getScanReportMaxDepth } from '@/app/actions/admin-settings';
import { computeScanDepthForPlace } from '@/lib/scanner-depth';

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
    const { businessProfileId } = body;

    if (!businessProfileId) {
      return NextResponse.json({ error: 'businessProfileId is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: profile, error: profileError } = await adminClient
      .from('business_profiles')
      .select('*')
      .eq('id', businessProfileId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    // Reuse existing scan record for this business profile, or create a new one as fallback
    const { data: existingScan } = await adminClient
      .from('business_scans')
      .select('id')
      .eq('business_profile_id', businessProfileId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let scanId: string;

    if (existingScan) {
      // Delete old scanned_reviews (cascade removes review_threat_analysis)
      await adminClient
        .from('scanned_reviews')
        .delete()
        .eq('scan_id', existingScan.id);

      // Reset the existing scan record for reuse
      await adminClient
        .from('business_scans')
        .update({
          status: 'pending',
          scan_type: 'rescan',
          user_id: user.id,
          reviews_json: null,
          reviews_found: null,
          threats_found: null,
          dataforseo_task_id: null,
          completed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingScan.id);

      scanId = existingScan.id;
    } else {
      const { data: newScan, error: scanError } = await adminClient
        .from('business_scans')
        .insert({
          business_profile_id: businessProfileId,
          user_id: user.id,
          status: 'pending',
          scan_type: 'rescan',
        })
        .select('id')
        .single();

      if (scanError || !newScan) {
        return NextResponse.json({ error: 'Failed to create rescan record' }, { status: 500 });
      }
      scanId = newScan.id;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    const scanDepthCap = await getScanReportMaxDepth();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taskPayload: any[] = [{
      language_code: 'en',
      location_code: 2840,
      depth: computeScanDepthForPlace(profile.total_reviews, scanDepthCap),
      tag: scanId,
      priority: 2, // high execution priority (extra charge per DataForSEO)
    }];

    if (profile.google_place_id) {
      taskPayload[0].place_id = profile.google_place_id;
    } else {
      taskPayload[0].keyword = profile.name;
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
      await adminClient
        .from('business_scans')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', scanId);

      return NextResponse.json({ error: 'Failed to submit rescan task' }, { status: 502 });
    }

    const dfsData = await dfsResponse.json();
    const taskId = dfsData?.tasks?.[0]?.id;

    if (!taskId) {
      await adminClient
        .from('business_scans')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', scanId);

      return NextResponse.json({ error: 'No task ID returned' }, { status: 502 });
    }

    await adminClient
      .from('business_scans')
      .update({
        dataforseo_task_id: taskId,
        status: 'scraping',
        updated_at: new Date().toISOString(),
      })
      .eq('id', scanId);

    return NextResponse.json({
      scanId,
      dataforseoTaskId: taskId,
      status: 'scraping',
    });
  } catch (error) {
    console.error('Rescan API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
