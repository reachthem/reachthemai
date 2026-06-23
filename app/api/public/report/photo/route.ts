import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');
  const maxWidth = request.nextUrl.searchParams.get('maxWidthPx') ?? '160';

  if (!name || !name.startsWith('places/')) {
    return NextResponse.json({ error: 'Invalid photo name' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  const res = await fetch(url);

  if (!res.ok) {
    return new NextResponse(null, { status: 502 });
  }

  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': res.headers.get('Content-Type') ?? 'image/jpeg',
    },
  });
}
