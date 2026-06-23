import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_BASE = 'https://places.googleapis.com/v1/places';

const PLACE_DETAILS_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'photos',
  'rating',
  'userRatingCount',
  'reviews.name',
  'reviews.rating',
  'reviews.text',
  'reviews.originalText',
  'reviews.authorAttribution',
  'reviews.publishTime',
  'reviews.relativePublishTimeDescription',
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

export async function GET(request: NextRequest) {
  try {
    const placeId = normalizePlaceId(request.nextUrl.searchParams.get('placeId'));
    if (!placeId) {
      return NextResponse.json(
        { error: 'placeId is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API not configured' },
        { status: 500 }
      );
    }

    const url = `${GOOGLE_PLACES_BASE}/${encodeURIComponent(placeId)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': PLACE_DETAILS_FIELD_MASK,
      },
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      console.error('Google Places API (place details) error:', response.status, errText);
      if (response.status === 404) {
        return NextResponse.json({ error: 'Place not found' }, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch place details' },
        { status: 502 }
      );
    }

    const place = await response.json();
    return NextResponse.json(place);
  } catch (error) {
    console.error('Report place API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
