import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { incrementUsageCounter, addOpenRouterTokenUsage } from '@/app/actions/admin-settings';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const GOOGLE_PLACES_BASE = 'https://places.googleapis.com/v1/places';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_PAGES_PER_RUN = 3;
const PAGE_SIZE = 20;
const DEFAULT_EMAIL_PROMPT = `I want you to give me the best email address for this company. Use JSON: {"email_address":"...","contact_first_name":"...","contact_last_name":"..."}. Company: [business_name], [business_address], [business_website], [business_phone_number]`;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PlaceResult {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  primaryTypeDisplayName?: { text?: string };
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
}

function applyPlaceFilters(
  places: PlaceResult[],
  filters: {
    filter_rating_min?: number | null;
    filter_has_website?: string | null;
    filter_min_reviews?: number | null;
    filter_max_reviews?: number | null;
  }
): PlaceResult[] {
  return places.filter((p) => {
    if (filters.filter_rating_min != null && (p.rating ?? 0) < filters.filter_rating_min) return false;
    if (filters.filter_has_website === 'yes' && !p.websiteUri) return false;
    if (filters.filter_has_website === 'no' && p.websiteUri) return false;
    const reviews = p.userRatingCount ?? 0;
    if (filters.filter_min_reviews != null && reviews < filters.filter_min_reviews) return false;
    if (filters.filter_max_reviews != null && reviews > filters.filter_max_reviews) return false;
    return true;
  });
}

function buildEmailPrompt(
  template: string,
  contact: { name?: string | null; address?: string | null; website?: string | null; phone?: string | null }
): string {
  return template
    .replace(/\[business_name\]/g, contact.name ?? '')
    .replace(/\[business_address\]/g, contact.address ?? '')
    .replace(/\[business_website\]/g, contact.website ?? '')
    .replace(/\[business_phone_number\]/g, contact.phone ?? '');
}

function parseEmailResponse(text: string): { email_address?: string } | null {
  try {
    const trimmed = text.trim();
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    return {
      email_address: typeof parsed.email_address === 'string' ? parsed.email_address : undefined,
    };
  } catch {
    return null;
  }
}

function isValidEmailFormat(email: string | undefined): boolean {
  return typeof email === 'string' && email.trim().includes('@');
}

/** Get email for one contact via OpenRouter; update saved_contacts; return whether a valid email was found. */
async function getEmailForContactInCron(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  userId: string,
  contactId: string,
  model: string,
  template: string
): Promise<{ emailFound: boolean }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return { emailFound: false };

  const { data: contact } = await admin
    .from('saved_contacts')
    .select('id, name, address, website, phone')
    .eq('id', contactId)
    .eq('user_id', userId)
    .single();
  if (!contact) return { emailFound: false };

  const prompt = buildEmailPrompt(template, contact);
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const resText = await res.text();
  let data: { choices?: Array<{ message?: { content?: string } }>; usage?: { total_tokens?: number; prompt_tokens?: number; completion_tokens?: number } } = {};
  try {
    data = res.ok ? (JSON.parse(resText || '{}') as typeof data) : {};
  } catch {
    // ignore
  }
  const content = data?.choices?.[0]?.message?.content ?? '';
  const usage = data?.usage;
  const tokensUsed = (usage?.total_tokens ?? (Number(usage?.prompt_tokens ?? 0) + Number(usage?.completion_tokens ?? 0))) || 0;
  const creditsToAdd = tokensUsed / 1000;

  await incrementUsageCounter('usage.openrouter_calls');
  if (creditsToAdd > 0) await addOpenRouterTokenUsage(creditsToAdd);

  const parsed = parseEmailResponse(content);
  const email = parsed?.email_address?.trim();
  const emailFound = isValidEmailFormat(email);
  const emailValue = emailFound && email ? email : 'not_found';

  await admin
    .from('saved_contacts')
    .update({
      email_address: emailValue,
      contact_model: model,
      updated_at: new Date().toISOString(),
    })
    .eq('id', contactId)
    .eq('user_id', userId);

  return { emailFound };
}

/** Validate email format for one contact; return whether validated. */
async function validateEmailInCron(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  userId: string,
  contactId: string
): Promise<boolean> {
  const { data: row } = await admin
    .from('saved_contacts')
    .select('email_address')
    .eq('id', contactId)
    .eq('user_id', userId)
    .single();
  const email = row?.email_address?.trim();
  if (!email || email === 'not_found') return false;
  const valid = EMAIL_REGEX.test(email);
  await admin
    .from('saved_contacts')
    .update({
      email_validation_status: valid ? 'validated' : 'not_valid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', contactId)
    .eq('user_id', userId);
  return valid;
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Places API not configured' }, { status: 500 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (await createServerAdminClient()) as any;

    const { data: automations, error: listError } = await admin
      .from('automations')
      .select('id, user_id, keyword_phrases, current_keyword_index, page_token, max_contacts, contacts_found, total_runs, filter_rating_min, filter_has_website, filter_min_reviews, filter_max_reviews, automatically_get_contact_data, contact_ai_model, assign_to_list_id, validate_emails, do_not_add_without_contact, emails_found, emails_validated')
      .eq('status', 'active');

    if (listError || !automations?.length) {
      return NextResponse.json({ processed: 0, contactsSaved: 0, message: 'No active automations' });
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

    let totalSaved = 0;

    for (const automation of automations) {
      const phrases = Array.isArray(automation.keyword_phrases) ? automation.keyword_phrases : [];
      const idx = Number(automation.current_keyword_index) || 0;
      if (idx >= phrases.length) {
        await admin.from('automations').update({ status: 'complete', updated_at: new Date().toISOString() }).eq('id', automation.id);
        continue;
      }

      const phrase = String(phrases[idx] ?? '').trim();
      if (!phrase) {
        await admin.from('automations').update({ current_keyword_index: idx + 1, page_token: null, updated_at: new Date().toISOString() }).eq('id', automation.id);
        continue;
      }

      let pageToken: string | null = automation.page_token ?? null;
      let pagesDone = 0;
      let runningContactsFound = Number(automation.contacts_found) || 0;
      let runningEmailsFound = Number(automation.emails_found) || 0;
      let runningEmailsValidated = Number(automation.emails_validated) || 0;
      let runningTotalRuns = Number(automation.total_runs) || 0;
      const maxContacts = automation.max_contacts != null ? Number(automation.max_contacts) : null;
      const getContact = automation.automatically_get_contact_data === true;
      const validateEmails = automation.validate_emails === true;
      const doNotAddWithout = automation.do_not_add_without_contact === true;
      const model = (automation.contact_ai_model as string) || 'google/gemini-3.1-pro-preview';
      let emailPromptTemplate = DEFAULT_EMAIL_PROMPT;
      if (getContact) {
        const { data: setting } = await admin
          .from('admin_settings')
          .select('option_value')
          .eq('option_key', 'ai_contact.contact_retrieval_prompt')
          .single();
        if (setting?.option_value) emailPromptTemplate = setting.option_value;
      }

      while (pagesDone < MAX_PAGES_PER_RUN) {
        const body: Record<string, unknown> = { textQuery: phrase, pageSize: PAGE_SIZE };
        if (pageToken) body.pageToken = pageToken;

        const res = await fetch(`${GOOGLE_PLACES_BASE}:searchText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': fieldMask,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.error('Places API error for automation', automation.id, await res.text());
          break;
        }

        await incrementUsageCounter('usage.google_places_calls');
        runningTotalRuns += 1;

        const data = await res.json();
        const rawPlaces = (data.places ?? []) as PlaceResult[];
        const places = applyPlaceFilters(rawPlaces, {
          filter_rating_min: automation.filter_rating_min,
          filter_has_website: automation.filter_has_website,
          filter_min_reviews: automation.filter_min_reviews,
          filter_max_reviews: automation.filter_max_reviews,
        });
        const nextToken = data.nextPageToken ?? null;

        if (places.length > 0) {
          runningContactsFound += places.length;

          if (getContact) {
            for (const p of places) {
              const row = {
                user_id: automation.user_id,
                automation_id: automation.id,
                place_id: p.id,
                name: p.displayName?.text ?? null,
                address: p.formattedAddress ?? null,
                phone: p.nationalPhoneNumber ?? null,
                website: p.websiteUri ?? null,
                rating: p.rating ?? null,
                total_reviews: p.userRatingCount ?? null,
                primary_type: p.primaryTypeDisplayName?.text ?? null,
                maps_url: p.googleMapsUri ?? null,
                updated_at: new Date().toISOString(),
              };
              const { data: inserted } = await admin
                .from('saved_contacts')
                .upsert([row], { onConflict: 'user_id,place_id', ignoreDuplicates: true })
                .select('id');
              const contactId = inserted?.[0]?.id;
              if (!contactId) continue;

              const { emailFound } = await getEmailForContactInCron(
                admin,
                automation.user_id,
                contactId,
                model,
                emailPromptTemplate
              );
              if (emailFound) runningEmailsFound += 1;

              let validated = false;
              if (validateEmails) {
                validated = await validateEmailInCron(admin, automation.user_id, contactId);
                if (validated) runningEmailsValidated += 1;
              }

              const shouldRemove = doNotAddWithout && (!emailFound || (validateEmails && !validated));
              if (shouldRemove) {
                await admin.from('saved_contacts').delete().eq('id', contactId).eq('user_id', automation.user_id);
              } else {
                totalSaved += 1;
                if (automation.assign_to_list_id) {
                  await admin
                    .from('contact_list_members')
                    .upsert(
                      [{ contact_list_id: automation.assign_to_list_id, saved_contact_id: contactId }],
                      { onConflict: 'contact_list_id,saved_contact_id', ignoreDuplicates: true }
                    );
                }
              }
            }
          } else {
            const rows = places.map((p) => ({
              user_id: automation.user_id,
              automation_id: automation.id,
              place_id: p.id,
              name: p.displayName?.text ?? null,
              address: p.formattedAddress ?? null,
              phone: p.nationalPhoneNumber ?? null,
              website: p.websiteUri ?? null,
              rating: p.rating ?? null,
              total_reviews: p.userRatingCount ?? null,
              primary_type: p.primaryTypeDisplayName?.text ?? null,
              maps_url: p.googleMapsUri ?? null,
              updated_at: new Date().toISOString(),
            }));

            const { data: inserted } = await admin
              .from('saved_contacts')
              .upsert(rows, { onConflict: 'user_id,place_id', ignoreDuplicates: true })
              .select('id');

            const newCount = inserted?.length ?? 0;
            totalSaved += newCount;

            if (automation.assign_to_list_id && inserted?.length) {
              const memberRows = inserted.map((r: { id: string }) => ({
                contact_list_id: automation.assign_to_list_id,
                saved_contact_id: r.id,
              }));
              await admin
                .from('contact_list_members')
                .upsert(memberRows, { onConflict: 'contact_list_id,saved_contact_id', ignoreDuplicates: true });
            }
          }

          const hitMax = maxContacts != null && runningContactsFound >= maxContacts;

          await admin
            .from('automations')
            .update({
              contacts_found: runningContactsFound,
              emails_found: runningEmailsFound,
              emails_validated: runningEmailsValidated,
              total_runs: runningTotalRuns,
              updated_at: new Date().toISOString(),
            })
            .eq('id', automation.id);

          if (hitMax) {
            await admin
              .from('automations')
              .update({ status: 'complete', page_token: null, updated_at: new Date().toISOString() })
              .eq('id', automation.id);
            break;
          }
        }

        pagesDone++;
        pageToken = nextToken;

        if (!pageToken) {
          const newIdx = idx + 1;
          const isComplete = newIdx >= phrases.length;
          await admin
            .from('automations')
            .update({
              current_keyword_index: newIdx,
              page_token: null,
              status: isComplete ? 'complete' : 'active',
              total_runs: runningTotalRuns,
              emails_found: runningEmailsFound,
              emails_validated: runningEmailsValidated,
              updated_at: new Date().toISOString(),
            })
            .eq('id', automation.id);
          break;
        }

        await admin
          .from('automations')
          .update({
            page_token: pageToken,
            total_runs: runningTotalRuns,
            emails_found: runningEmailsFound,
            emails_validated: runningEmailsValidated,
            updated_at: new Date().toISOString(),
          })
          .eq('id', automation.id);
      }
    }

    return NextResponse.json({ processed: automations.length, contactsSaved: totalSaved });
  } catch (error) {
    console.error('run-automations cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
