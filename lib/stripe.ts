import Stripe from 'stripe';

export type StripeMode = 'sandbox' | 'live';

const stripeInstances: Partial<Record<StripeMode, Stripe>> = {};

function getSecretKeyForMode(mode: StripeMode): string {
  const key = mode === 'sandbox'
    ? process.env.SANDBOX_STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;
  if (!key) {
    const envVar = mode === 'sandbox' ? 'SANDBOX_STRIPE_SECRET_KEY' : 'STRIPE_SECRET_KEY';
    throw new Error(`${envVar} environment variable is not set`);
  }
  return key;
}

export function getWebhookSecretForMode(mode: StripeMode): string | undefined {
  return mode === 'sandbox'
    ? process.env.SANDBOX_STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET;
}

/** Returns publishable key for the given mode (for client-side use). */
export function getPublishableKeyForMode(mode: StripeMode): string | undefined {
  return mode === 'sandbox'
    ? process.env.SANDBOX_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStripeMode(supabaseClient: any): Promise<StripeMode> {
  const { data: modeRow } = await supabaseClient
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'stripe_mode')
    .single();

  const raw = modeRow?.option_value ?? 'sandbox';
  return raw === 'live' ? 'live' : 'sandbox';
}

export function getStripeClient(mode: StripeMode): Stripe {
  if (!stripeInstances[mode]) {
    const secretKey = getSecretKeyForMode(mode);
    stripeInstances[mode] = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    });
  }
  return stripeInstances[mode] as Stripe;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getActivePriceId(supabaseClient: any): Promise<string> {
  const { data: modeRow } = await supabaseClient
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'stripe_mode')
    .single();

  const mode = modeRow?.option_value ?? 'test';

  const priceKey = mode === 'live'
    ? 'stripe_price_id_review_removal_live'
    : 'stripe_price_id_review_removal_sandbox';

  const { data: priceRow } = await supabaseClient
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', priceKey)
    .single();

  const priceId = priceRow?.option_value ?? '';
  if (!priceId) {
    throw new Error(
      `Stripe price ID not configured for mode: ${mode}. Please set "${priceKey}" in admin_settings.`
    );
  }

  return priceId;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAdvisorPriceId(supabaseClient: any): Promise<string> {
  const { data: modeRow } = await supabaseClient
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', 'stripe_mode')
    .single();

  const mode = modeRow?.option_value ?? 'test';

  const priceKey = mode === 'live'
    ? 'stripe_price_id_removal_advisor_live'
    : 'stripe_price_id_removal_advisor_sandbox';

  const { data: priceRow } = await supabaseClient
    .from('admin_settings')
    .select('option_value')
    .eq('option_key', priceKey)
    .single();

  const priceId = priceRow?.option_value ?? '';
  if (!priceId) {
    throw new Error(
      `Stripe Removal Advisor price ID not configured for mode: ${mode}. Please set "${priceKey}" in admin_settings.`
    );
  }

  return priceId;
}
