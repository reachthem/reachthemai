import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { getSettingValue, incrementUsageCounter, addOpenRouterTokenUsage } from '@/app/actions/admin-settings';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function buildPrompt(template: string, contact: { name?: string | null; address?: string | null; website?: string | null; phone?: string | null }) {
  return template
    .replace(/\[business_name\]/g, contact.name ?? '')
    .replace(/\[business_address\]/g, contact.address ?? '')
    .replace(/\[business_website\]/g, contact.website ?? '')
    .replace(/\[business_phone_number\]/g, contact.phone ?? '');
}

function parseContactResponse(text: string): { email_address?: string; contact_first_name?: string; contact_last_name?: string } | null {
  try {
    const trimmed = text.trim();
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    return {
      email_address: typeof parsed.email_address === 'string' ? parsed.email_address : undefined,
      contact_first_name: typeof parsed.contact_first_name === 'string' ? parsed.contact_first_name : undefined,
      contact_last_name: typeof parsed.contact_last_name === 'string' ? parsed.contact_last_name : undefined,
    };
  } catch {
    return null;
  }
}

/** Only treat as a valid email if it contains @; otherwise do not use for contact record. */
function isValidEmailFormat(email: string | undefined): boolean {
  return typeof email === 'string' && email.trim().includes('@');
}

/** Reject placeholder values like N/A, None, "not found", etc. for contact name. */
function isValidContactName(value: string | undefined): boolean {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (v.length === 0) return false;
  if (/\bnot\b/i.test(v)) return false;
  const placeholders = /^(n\/a|na|none|unknown|-|—|\s)+$/i;
  if (placeholders.test(v)) return false;
  const allPartsPlaceholder = v.split(/\s+/).every((part) => /^(n\/a|na|none|unknown|-|—)$/i.test(part));
  return !allPartsPlaceholder;
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
    const contactIds = Array.isArray(body.contactIds) ? body.contactIds as string[] : [];
    const model = typeof body.model === 'string' ? body.model : 'google/gemini-3.1-pro-preview';
    if (contactIds.length === 0) {
      return NextResponse.json({ error: 'contactIds required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter not configured' }, { status: 500 });
    }

    const promptTemplate = await getSettingValue('ai_contact.contact_retrieval_prompt');
    const defaultPrompt = `I want you to give me the best email address for this company. Use JSON: {"email_address":"...","contact_first_name":"...","contact_last_name":"..."}. Company: [business_name], [business_address], [business_website], [business_phone_number]`;
    const template = promptTemplate?.trim() || defaultPrompt;

    const { data: contacts } = await supabase
      .from('saved_contacts')
      .select('id, name, address, website, phone, automation_id, email_address, contact_first_name, contact_last_name')
      .eq('user_id', user.id)
      .in('id', contactIds);

    if (!contacts?.length) {
      return NextResponse.json({ error: 'No contacts found' }, { status: 404 });
    }

    let updated = 0;
    const updatedContacts: { id: string; email_address: string | null; contact_first_name: string | null; contact_last_name: string | null }[] = [];
    for (const contact of contacts) {
      const prompt = buildPrompt(template, contact);
      const reqBody = {
        model,
        stream: false,
        messages: [{ role: 'user', content: prompt }],
      };

      const sep = '─'.repeat(60);
      console.log(`\n${sep}`);
      console.log('[Get Emails] Contact:', contact.name ?? contact.id, `(id: ${contact.id})`);
      console.log('[Get Emails] Model:', model);
      console.log('[Get Emails] PROMPT:');
      console.log(prompt);
      console.log(sep);

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
        // ignore parse error for logging
      }
      const content = data?.choices?.[0]?.message?.content ?? '';
      const usage = data?.usage;
      const tokensUsed = (usage?.total_tokens ?? (Number(usage?.prompt_tokens ?? 0) + Number(usage?.completion_tokens ?? 0))) || 0;
      const creditsToAdd = tokensUsed / 1000;

      console.log(`\n[Get Emails] RESPONSE (status ${res.status}):`);
      if (content) {
        console.log(content);
      } else if (!res.ok) {
        console.log(resText.slice(0, 1000));
      }
      const parsed = parseContactResponse(content);
      if (parsed && (parsed.email_address || parsed.contact_first_name || parsed.contact_last_name)) {
        console.log('[Get Emails] Parsed:', JSON.stringify(parsed));
      }
      console.log(sep + '\n');

      await incrementUsageCounter('usage.openrouter_calls');
      if (creditsToAdd > 0) {
        await addOpenRouterTokenUsage(creditsToAdd);
        if (contact.automation_id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const admin = (await createServerAdminClient()) as any;
          const { data: aut } = await admin.from('automations').select('credits_used').eq('id', contact.automation_id).single();
          const current = Number(aut?.credits_used ?? 0) || 0;
          await admin.from('automations').update({ credits_used: current + creditsToAdd, updated_at: new Date().toISOString() }).eq('id', contact.automation_id);
        }
      }

      const existingEmail = (contact as { email_address?: string | null }).email_address;
      const existingFirstName = (contact as { contact_first_name?: string | null }).contact_first_name;
      const existingLastName = (contact as { contact_last_name?: string | null }).contact_last_name;
      const hasExistingEmail = existingEmail?.trim() && existingEmail !== 'not_found';
      const existingEmailHasAt = (existingEmail?.trim() ?? '').includes('@');
      const clearNameIfNot = (v: string | null | undefined) =>
        v?.trim() && /\bnot\b/i.test(v) ? null : (v ?? null);

      if (!res.ok) {
        const emailToSet = hasExistingEmail ? existingEmail : 'not_found';
        const firstNameToSet = clearNameIfNot(existingFirstName);
        const lastNameToSet = clearNameIfNot(existingLastName);
        await supabase
          .from('saved_contacts')
          .update({
            email_address: emailToSet,
            contact_first_name: firstNameToSet,
            contact_last_name: lastNameToSet,
            contact_model: model,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contact.id)
          .eq('user_id', user.id);
        updated++;
        updatedContacts.push({
          id: contact.id,
          email_address: emailToSet ?? null,
          contact_first_name: firstNameToSet,
          contact_last_name: lastNameToSet,
        });
        continue;
      }

      const email = parsed?.email_address?.trim();
      const emailValid = isValidEmailFormat(email ? email : undefined);

      let emailValue: string | null;
      let firstName: string | null;
      let lastName: string | null;

      if (!emailValid && existingEmailHasAt) {
        // Leave email as is (has @) but still clear contact name to null if it contains "not"
        emailValue = existingEmail ?? null;
        firstName = clearNameIfNot(existingFirstName);
        lastName = clearNameIfNot(existingLastName);
      } else if (emailValid && email) {
        firstName = isValidContactName(parsed?.contact_first_name)
          ? (parsed?.contact_first_name?.trim() ?? existingFirstName ?? null)
          : null;
        lastName = isValidContactName(parsed?.contact_last_name)
          ? (parsed?.contact_last_name?.trim() ?? existingLastName ?? null)
          : null;
        const nameContainsNot =
          (typeof parsed?.contact_first_name === 'string' && /\bnot\b/i.test(parsed.contact_first_name)) ||
          (typeof parsed?.contact_last_name === 'string' && /\bnot\b/i.test(parsed.contact_last_name));
        emailValue = nameContainsNot && existingEmailHasAt ? (existingEmail ?? null) : (email ?? null);
      } else {
        // No @ in response and DB doesn't have @: set email to not_found and clear contact name
        emailValue = 'not_found';
        firstName = null;
        lastName = null;
      }

      await supabase
        .from('saved_contacts')
        .update({
          email_address: emailValue,
          contact_first_name: firstName,
          contact_last_name: lastName,
          contact_model: model,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contact.id)
        .eq('user_id', user.id);
      updated++;
      updatedContacts.push({
        id: contact.id,
        email_address: emailValue,
        contact_first_name: firstName,
        contact_last_name: lastName,
      });
    }

    return NextResponse.json({ updated, contacts: updatedContacts });
  } catch (err) {
    console.error('get-emails error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
