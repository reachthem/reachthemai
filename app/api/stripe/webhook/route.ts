import { NextResponse } from 'next/server';
import { getStripeClient, getStripeMode, getWebhookSecretForMode } from '@/lib/stripe';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

// Required so Next.js does not parse the request body — Stripe needs raw bytes to verify the signature
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerAdminClient()) as any;
  const mode = await getStripeMode(supabase);
  const webhookSecret = getWebhookSecretForMode(mode);
  if (!webhookSecret) {
    const envVar = mode === 'sandbox' ? 'SANDBOX_STRIPE_WEBHOOK_SECRET' : 'STRIPE_WEBHOOK_SECRET';
    console.error(`${envVar} is not set`);
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const stripe = getStripeClient(mode);
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata ?? {};
        const userId = metadata.user_id;
        const planKey = metadata.plan_key ?? 'review_removal';
        const isSubscription = planKey === 'removal_advisor_monthly' || session.mode === 'subscription';

        if (!userId) {
          console.error('checkout.session.completed: missing user_id in metadata');
          break;
        }

        const amountTotal = session.amount_total ?? (isSubscription ? 1900 : 29900);
        const currency = session.currency ?? 'usd';
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;

        const { data: billingRow } = await supabase.from('billing_history').insert({
          user_id: userId,
          amount: amountTotal,
          currency,
          plan_name: isSubscription ? 'AI Removal Advisor' : 'Review Removal',
          plan_key: planKey,
          stripe_invoice_id: session.invoice as string | null ?? null,
          stripe_payment_intent_id: paymentIntentId ?? null,
          stripe_customer_id: customerId ?? null,
          status: 'paid',
          description: isSubscription
            ? 'AI Removal Advisor — $49/month subscription'
            : 'Negative review removal service — $299 per removal',
          billing_date: new Date().toISOString(),
        }).select('id').single();

        // Link removal request to billing if this was a removal flow
        const removalRequestId = metadata.removal_request_id;
        if (removalRequestId) {
          let query = supabase
            .from('removal_requests')
            .update({
              status: 'submitted',
              billing_history_id: billingRow?.id ?? null,
              stripe_payment_intent_id: paymentIntentId ?? null,
              user_id: userId,
              status_history: [...(await supabase.from('removal_requests').select('status_history').eq('id', removalRequestId).single()).data?.status_history ?? [], { status: 'submitted', changed_at: new Date().toISOString(), changed_by: 'system' }],
            })
            .eq('id', removalRequestId);

          if (metadata.draft_key) {
            query = query.eq('draft_key', metadata.draft_key);
          }

          const { error: removalError } = await query;

          if (removalError) {
            console.warn('Failed to update removal_request after payment:', removalError.message);
          }
        }

        // Update user_data settings with Stripe customer info
        const { data: userData } = await supabase
          .from('user_data')
          .select('settings')
          .eq('user_id', userId)
          .single();

        const existingSettings = (userData?.settings as Record<string, unknown>) ?? {};
        const userDataUpdate: Record<string, unknown> = {
          settings: {
            ...existingSettings,
            stripe: {
              customer_id: customerId,
              payment_intent_id: paymentIntentId,
              updated_at: new Date().toISOString(),
            },
          },
        };

        // For subscription purchases, update subscription_tier immediately using the
        // user_id from metadata — do not rely on subscription events which arrive
        // before customer_id is stored (race condition).
        if (isSubscription) {
          userDataUpdate.subscription_tier = 'removal_advisor';
        }

        await supabase
          .from('user_data')
          .update(userDataUpdate)
          .eq('user_id', userId);

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const priceId = subscription.items?.data?.[0]?.price?.id;

        if (priceId) {
          const { data: sandboxRow } = await supabase
            .from('admin_settings')
            .select('option_value')
            .eq('option_key', 'stripe_price_id_removal_advisor_sandbox')
            .single();
          const { data: liveRow } = await supabase
            .from('admin_settings')
            .select('option_value')
            .eq('option_key', 'stripe_price_id_removal_advisor_live')
            .single();

          const isAdvisorPrice =
            priceId === sandboxRow?.option_value || priceId === liveRow?.option_value;

          if (isAdvisorPrice) {
            const customerId = typeof subscription.customer === 'string'
              ? subscription.customer
              : subscription.customer?.id;

            if (customerId) {
              const { data: userData } = await supabase
                .from('user_data')
                .select('user_id, settings')
                .filter("settings->'stripe'->>'customer_id'", 'eq', customerId)
                .single();

              if (userData) {
                const isActive = subscription.status === 'active' || subscription.status === 'trialing';
                const newTier = isActive ? 'removal_advisor' : 'free';

                await supabase
                  .from('user_data')
                  .update({ subscription_tier: newTier })
                  .eq('user_id', userData.user_id);

                await supabase.from('billing_history').insert({
                  user_id: userData.user_id,
                  amount: 1900,
                  currency: 'usd',
                  plan_name: 'AI Removal Advisor',
                  plan_key: 'removal_advisor_monthly',
                  stripe_customer_id: customerId,
                  status: subscription.status,
                  description: 'AI Removal Advisor — $49/month subscription',
                  billing_date: new Date().toISOString(),
                });
              }
            }
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // We don't have user_id here directly — do a best-effort lookup by payment_intent_id
        // Primarily useful for audit trail / monitoring
        console.warn('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);

        // Try to find a matching billing history row to update status
        await supabase
          .from('billing_history')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        break;
      }

      default:
        // Unhandled event type — return 200 so Stripe doesn't retry
        break;
    }
  } catch (processingError) {
    console.error(`Error processing webhook event ${event.type}:`, processingError);
    // Return 200 with an error body so Stripe does not retry indefinitely
    return NextResponse.json(
      { received: true, error: 'Processing error — event logged' },
      { status: 200 }
    );
  }

  return NextResponse.json({ received: true });
}
