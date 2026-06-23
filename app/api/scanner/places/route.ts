import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';

const GOOGLE_PLACES_BASE = 'https://places.googleapis.com/v1/places';

interface PlaceResult {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  primaryTypeDisplayName?: { text: string };
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
}

export async function GET(request: NextRequest) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = request.nextUrl.searchParams.get('q');
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
    }

    const pageToken = request.nextUrl.searchParams.get('pageToken') ?? undefined;
    const zip = request.nextUrl.searchParams.get('zip')?.trim();

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Google Places API not configured' }, { status: 500 });
    }

    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.rating',
      'places.userRatingCount',
      'places.primaryTypeDisplayName',
      'places.nationalPhoneNumber',
      'places.websiteUri',
      'places.googleMapsUri',
      'nextPageToken',
    ].join(',');

    const body: Record<string, unknown> = {
      textQuery: query,
      pageSize: 20,
    };
    if (pageToken) body.pageToken = pageToken;

    if (zip) {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(zip)}&key=${apiKey}`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const loc = geoData?.results?.[0]?.geometry?.location;
        if (loc?.lat != null && loc?.lng != null) {
          body.locationBias = {
            circle: {
              center: { latitude: loc.lat, longitude: loc.lng },
              radius: 50000, // meters, max 50000 per API
            },
          };
        }
      }
    }

    const response = await fetch(`${GOOGLE_PLACES_BASE}:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      console.error('Google Places API error:', errText);
      return NextResponse.json({ error: 'Google Places search failed' }, { status: 502 });
    }

    const data = await response.json();
    const places = (data.places ?? []).map((p: PlaceResult) => ({
      placeId: p.id,
      name: p.displayName?.text ?? '',
      address: p.formattedAddress ?? '',
      rating: p.rating ?? null,
      totalReviews: p.userRatingCount ?? null,
      primaryType: p.primaryTypeDisplayName?.text ?? null,
      phone: p.nationalPhoneNumber ?? null,
      website: p.websiteUri ?? null,
      mapsUrl: p.googleMapsUri ?? null,
    }));

    return NextResponse.json({
      places,
      nextPageToken: data.nextPageToken ?? null,
    });
  } catch (error) {
    console.error('Places search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
