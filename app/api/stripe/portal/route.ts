import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getStripeClient, getStripeMode } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: userData } = await (supabase as any)
      .from('user_data')
      .select('settings')
      .eq('user_id', user.id)
      .single();

    const settings = userData?.settings as Record<string, unknown> | null;
    const stripeSettings = settings?.stripe as Record<string, unknown> | undefined;
    const customerId = stripeSettings?.customer_id as string | undefined;

    if (!customerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please complete a payment first.' },
        { status: 400 }
      );
    }

    const adminClient = await createServerAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mode = await getStripeMode(adminClient as any);
    const stripe = getStripeClient(mode);
    const origin =
      request.headers.get('origin') ??
      process.env.NEXT_PUBLIC_APP_URL ??
      (() => {
        const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
        const proto = request.headers.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
        return host ? `${proto}://${host}` : 'http://localhost:3000';
      })();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/app/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create portal session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
