import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { placeId, eventType, eventData, referrer, utmSource, utmMedium, utmCampaign } = body;

    if (!placeId || !eventType) {
      return NextResponse.json({ error: 'placeId and eventType are required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = (await createServerAdminClient()) as any;

    const { data: report } = await adminClient
      .from('google_place_reports')
      .select('id')
      .eq('place_id', placeId)
      .maybeSingle();

    await adminClient.from('report_events').insert({
      place_id: placeId,
      report_id: report?.id ?? null,
      event_type: eventType,
      event_data: eventData ?? {},
      referrer: referrer ?? null,
      utm_source: utmSource ?? null,
      utm_medium: utmMedium ?? null,
      utm_campaign: utmCampaign ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Report event tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
