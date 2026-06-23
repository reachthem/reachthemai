import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { getSettingValue, incrementUsageCounter, addOpenRouterTokenUsage } from '@/app/actions/admin-settings';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

type EmailSeriesEntry = {
  subject: string;
  body: string;
  created_at: string;
  model: string;
  prompt: string;
};

function replaceShortcodes(
  text: string,
  contact: {
    name?: string | null;
    contact_first_name?: string | null;
    contact_last_name?: string | null;
    email_address?: string | null;
    website?: string | null;
    phone?: string | null;
    total_reviews?: number | null;
    rating?: number | null;
    place_id?: string | null;
  }
) {
  return text
    .replace(/\{company_name\}/g, contact.name ?? '')
    .replace(/\{contact_name\}/g, [contact.contact_first_name, contact.contact_last_name].filter(Boolean).join(' '))
    .replace(/\{email_address\}/g, contact.email_address ?? '')
    .replace(/\{website\}/g, contact.website ?? '')
    .replace(/\{phone\}/g, contact.phone ?? '')
    .replace(/\{reviews\}/g, String(contact.total_reviews ?? ''))
    .replace(/\{average_rating\}/g, String(contact.rating ?? ''))
    .replace(/\{google_places_id\}/g, contact.place_id ?? '');
}

function parseEmailResponse(text: string): { subject: string; body: string } | null {
  try {
    const trimmed = text.trim();
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    if (typeof parsed.subject === 'string' && typeof parsed.body === 'string') {
      return { subject: parsed.subject, body: parsed.body };
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const contactId = typeof body.contactId === 'string' ? body.contactId : '';
    const userPrompt = typeof body.prompt === 'string' ? body.prompt : '';
    const model = typeof body.model === 'string' ? body.model : 'google/gemini-3.1-pro-preview';

    if (!contactId) {
      return NextResponse.json({ error: 'contactId required' }, { status: 400 });
    }
    if (!userPrompt.trim()) {
      return NextResponse.json({ error: 'prompt required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter not configured' }, { status: 500 });
    }

    const { data: contact } = await supabase
      .from('saved_contacts')
      .select('id, name, address, website, phone, total_reviews, rating, email_address, contact_first_name, contact_last_name, place_id, email_series')
      .eq('user_id', user.id)
      .eq('id', contactId)
      .single();

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const adminPrompt = await getSettingValue('ai_contact.write_email_prompt');
    const defaultAdminPrompt = `You are an expert email copywriter. Write a professional email for the given contact based on the user's instructions below.\n\nYou MUST respond with valid JSON in the following format:\n{"subject": "The email subject line", "body": "The full email body text"}\n\nDo not include any text outside the JSON object. Do not use markdown formatting inside the JSON values.\n\nUser instructions:`;
    const systemPrompt = adminPrompt?.trim() || defaultAdminPrompt;

    const personalizedUserPrompt = replaceShortcodes(userPrompt, contact);
    const fullPrompt = `${systemPrompt}\n\n${personalizedUserPrompt}`;

    const reqBody = {
      model,
      stream: false,
      messages: [{ role: 'user', content: fullPrompt }],
    };

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify(reqBody),
    });

    const resText = await res.text();
    let data: { choices?: Array<{ message?: { content?: string } }>; usage?: { total_tokens?: number; prompt_tokens?: number; completion_tokens?: number } } = {};
    try {
      data = res.ok ? (JSON.parse(resText || '{}') as typeof data) : {};
    } catch {
      // ignore parse error
    }

    const content = data?.choices?.[0]?.message?.content ?? '';
    const usage = data?.usage;
    const tokensUsed = (usage?.total_tokens ?? (Number(usage?.prompt_tokens ?? 0) + Number(usage?.completion_tokens ?? 0))) || 0;
    const creditsToAdd = tokensUsed / 1000;

    await incrementUsageCounter('usage.openrouter_calls');
    if (creditsToAdd > 0) {
      await addOpenRouterTokenUsage(creditsToAdd);
    }

    if (!res.ok) {
      return NextResponse.json({ error: `OpenRouter error: ${res.status}` }, { status: 502 });
    }

    const parsed = parseEmailResponse(content);
    if (!parsed) {
      return NextResponse.json({
        error: 'AI did not return valid JSON with subject and body',
        rawContent: content,
      }, { status: 422 });
    }

    const newEntry: EmailSeriesEntry = {
      subject: parsed.subject,
      body: parsed.body,
      created_at: new Date().toISOString(),
      model,
      prompt: userPrompt,
    };

    const existingSeries = (Array.isArray(contact.email_series) ? contact.email_series : []) as EmailSeriesEntry[];
    const updatedSeries = [...existingSeries, newEntry];

    await supabase
      .from('saved_contacts')
      .update({
        email_series: updatedSeries as unknown as EmailSeriesEntry[],
        updated_at: new Date().toISOString(),
      })
      .eq('id', contact.id)
      .eq('user_id', user.id);

    return NextResponse.json({
      success: true,
      email: newEntry,
      totalEmails: updatedSeries.length,
    });
  } catch (err) {
    console.error('write-emails error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
