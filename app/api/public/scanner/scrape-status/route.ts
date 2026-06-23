import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

const DATAFORSEO_BASE = 'https://api.dataforseo.com/v3';

function getDataForSEOAuth(): string | null {
  const login = process.env.DATA_FOR_SEO_LOGIN;
  const password = process.env.DATA_FOR_SEO_PASSWORD;
  if (!login || !password) return null;
  return Buffer.from(`${login}:${password}`).toString('base64');
}

export async function GET(request: NextRequest) {
  try {
    const scanId = request.nextUrl.searchParams.get('scanId');
    const sessionToken = request.nextUrl.searchParams.get('sessionToken');

    if (!scanId || !sessionToken) {
      return NextResponse.json({ error: 'scanId and sessionToken are required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: scan, error: scanError } = await adminClient
      .from('business_scans')
      .select('*')
      .eq('id', scanId)
      .eq('session_token', sessionToken)
      .single();

    if (scanError || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    if ((scan.status === 'reviews_received' || scan.status === 'analyzing' || scan.status === 'analyzed') && (scan.reviews_found ?? 0) > 0) {
      return NextResponse.json({
        scanId: scan.id,
        status: scan.status,
        reviewsFound: scan.reviews_found,
        threatsFound: scan.threats_found,
        dataforseoTaskId: scan.dataforseo_task_id ?? null,
      });
    }

    if (scan.status === 'failed') {
      return NextResponse.json({
        scanId: scan.id,
        status: 'failed',
        errorMessage: 'Scan failed. Please try again.',
        dataforseoTaskId: scan.dataforseo_task_id ?? null,
      });
    }

    if (!scan.dataforseo_task_id) {
      return NextResponse.json({
        scanId: scan.id,
        status: scan.status,
        dataforseoTaskId: null,
      });
    }

    const auth = getDataForSEOAuth();
    if (!auth) {
      return NextResponse.json({ error: 'DataForSEO API not configured' }, { status: 500 });
    }

    const taskGetUrl = `${DATAFORSEO_BASE}/business_data/google/reviews/task_get/${scan.dataforseo_task_id}`;
    const dfsResponse = await fetch(taskGetUrl, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}` },
    });

    if (!dfsResponse.ok) {
      return NextResponse.json({
        scanId: scan.id,
        status: 'processing',
        dataforseoTaskId: scan.dataforseo_task_id ?? null,
      });
    }

    const dfsData = await dfsResponse.json();
    const taskResult = dfsData?.tasks?.[0];

    if (!taskResult || taskResult.status_code !== 20000) {
      if ([40501, 40602, 40401].includes(taskResult?.status_code ?? 0)) {
        return NextResponse.json({
          scanId: scan.id,
          status: 'processing',
          dataforseoTaskId: scan.dataforseo_task_id ?? null,
        });
      }

      const failureMessage = taskResult?.status_message ?? (taskResult ? `DataForSEO error ${taskResult.status_code}` : 'Scraping task failed');
      console.error('Public scanner scrape-status: task failed', { scanId: scan.id, status_code: taskResult?.status_code, status_message: taskResult?.status_message });

      await adminClient
        .from('business_scans')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', scan.id);

      return NextResponse.json({
        scanId: scan.id,
        status: 'failed',
        errorMessage: failureMessage,
        dataforseoTaskId: scan.dataforseo_task_id ?? null,
      });
    }

    const rawResult = taskResult.result;
    const results = Array.isArray(rawResult) ? rawResult : (rawResult != null ? [rawResult] : []);
    const allReviews: unknown[] = [];
    for (const resultItem of results) {
      const items = resultItem?.items ?? [];
      for (const item of items) {
        const type = item?.type;
        if (type !== 'google_review' && type !== 'google_reviews_search') continue;
        allReviews.push(item);
      }
    }

    await adminClient
      .from('business_scans')
      .update({
        status: 'reviews_received',
        reviews_found: allReviews.length,
        reviews_json: allReviews,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', scan.id);

    for (const review of allReviews) {
      const r = review as Record<string, unknown>;
      const reviewId = (r.review_id as string) || `${r.profile_name ?? ''}_${r.timestamp ?? ''}`;
      try {
        await adminClient.from('scanned_reviews').upsert(
          {
            scan_id: scan.id,
            dataforseo_review_id: reviewId,
            review_text: (r.review_text as string) ?? null,
            original_review_text: (r.original_review_text as string) ?? null,
            reviewer_name: (r.profile_name as string) ?? null,
            reviewer_profile_url: (r.profile_url as string) ?? null,
            reviewer_image_url: (r.profile_image_url as string) ?? null,
            reviewer_reviews_count: (r.reviews_count as number) ?? null,
            reviewer_photos_count: (r.photos_count as number) ?? null,
            reviewer_is_local_guide: (r.local_guide ?? r.is_local_guide) ?? false,
            rating: (r.rating as { value?: number })?.value ?? null,
            review_url: (r.review_url as string) ?? null,
            review_timestamp: r.timestamp ? new Date(r.timestamp as string).toISOString() : null,
            time_ago: (r.time_ago as string) ?? null,
            owner_answer: (r.owner_answer as string) ?? null,
            owner_timestamp: r.owner_timestamp ? new Date(r.owner_timestamp as string).toISOString() : null,
            images: r.review_images ?? null,
            review_highlights: r.review_highlights ?? null,
          },
          { onConflict: 'dataforseo_review_id' }
        );
      } catch (err) {
        console.error('Public scanner scrape-status: scanned_reviews upsert failed for review', reviewId, err);
      }
    }

    return NextResponse.json({
      scanId: scan.id,
      status: 'reviews_received',
      reviewsFound: allReviews.length,
      dataforseoTaskId: scan.dataforseo_task_id ?? null,
    });
  } catch (error) {
    console.error('Public scrape status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
