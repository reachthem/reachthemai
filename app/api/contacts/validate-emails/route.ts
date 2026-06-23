import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  if (!email || email === 'not_found') return false;
  return EMAIL_REGEX.test(email.trim());
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
    if (contactIds.length === 0) {
      return NextResponse.json({ error: 'contactIds required' }, { status: 400 });
    }

    const { data: contacts } = await supabase
      .from('saved_contacts')
      .select('id, email_address')
      .eq('user_id', user.id)
      .in('id', contactIds);

    if (!contacts?.length) {
      return NextResponse.json({ validated: 0 });
    }

    const results: { id: string; email_validation_status: 'validated' | 'not_valid' | 'not_attempted' }[] = [];
    for (const c of contacts) {
      const email = c.email_address?.trim();
      if (!email || email === 'not_found') {
        results.push({ id: c.id, email_validation_status: 'not_attempted' });
        continue;
      }
      const status = isValidEmail(email) ? 'validated' : 'not_valid';
      await supabase
        .from('saved_contacts')
        .update({ email_validation_status: status, updated_at: new Date().toISOString() })
        .eq('id', c.id)
        .eq('user_id', user.id);
      results.push({ id: c.id, email_validation_status: status });
    }

    const validated = results.filter((r) => r.email_validation_status !== 'not_attempted').length;
    return NextResponse.json({ validated, results });
  } catch (err) {
    console.error('validate-emails error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
