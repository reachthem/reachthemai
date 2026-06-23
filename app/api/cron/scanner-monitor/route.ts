import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getScanReportMaxDepth } from '@/app/actions/admin-settings';
import { computeScanDepthForPlace } from '@/lib/scanner-depth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DATAFORSEO_BASE = 'https://api.dataforseo.com/v3';

function getDataForSEOAuth(): string | null {
  const login = process.env.DATA_FOR_SEO_LOGIN;
  const password = process.env.DATA_FOR_SEO_PASSWORD;
  if (!login || !password) return null;
  return Buffer.from(`${login}:${password}`).toString('base64');
}

export async function GET(request: NextRequest) {
  const cronSecret = request.headers.get('authorization');
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const auth = getDataForSEOAuth();
    if (!auth) {
      return NextResponse.json({ error: 'DataForSEO API not configured' }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: profiles, error: profilesError } = await adminClient
      .from('business_profiles')
      .select('id, name, google_place_id, user_id, total_reviews')
      .not('user_id', 'is', null);

    if (profilesError || !profiles || profiles.length === 0) {
      return NextResponse.json({ message: 'No profiles to monitor', scansInitiated: 0 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    const scanDepthCap = await getScanReportMaxDepth();
    let scansInitiated = 0;

    for (const profile of profiles) {
      const { data: existingScan } = await adminClient
        .from('business_scans')
        .select('id, updated_at')
        .eq('business_profile_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingScan) {
        const lastScanDate = new Date(existingScan.updated_at);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (lastScanDate > oneDayAgo) continue;
      }

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
            business_profile_id: profile.id,
            user_id: profile.user_id,
            status: 'pending',
            scan_type: 'rescan',
          })
          .select('id')
          .single();

        if (scanError || !newScan) continue;
        scanId = newScan.id;
      }

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

      if (dfsResponse.ok) {
        const dfsData = await dfsResponse.json();
        const taskId = dfsData?.tasks?.[0]?.id;

        if (taskId) {
          await adminClient
            .from('business_scans')
            .update({
              dataforseo_task_id: taskId,
              status: 'scraping',
              updated_at: new Date().toISOString(),
            })
            .eq('id', scanId);

          scansInitiated++;
        }
      } else {
        await adminClient
          .from('business_scans')
          .update({ status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', scanId);
      }
    }

    return NextResponse.json({
      message: 'Monitoring complete',
      profilesChecked: profiles.length,
      scansInitiated,
    });
  } catch (error) {
    console.error('Cron scanner-monitor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
