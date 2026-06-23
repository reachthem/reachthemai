import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getStripeClient, getStripeMode, getActivePriceId, getAdvisorPriceId } from '@/lib/stripe';
import { setReadyForPayment } from '@/app/actions/removal-requests';

export async function POST(request: Request) {
  try {
    const sassClient = await createSSRSassClient();
    const supabase = sassClient.getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const draftKey: string | undefined = body.draft_key;
    const planType: string | undefined = body.plan_type;
    const removalRequestId: string | undefined = body.removal_request_id;

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

    // Handle Removal Advisor subscription checkout
    if (planType === 'removal_advisor') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const advisorPriceId = await getAdvisorPriceId(adminClient as any);

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: advisorPriceId, quantity: 1 }],
        metadata: {
          user_id: user.id,
          user_email: user.email ?? '',
          plan_key: 'removal_advisor_monthly',
          type: 'subscription',
        },
        customer_email: user.email,
        success_url: `${origin}/app/removal-advisor?subscription=success`,
        cancel_url: `${origin}/app/removal-advisor?subscription=cancelled`,
        allow_promotion_codes: true,
      });

      return NextResponse.json({ url: session.url });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const priceId = await getActivePriceId(adminClient as any);

    // Build metadata and URLs based on whether this is a removal request flow
    let metadata: Record<string, string> = {
      user_id: user.id,
      user_email: user.email ?? '',
      plan_key: 'review_removal',
      type: 'service',
    };
    let customerEmail = user.email;
    let successUrl = `${origin}/app/billing?payment=success`;
    let cancelUrl = `${origin}/pricing?payment=cancelled`;

    if (draftKey) {
      const record = await setReadyForPayment(draftKey);
      metadata = {
        ...metadata,
        removal_request_id: record.id,
        draft_key: record.draft_key,
        contact_email: record.contact_email,
      };
      customerEmail = record.contact_email || user.email;
      successUrl = `${origin}/submit-removal/success?session_id={CHECKOUT_SESSION_ID}`;
      cancelUrl = `${origin}/submit-removal?draft_key=${draftKey}`;
    } else if (removalRequestId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: record, error: lookupError } = await (adminClient as any)
        .from('removal_requests')
        .select('id, draft_key, contact_email, status, user_id')
        .eq('id', removalRequestId)
        .single();

      if (lookupError || !record) {
        return NextResponse.json({ error: 'Removal request not found' }, { status: 404 });
      }
      if (record.user_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      if (record.status !== 'ready_for_payment') {
        return NextResponse.json({ error: 'This request is not ready for payment' }, { status: 400 });
      }

      metadata = {
        ...metadata,
        removal_request_id: record.id,
        draft_key: record.draft_key ?? '',
        contact_email: record.contact_email ?? '',
      };
      customerEmail = record.contact_email || user.email;
      successUrl = `${origin}/app/my-removals?payment=success`;
      cancelUrl = `${origin}/app/my-removals?payment=cancelled`;
    }

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
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
