import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getStripeClient, getStripeMode, getActivePriceId } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const removalRequestId: string | undefined = body.removal_request_id;

    if (!removalRequestId) {
      return NextResponse.json({ error: 'Removal request ID is required' }, { status: 400 });
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: record, error: lookupError } = await (adminClient as any)
      .from('removal_requests')
      .select('id, draft_key, contact_email, status, user_id')
      .eq('id', removalRequestId)
      .single();

    if (lookupError || !record) {
      return NextResponse.json({ error: 'Removal request not found' }, { status: 404 });
    }

    if (record.status !== 'ready_for_payment') {
      return NextResponse.json({ error: 'This request is not ready for payment' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const priceId = await getActivePriceId(adminClient as any);

    const metadata = {
      user_id: record.user_id, // Might be null if guest submission? But schema says user_id is likely required. If null, stripe might complain if we use it for lookup later.
      user_email: record.contact_email ?? '',
      plan_key: 'review_removal',
      type: 'service',
      removal_request_id: record.id,
      draft_key: record.draft_key ?? '',
      contact_email: record.contact_email ?? '',
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata,
      customer_email: record.contact_email,
      success_url: `${origin}/payment/${removalRequestId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/${removalRequestId}?cancelled=true`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
