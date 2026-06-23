import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

const DATAFORSEO_BASE = 'https://api.dataforseo.com/v3';

function getDataForSEOAuth(): string | null {
  const login = process.env.DATA_FOR_SEO_LOGIN;
  const password = process.env.DATA_FOR_SEO_PASSWORD;
  if (!login || !password) return null;
  return Buffer.from(`${login}:${password}`).toString('base64');
}

/**
 * DataForSEO calls this URL when a reviews task completes (pingback_url).
 * We fetch the task result, save reviews, and update the scan. Client polling
 * will then see status 'scraped' on next request.
 * See: https://docs.dataforseo.com/v3/business_data/google/reviews/task_post/
 */
export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get('id');
  const tag = request.nextUrl.searchParams.get('tag'); // our scan id

  if (!taskId || !tag) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: scan, error: scanError } = await adminClient
      .from('business_scans')
      .select('id, dataforseo_task_id, status')
      .eq('id', tag)
      .single();

    if (scanError || !scan || scan.dataforseo_task_id !== taskId) {
      return new NextResponse(null, { status: 404 });
    }

    if (scan.status === 'scraped' || scan.status === 'analyzed') {
      return new NextResponse(null, { status: 200 });
    }

    const auth = getDataForSEOAuth();
    if (!auth) {
      return new NextResponse(null, { status: 500 });
    }

    const dfsResponse = await fetch(`${DATAFORSEO_BASE}/business_data/google/reviews/task_get/${taskId}`, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}` },
    });

    if (!dfsResponse.ok) {
      return new NextResponse(null, { status: 200 });
    }

    const dfsData = await dfsResponse.json();
    const taskResult = dfsData?.tasks?.[0];

    if (!taskResult || taskResult.status_code !== 20000) {
      return new NextResponse(null, { status: 200 });
    }

    // DataForSEO: result is array of containers each with .items, or single container with .items
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

    // Delete old scanned_reviews for this scan (cascade removes review_threat_analysis)
    // so rescans start with a clean slate
    await adminClient
      .from('scanned_reviews')
      .delete()
      .eq('scan_id', scan.id);

    // Save reviews_json and update scan FIRST so we never lose data if scanned_reviews upsert fails
    await adminClient
      .from('business_scans')
      .update({
        status: 'scraped',
        reviews_found: allReviews.length,
        reviews_json: allReviews,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', scan.id);

    // Then upsert into scanned_reviews (per-row try/catch so one failure doesn't block)
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
        console.error('Scanner pingback: scanned_reviews upsert failed for review', reviewId, err);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Scanner pingback error:', error);
    return new NextResponse(null, { status: 200 });
  }
}
