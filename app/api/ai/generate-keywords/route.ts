import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SYSTEM_PROMPT = `You help users generate keyword phrases for local business search. 
Return only the list of phrases, one per line. No numbering, no bullets, no extra text. 
Each line should be a single search phrase (e.g. "Restaurant Miami FL" or "Pizza Tampa").`;

export async function POST(request: Request) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error');
      console.error('OpenRouter error:', errText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim() ?? '';
    return NextResponse.json({ text });
  } catch (error) {
    console.error('generate-keywords error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
