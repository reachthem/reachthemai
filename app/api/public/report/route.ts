import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getSettingValue } from '@/app/actions/admin-settings';

const GOOGLE_PLACES_BASE = 'https://places.googleapis.com/v1/places';
const PLACE_DETAILS_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'photos',
  'rating',
  'userRatingCount',
  'reviews',
  'regularOpeningHours',
  'priceLevel',
  'websiteUri',
  'internationalPhoneNumber',
  'nationalPhoneNumber',
  'businessStatus',
  'types',
  'primaryTypeDisplayName',
  'editorialSummary',
  'reviewSummary',
  'generativeSummary',
  'googleMapsUri',
].join(',');

function normalizePlaceId(placeId: string | null): string | null {
  if (!placeId || typeof placeId !== 'string') return null;
  const trimmed = placeId.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('places/')) return trimmed.slice(7);
  return trimmed;
}

async function fetchPlaceFromGoogle(placeId: string): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;
  const url = `${GOOGLE_PLACES_BASE}/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': PLACE_DETAILS_FIELD_MASK,
    },
  });
  if (!res.ok) return null;
  return res.json() as Promise<Record<string, unknown>>;
}

async function callOpenRouter(
  model: string,
  systemPrompt: string,
  userContent: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OpenRouter not configured');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error');
    throw new Error(`OpenRouter error: ${err}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

function parseJsonResponse<T>(raw: string): T | null {
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

async function saveLeadIfProvided(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any,
  placeId: string,
  reportId: string | null,
  email: string | null,
  phone: string | null,
  utmSource: string | null,
  utmMedium: string | null,
  utmCampaign: string | null
) {
  if (!email) return;
  try {
    await adminClient.from('report_leads').insert({
      place_id: placeId,
      report_id: reportId,
      email,
      phone: phone || null,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
    });
  } catch {
    // Non-blocking: don't fail the report if lead save fails
  }
}

export async function GET(request: NextRequest) {
  try {
    const placeId = normalizePlaceId(request.nextUrl.searchParams.get('placeId'));
    const forceRefresh = request.nextUrl.searchParams.get('forceRefresh') === 'true';
    const leadEmail = request.nextUrl.searchParams.get('email');
    const leadPhone = request.nextUrl.searchParams.get('phone');
    const utmSource = request.nextUrl.searchParams.get('utm_source');
    const utmMedium = request.nextUrl.searchParams.get('utm_medium');
    const utmCampaign = request.nextUrl.searchParams.get('utm_campaign');

    if (!placeId) {
      return NextResponse.json({ error: 'placeId is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const cacheTtlDays = parseInt((await getSettingValue('report.cache_ttl_days')) ?? '7', 10) || 7;
    const rateLimitMinutes = parseInt((await getSettingValue('report.rate_limit_minutes')) ?? '5', 10) || 5;

    const { data: existing } = await adminClient
      .from('google_place_reports')
      .select('id, place_id, raw_place_data, derived_data, generated_at, expires_at')
      .eq('place_id', placeId)
      .maybeSingle();

    if (existing && !forceRefresh) {
      const expiresAt = existing.expires_at ? new Date(existing.expires_at).getTime() : Infinity;
      if (expiresAt > Date.now()) {
        saveLeadIfProvided(adminClient, placeId, existing.id, leadEmail, leadPhone, utmSource, utmMedium, utmCampaign);
        return NextResponse.json({
          cached: true,
          placeId: existing.place_id,
          raw_place_data: existing.raw_place_data,
          derived_data: existing.derived_data,
          generated_at: existing.generated_at,
          expires_at: existing.expires_at,
        });
      }
    }

    if (existing && forceRefresh) {
      const generatedAt = new Date(existing.generated_at).getTime();
      if (Date.now() - generatedAt < rateLimitMinutes * 60 * 1000) {
        return NextResponse.json(
          { error: 'Rate limited. Try again later.', cached: true, report: existing },
          { status: 429 }
        );
      }
    }

    const rawPlace = await fetchPlaceFromGoogle(placeId);
    if (!rawPlace) {
      if (existing) {
        return NextResponse.json({
          cached: true,
          placeId: existing.place_id,
          raw_place_data: existing.raw_place_data,
          derived_data: existing.derived_data,
          generated_at: existing.generated_at,
          expires_at: existing.expires_at,
          stale: true,
        });
      }
      return NextResponse.json({ error: 'Place not found or API error' }, { status: 502 });
    }

    const keywordModel = (await getSettingValue('report.keyword_model')) ?? 'anthropic/claude-3.5-sonnet';
    const recommendationsModel = (await getSettingValue('report.recommendations_model')) ?? 'anthropic/claude-3.5-sonnet';
    const trafficModel = (await getSettingValue('report.traffic_model')) ?? 'google/gemini-3-flash-preview';

    const displayName = (rawPlace.displayName as { text?: string })?.text ?? '';
    const reviewSummary = (rawPlace.reviewSummary as { text?: string })?.text ?? '';
    const reviews = (rawPlace.reviews as Array<{ text?: { text?: string }; rating?: number }>) ?? [];
    const reviewTexts = reviews.slice(0, 50).map((r, i) => ({
      id: i,
      text: (r.text as { text?: string })?.text ?? '',
      rating: r.rating,
    }));
    const rating = typeof rawPlace.rating === 'number' ? rawPlace.rating : null;
    const userRatingCount = typeof rawPlace.userRatingCount === 'number' ? rawPlace.userRatingCount : 0;
    const formattedAddress = typeof rawPlace.formattedAddress === 'string' ? rawPlace.formattedAddress : '';
    const primaryType = (rawPlace.primaryTypeDisplayName as { text?: string })?.text ?? '';

    const negativeReviews = reviews.filter((r) => (r.rating ?? 5) < 4);
    const negativeCount = negativeReviews.length;
    const starDistribution = [1, 2, 3, 4, 5].map(
      (star) => ({ star, count: reviews.filter((r) => r.rating === star).length })
    );

    const keywordPrompt = `Extract keywords and sentiment themes from these business reviews. Return a JSON object with:
- "keywords": array of top 15-20 recurring words/phrases (lowercase, no duplicates)
- "sentimentThemes": array of 3-5 short theme labels (e.g. "service quality", "pricing") with "label" and "sentiment" ("positive"|"negative"|"mixed")

Review summary: ${reviewSummary}
Sample reviews (max 50): ${JSON.stringify(reviewTexts)}

Return ONLY valid JSON. No markdown.`;

    const recommendationsPrompt = `You are analyzing a business's Google reviews to recommend actions that would improve their rating and revenue. This business has ${negativeCount} reviews below 4 stars out of ${userRatingCount} total reviews.

Star distribution from sample: ${JSON.stringify(starDistribution)}

For each recommendation, quantify the potential impact when possible (e.g. "could raise rating from ${rating} to X.X").

Return a JSON object with:
- "recommendations": array of 5-7 objects with:
  - "title": short action title
  - "priority": "high"|"medium"|"low"
  - "action": detailed explanation of what to do
  - "impact": one sentence quantifying the potential business impact

Business: ${displayName}
Address: ${formattedAddress}
Type: ${primaryType}
Current Rating: ${rating ?? 'N/A'} (${userRatingCount} reviews)
Review summary: ${reviewSummary}

Return ONLY valid JSON. No markdown.`;

    const trafficPrompt = `Estimate the monthly local search volume for this business and project what it would be if they achieved a 5.0 rating.

Research shows Google Maps click-through rates by star rating are approximately:
- 3.0 stars: ~10% CTR
- 3.5 stars: ~20% CTR
- 4.0 stars: ~35% CTR
- 4.5 stars: ~50% CTR
- 5.0 stars: ~68% CTR

Business: ${displayName}
Category/type: ${primaryType}
Address: ${formattedAddress}
Current rating: ${rating ?? 'N/A'}
Total reviews: ${userRatingCount}

Return a JSON object with:
- "currentMonthlySearchVolume": number (current estimated monthly searches)
- "projectedMonthlySearchVolumeAt5": number (projected if rating were 5.0)
- "percentageIncrease": number (percent increase from current to projected)
- "currentCTR": number (estimated current click-through rate percentage)
- "projectedCTRAt5": number (projected CTR at 5.0)
- "monthlySearchVolume": number (same as currentMonthlySearchVolume, for backward compatibility)
- "confidence": "low"|"medium"|"high"
- "note": one short sentence explaining the estimate

Return ONLY valid JSON. No markdown.`;

    const businessImpactPrompt = `Estimate the monthly business impact (leads and revenue) for this business at their current rating vs. a 5.0 rating.

Use these industry benchmarks:
- Local businesses typically convert 2-5% of search impressions into calls/leads
- Conversion rates are higher for businesses with higher ratings
- Average revenue per lead varies by business type

Business: ${displayName}
Category/type: ${primaryType}
Address: ${formattedAddress}
Current rating: ${rating ?? 'N/A'}
Total reviews: ${userRatingCount}

Return a JSON object with:
- "currentMonthlyLeads": number (estimated current monthly leads/calls)
- "projectedMonthlyLeadsAt5": number (projected if rating were 5.0)
- "leadIncreasePercent": number (percentage increase)
- "estimatedCurrentMonthlyRevenue": number (estimated current monthly revenue from online leads)
- "estimatedProjectedMonthlyRevenue": number (projected revenue at 5.0)
- "revenueIncreasePercent": number (percentage increase)
- "avgRevenuePerLead": number (estimated average revenue per lead for this business type)
- "confidence": "low"|"medium"|"high"
- "methodology": one sentence explaining the methodology

Return ONLY valid JSON. No markdown.`;

    let keywordRaw: string;
    let recommendationsRaw: string;
    let trafficRaw: string;
    let businessImpactRaw: string;
    try {
      [keywordRaw, recommendationsRaw, trafficRaw, businessImpactRaw] = await Promise.all([
        callOpenRouter(keywordModel, 'You are a JSON-only API. Return only valid JSON.', keywordPrompt),
        callOpenRouter(recommendationsModel, 'You are a JSON-only API. Return only valid JSON.', recommendationsPrompt),
        callOpenRouter(trafficModel, 'You are a JSON-only API. Return only valid JSON.', trafficPrompt),
        callOpenRouter(trafficModel, 'You are a JSON-only API. Return only valid JSON.', businessImpactPrompt),
      ]);
    } catch (aiError) {
      console.error('Report generation error (OpenRouter/AI):', aiError);
      const message = aiError instanceof Error ? aiError.message : 'Report generation failed';
      return NextResponse.json(
        { error: message.includes('OpenRouter') ? message : 'AI service error. Please try again or check admin report model settings.' },
        { status: 500 }
      );
    }

    const keywordsData = parseJsonResponse<{ keywords?: string[]; sentimentThemes?: { label: string; sentiment: string }[] }>(keywordRaw);
    const recommendationsData = parseJsonResponse<{ recommendations?: { title: string; priority: string; action: string; impact?: string }[] }>(recommendationsRaw);
    const trafficData = parseJsonResponse<{
      monthlySearchVolume?: number;
      currentMonthlySearchVolume?: number;
      projectedMonthlySearchVolumeAt5?: number;
      percentageIncrease?: number;
      currentCTR?: number;
      projectedCTRAt5?: number;
      confidence?: string;
      note?: string;
    }>(trafficRaw);
    const businessImpactData = parseJsonResponse<{
      currentMonthlyLeads?: number;
      projectedMonthlyLeadsAt5?: number;
      leadIncreasePercent?: number;
      estimatedCurrentMonthlyRevenue?: number;
      estimatedProjectedMonthlyRevenue?: number;
      revenueIncreasePercent?: number;
      avgRevenuePerLead?: number;
      confidence?: string;
      methodology?: string;
    }>(businessImpactRaw);

    const derivedData = {
      keywords: keywordsData ?? { keywords: [], sentimentThemes: [] },
      recommendations: recommendationsData ?? { recommendations: [] },
      traffic: trafficData ?? { monthlySearchVolume: 0, confidence: 'low', note: '' },
      businessImpact: businessImpactData ?? null,
    };

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + cacheTtlDays);

    const { data: upsertedReport } = await adminClient.from('google_place_reports').upsert(
      {
        place_id: placeId,
        raw_place_data: rawPlace,
        derived_data: derivedData,
        generated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        report_version: 1,
      },
      { onConflict: 'place_id' }
    ).select('id').maybeSingle();

    saveLeadIfProvided(adminClient, placeId, upsertedReport?.id ?? null, leadEmail, leadPhone, utmSource, utmMedium, utmCampaign);

    return NextResponse.json({
      cached: false,
      placeId,
      raw_place_data: rawPlace,
      derived_data: derivedData,
      generated_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Report generation failed' },
      { status: 500 }
    );
  }
}
